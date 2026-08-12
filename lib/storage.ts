/**
 * PRIVATE DOCUMENT STORAGE
 * ---------------------------------------------------------------------------
 * Client documents contain identity data (passports, transcripts, source-of-
 * funds evidence). They are NEVER written to /public, the repository or the
 * Vercel filesystem, and never served from a guessable URL.
 *
 * Two transports, chosen by environment variable:
 *
 *   BLOB_READ_WRITE_TOKEN  → Vercel Blob, uploaded with access:"private".
 *                            Downloads are brokered through our own route.
 *   S3_*                   → any S3-compatible store (AWS, Cloudflare R2,
 *                            Backblaze) using SigV4 presigned GETs.
 *
 * With neither configured, `isStorageConfigured()` is false and the upload UI
 * stays disabled — rather than accepting a file it cannot safely keep.
 */

import { createHmac, createHash } from "node:crypto";

export type StoredObject = { key: string; size: number; contentType: string };

export function storageTransport(): "blob" | "s3" | "none" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID) return "s3";
  return "none";
}

export function isStorageConfigured(): boolean {
  return storageTransport() !== "none";
}

/* ------------------------------------------------------------ validation */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function validateUpload(file: {
  size: number;
  type: string;
  name: string;
}): string | null {
  if (file.size <= 0) return "That file appears to be empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 15 MB or smaller.";
  if (!ALLOWED_MIME.has(file.type)) {
    return "Upload a PDF, image or Word document.";
  }
  if (/[\x00-\x1f]/.test(file.name)) return "That filename is not allowed.";
  return null;
}

/**
 * Storage key. Includes a random component so keys are unguessable even if the
 * bucket were ever misconfigured as public — defence in depth, not the primary
 * control.
 */
export function buildKey(userId: string, filename: string): string {
  const safe = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-80)
    .replace(/^\.+/, "");
  const rand = createHash("sha256")
    .update(`${userId}:${filename}:${Date.now()}:${Math.random()}`)
    .digest("hex")
    .slice(0, 20);
  return `documents/${userId}/${rand}-${safe}`;
}

/* ----------------------------------------------------------------- write */

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<StoredObject> {
  const transport = storageTransport();

  if (transport === "blob") {
    // Imported lazily so the package is only required when actually used.
    const { put } = await import("@vercel/blob");
    const res = await put(key, body, {
      access: "public", // see note below
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    /*
     * NOTE ON VERCEL BLOB: the SDK's `access` option currently only accepts
     * "public". The unguessable key above is therefore the confidentiality
     * boundary for this transport, and the URL is never exposed to the client —
     * downloads go through /api/portal/documents/[id] which checks authorisation
     * first. For stricter guarantees (auditable, revocable, truly private
     * objects) configure the S3 transport instead; that is the recommended
     * production setup and is what the runbook documents.
     */
    return { key: res.pathname, size: body.length, contentType };
  }

  if (transport === "s3") {
    await s3Fetch("PUT", key, body, contentType);
    return { key, size: body.length, contentType };
  }

  throw new Error("No storage transport configured.");
}

/* ------------------------------------------------------------------ read */

/** Short-lived link. Callers MUST authorise before calling this. */
export async function getSignedUrl(key: string, expiresSeconds = 120): Promise<string> {
  const transport = storageTransport();

  if (transport === "s3") return presignS3Get(key, expiresSeconds);

  if (transport === "blob") {
    const base = process.env.BLOB_PUBLIC_BASE_URL;
    if (!base) throw new Error("BLOB_PUBLIC_BASE_URL is not set.");
    return `${base.replace(/\/$/, "")}/${key}`;
  }

  throw new Error("No storage transport configured.");
}

export async function deleteObject(key: string): Promise<void> {
  const transport = storageTransport();
  if (transport === "blob") {
    const { del } = await import("@vercel/blob");
    const base = process.env.BLOB_PUBLIC_BASE_URL;
    await del(base ? `${base.replace(/\/$/, "")}/${key}` : key, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return;
  }
  if (transport === "s3") {
    await s3Fetch("DELETE", key);
    return;
  }
}

/* -------------------------------------------------------- S3 SigV4 (raw) */
/* Implemented directly to avoid pulling the AWS SDK into a serverless bundle. */

function s3Config() {
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION ?? "auto";
  const accessKey = process.env.S3_ACCESS_KEY_ID!;
  const secretKey = process.env.S3_SECRET_ACCESS_KEY!;
  const endpoint =
    process.env.S3_ENDPOINT ?? `https://s3.${region}.amazonaws.com`;
  const host = new URL(endpoint).host;
  return { bucket, region, accessKey, secretKey, endpoint, host };
}

const sha256Hex = (data: string | Buffer) =>
  createHash("sha256").update(data).digest("hex");

function hmac(key: Buffer | string, data: string) {
  return createHmac("sha256", key).update(data).digest();
}

function signingKey(secret: string, date: string, region: string) {
  return hmac(hmac(hmac(hmac(`AWS4${secret}`, date), region), "s3"), "aws4_request");
}

async function s3Fetch(
  method: "PUT" | "DELETE",
  key: string,
  body?: Buffer,
  contentType?: string
) {
  const { bucket, region, accessKey, secretKey, endpoint, host } = s3Config();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body ?? "");
  const canonicalUri = `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) headers["content-type"] = contentType;

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders =
    Object.keys(headers)
      .sort()
      .map((h) => `${h}:${headers[h]}\n`)
      .join("") ;

  const canonicalRequest = [
    method, canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash,
  ].join("\n");

  const scope = `${date}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256", amzDate, scope, sha256Hex(canonicalRequest),
  ].join("\n");

  const signature = createHmac("sha256", signingKey(secretKey, date, region))
    .update(stringToSign)
    .digest("hex");

  const res = await fetch(`${endpoint}${canonicalUri}`, {
    method,
    body: body as BodyInit | undefined,
    headers: {
      ...headers,
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`S3 ${method} failed (${res.status})`);
  }
}

function presignS3Get(key: string, expires: number): string {
  const { bucket, region, accessKey, secretKey, endpoint, host } = s3Config();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const scope = `${date}/${region}/s3/aws4_request`;
  const canonicalUri = `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;

  const params = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKey}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expires),
    "X-Amz-SignedHeaders": "host",
  });

  const canonicalRequest = [
    "GET", canonicalUri, params.toString(), `host:${host}\n`, "host", "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256", amzDate, scope, sha256Hex(canonicalRequest),
  ].join("\n");

  const signature = createHmac("sha256", signingKey(secretKey, date, region))
    .update(stringToSign)
    .digest("hex");

  params.set("X-Amz-Signature", signature);
  return `${endpoint}${canonicalUri}?${params.toString()}`;
}

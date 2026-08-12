import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options?: { N?: number; r?: number; p?: number; maxmem?: number }
) => Promise<Buffer>;

/**
 * Password hashing — scrypt from node:crypto.
 *
 * scrypt is memory-hard and ships with Node, so there is no native build step
 * and no extra dependency. Parameters follow current OWASP guidance
 * (N=2^16, r=8, p=1). Stored format is self-describing so the cost can be
 * raised later and old hashes still verify:
 *
 *   scrypt$N$r$p$<salt-b64>$<hash-b64>
 *
 * Passwords are never logged, never returned, and never leave the server.
 */

const N = 65536; // 2^16
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 160 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, KEYLEN, {
    N,
    r: R,
    p: P,
    maxmem: MAXMEM,
  });
  return [
    "scrypt",
    N,
    R,
    P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;

    const [, n, r, p, saltB64, hashB64] = parts;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");

    const derived = await scrypt(password.normalize("NFKC"), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: MAXMEM,
    });

    // Constant-time: length check first, then timingSafeEqual on equal buffers.
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Minimum viable policy. Deliberately not a maze of character classes. */
export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(password)) return "Include at least one letter.";
  if (!/[0-9]/.test(password) && !/[^a-zA-Z0-9]/.test(password)) {
    return "Include at least one number or symbol.";
  }
  return null;
}

/**
 * OUTBOUND EMAIL
 * ---------------------------------------------------------------------------
 * Provider-agnostic, dependency-free. Two transports are supported and both
 * are driven purely by environment variables, so going live is configuration
 * rather than a code change:
 *
 *   RESEND_API_KEY   → Resend REST API
 *   MAIL_WEBHOOK_URL → POST the payload to any endpoint (Zapier, Make, n8n,
 *                      a CRM intake, or your own SMTP relay service)
 *
 * MAIL_FROM   sender address on a domain you control and have verified
 * MAIL_TO     destination (defaults to info@snzventures.com)
 *
 * If neither transport is configured, `sendMail` throws rather than silently
 * discarding the message — a lost enquiry is worse than a visible failure.
 * Callers that must not hard-fail should check `mailConfigured()` first.
 */

export type MailMessage = {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export const DEFAULT_TO = "info@snzventures.com";

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.MAIL_WEBHOOK_URL);
}

export function mailTransport(): "resend" | "webhook" | "none" {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.MAIL_WEBHOOK_URL) return "webhook";
  return "none";
}

export async function sendMail(message: MailMessage): Promise<void> {
  const to = message.to ?? process.env.MAIL_TO ?? DEFAULT_TO;
  const from = process.env.MAIL_FROM ?? `SnZ Ventures <noreply@snzventures.com>`;

  const transport = mailTransport();

  if (transport === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend rejected the message (${res.status}): ${detail.slice(0, 200)}`);
    }
    return;
  }

  if (transport === "webhook") {
    const res = await fetch(process.env.MAIL_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.MAIL_WEBHOOK_SECRET
          ? { "X-Webhook-Secret": process.env.MAIL_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({ from, to, ...message }),
    });
    if (!res.ok) {
      throw new Error(`Mail webhook rejected the message (${res.status})`);
    }
    return;
  }

  throw new Error(
    "No mail transport configured. Set RESEND_API_KEY or MAIL_WEBHOOK_URL."
  );
}

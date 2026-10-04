/**
 * ONE ENQUIRY, TWO CHANNELS.
 *
 * Every enquiry from the website reaches SnZ twice: by email (sent by the
 * server, app/api/enquiry) and on WhatsApp (sent by the student, from the
 * success screen, with the message pre-filled). Shared by the server route
 * and the client form so both describe the enquiry the same way. No secrets
 * and no server-only imports in here.
 */

const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  destination: "Destination",
  level: "Level",
};

/**
 * The WhatsApp message the student sends after submitting the form.
 * WhatsApp renders *text* as bold. Empty answers are left out.
 */
export function enquiryWhatsAppText(answers: Record<string, string>): string {
  const lines = ["Hello SnZ Ventures, I have just booked a free consultation on your website.", ""];
  for (const key of Object.keys(LABELS)) {
    const v = answers[key]?.trim();
    if (v) lines.push(`*${LABELS[key]}:* ${v}`);
  }
  if (!answers.destination?.trim()) lines.push(`*Destination:* Not sure yet`);
  return lines.join("\n");
}

/** The email subject line. */
export function enquiryEmailSubject(pathwayLabel: string, name: string): string {
  return `SnZ enquiry: ${pathwayLabel}, ${name}`;
}

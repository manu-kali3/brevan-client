import { Resend } from "resend";
import { storeEmail } from "@/lib/supabase";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "brevansoftwares@gmail.com";
const FROM =
  process.env.EMAIL_FROM ?? "Brevan Softwares <onboarding@resend.dev>";

export interface EmailInput {
  type: string;
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends an email (if Resend is configured) and records the result in the
 * `emails` table. Returns true if the email was sent OR successfully logged,
 * so a storage-only failure never blocks the form response.
 */
export async function sendEmail(input: EmailInput): Promise<boolean> {
  let sent = false;

  if (resend) {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [input.to],
      // Belt and braces: never pass raw line breaks into the subject.
      subject: input.subject.replace(/[\r\n]+/g, " ").trim(),
      text: input.text,
    });
    if (!error) {
      sent = true;
    } else {
      console.error("Resend error:", error);
    }
  }

  const logged = await storeEmail({
    type: input.type,
    from: FROM,
    to: input.to,
    subject: input.subject,
    body: input.text,
    delivered: sent,
  });

  return sent || logged;
}

export function ownerNotification(type: "quote" | "contact", fields: Record<string, string>, message: string): EmailInput {
  return {
    type: `notification-${type}`,
    to: CONTACT_EMAIL,
    subject: `New ${type === "quote" ? "Quote Request" : "Contact Message"}: ${
      fields.subject || fields.service || "Website"
    }`,
    text: [
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      ...(fields.phone ? [`Phone: ${fields.phone}`] : []),
      ...(fields.subject ? [`Subject: ${fields.subject}`] : []),
      ...(fields.service ? [`Service Needed: ${fields.service}`] : []),
      "",
      message,
    ].join("\n"),
  };
}

export function autoresponse(type: "quote" | "contact", name: string, email: string): EmailInput {
  const service = type === "quote" ? "quote request" : "message";
  return {
    type: `autoresponse-${type}`,
    to: email,
    subject: `We received your ${service}`,
    text: `Hi ${name || "there"},

Thank you for contacting Brevan Softwares. We have received your ${service} and will get back to you as soon as possible.

For a faster response you can reach us at:
Email: brevansoftwares@gmail.com
Phone: +254 117 004 147

Best regards,
The Brevan Softwares Team`,
  };
}

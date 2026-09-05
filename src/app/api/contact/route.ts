import { NextResponse } from "next/server";
import { storeLead } from "@/lib/supabase";
import { sendEmail, ownerNotification, autoresponse } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { stripCRLF } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_FIELD = 5000;

export async function POST(request: Request) {
  const limiter = rateLimit(`contact:${clientIp(request)}`, 10, 10 * 60 * 1000);
  if (!limiter.ok) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfter) } }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = stripCRLF(body.name ?? "");
  const phone = stripCRLF(body.phone ?? "");
  const email = stripCRLF(body.email ?? "");
  const subject = stripCRLF(body.subject ?? "");
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please provide your name, email and message." },
      { status: 400 }
    );
  }
  if (name.length > 200 || subject.length > 300 || message.length > MAX_FIELD) {
    return NextResponse.json({ error: "Please shorten your message." }, { status: 400 });
  }

  const emailPattern = /^[^ @]+@[^ @]+$/;
  if (!emailPattern.test(email) || email.length > 320) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  let anyDelivered = false;

  const stored = await storeLead({ type: "contact", name, email, phone, subject, message });
  if (stored) anyDelivered = true;

  const notified = await sendEmail(
    ownerNotification("contact", { name, email, phone, subject }, message)
  );
  if (notified) anyDelivered = true;

  const auto = await sendEmail(autoresponse("contact", name, email));
  if (auto) anyDelivered = true;

  if (!anyDelivered) {
    return NextResponse.json(
      { error: "Submissions are not configured yet. Please contact us by email." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}

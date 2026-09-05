import { NextResponse } from "next/server";
import { storeLead } from "@/lib/supabase";
import { sendEmail, ownerNotification, autoresponse } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { stripCRLF } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limiter = rateLimit(`quote:${clientIp(request)}`, 10, 10 * 60 * 1000);
  if (!limiter.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
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
  const email = stripCRLF(body.email ?? "");
  const subject = stripCRLF(body.subject ?? "");
  const service = stripCRLF(body.service ?? "");

  if (!name || !email) {
    return NextResponse.json(
      { error: "Please provide your name and email address." },
      { status: 400 }
    );
  }
  if (name.length > 200 || subject.length > 300 || service.length > 500) {
    return NextResponse.json({ error: "Please shorten your request." }, { status: 400 });
  }

  const emailPattern = /^[^ @]+@[^ @]+$/;
  if (!emailPattern.test(email) || email.length > 320) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  let anyDelivered = false;

  const stored = await storeLead({ type: "quote", name, email, subject, service });
  if (stored) anyDelivered = true;

  const notified = await sendEmail(
    ownerNotification("quote", { name, email, subject, service }, "A new quote request was submitted on the website.")
  );
  if (notified) anyDelivered = true;

  const auto = await sendEmail(autoresponse("quote", name, email));
  if (auto) anyDelivered = true;

  if (!anyDelivered) {
    return NextResponse.json(
      { error: "Submissions are not configured yet. Please contact us by email." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}

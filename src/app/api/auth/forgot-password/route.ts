import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
const EMAIL_PATTERN = /^[^ @]+@[^ @]+$/;
export async function POST(request: Request) {
  let body: { email?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  if (!email || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const rl = rateLimit(`forgot:${clientIp(request)}:${email.toLowerCase()}`, 3, 10 * 60 * 1000);
  if (rl.ok) {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/auth/update-password` });
    if (error) console.error("forgot:", error.message);
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
const EMAIL_PATTERN = /^[^ @]+@[^ @]+$/;
export async function POST(request: Request) {
  let body: { email?: string; password?: string; full_name?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const fullName = body.full_name?.trim() ?? "";
  if (!email || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const rl = rateLimit(`signup:${clientIp(request)}:${email.toLowerCase()}`, 10, 15 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName || null }, emailRedirectTo: `${siteUrl}/auth/callback?next=/bookings` } });
  if (error) return NextResponse.json({ error: "Could not create account. Try again." }, { status: 400 });
  const session = (data as any).session;
  if (session) { const { error: sErr } = await supabase.auth.setSession(session); if (sErr) console.error(sErr.message); }
  return NextResponse.json({ ok: true, requiresConfirmation: !session });
}

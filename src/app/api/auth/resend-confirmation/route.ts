import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let body: { email?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });
  const rl = rateLimit(`resend:${clientIp(request)}:${email.toLowerCase()}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";
  const { error } = await admin.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/bookings` } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { send2FACode } from "@/lib/2fa";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rl = rateLimit(`2fa-resend:${clientIp(request)}`, 3, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  let body: { email?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  const { data } = await admin.auth.admin.listUsers();
  const u = data.users.find((x: any) => x.email?.toLowerCase() === email.toLowerCase());
  if (!u) return NextResponse.json({ ok: true });
  await send2FACode(u.id, email);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { verify2FACode } from "@/lib/2fa";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rl = rateLimit(`2fa:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  let body: { email?: string; password?: string; code?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const code = body.code?.trim() ?? "";
  if (!email || !password || !code) return NextResponse.json({ error: "All fields required." }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  const { data: userRes } = await admin.auth.admin.listUsers();
  const u = userRes.users.find((x: any) => x.email?.toLowerCase() === email.toLowerCase());
  if (!u) return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  const v = await verify2FACode(u.id, code);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Verification succeeded but login failed. Try again." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

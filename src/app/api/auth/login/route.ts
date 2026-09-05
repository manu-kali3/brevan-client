import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { send2FACode } from "@/lib/2fa";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const rl = rateLimit(`login:${clientIp(request)}:${email.toLowerCase()}`, 10, 15 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  const userId = data.user?.id;
  if (!userId) return NextResponse.json({ error: "Login failed." }, { status: 500 });
  const admin = createAdminClient();
  if (admin) {
    const { data: pref } = await admin.from("user_preferences").select("enable_2fa").eq("user_id", userId).single();
    const enabled = (pref as any)?.enable_2fa ?? true;
    if (!enabled) {
      return NextResponse.json({ ok: true, needs2FA: false });
    }
  }
  await supabase.auth.signOut();
  try {
    await send2FACode(userId, email);
  } catch (e: any) {
    console.error("2fa send", e.message);
    return NextResponse.json({ error: "Could not send verification code." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, needs2FA: true, email });
}

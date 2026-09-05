import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rl = rateLimit(`settings:${clientIp(request)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: { full_name?: string; phone?: string; enable2FA?: boolean };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }
  const fullName = body.full_name?.trim().slice(0, 200) ?? "";
  const phone = body.phone?.trim().slice(0, 32) ?? "";
  const enable2FA = body.enable2FA ?? true;
  if (phone && !/^[\d+\s-]{7,32}$/.test(phone)) return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 500 });

  await admin.from("profiles").upsert({ id: user.id, full_name: fullName || null, phone: phone || null }, { onConflict: "id" });
  await admin.from("user_preferences").upsert({ user_id: user.id, enable_2fa: !!enable2FA, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true });
}

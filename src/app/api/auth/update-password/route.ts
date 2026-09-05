import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let body: { code?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const password = body.password ?? "";
  const code = body.code?.trim() ?? "";
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 chars." }, { status: 400 });
  const supabase = await createClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

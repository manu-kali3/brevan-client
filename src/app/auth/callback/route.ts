import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
export const runtime = "nodejs";
function safeNext(raw: string | null) {
  if (!raw) return "/bookings";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) return raw;
  return "/bookings";
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  if (!code) return NextResponse.redirect(new URL("/login?error=oauth_failed", url.origin));
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/login?error=oauth_failed", url.origin));
  return NextResponse.redirect(new URL(next, url.origin));
}

import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const bookingId = new URL(request.url).searchParams.get("booking_id")?.trim() ?? "";
  if (!bookingId) return NextResponse.json({ error: "booking_id required." }, { status: 400 });
  const { data: booking } = await supabase.from("service_bookings").select("id").eq("id", bookingId).eq("user_id", user.id).single();
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data, error } = await supabase.from("service_comments").select("id,booking_id,body,is_admin,created_at,user_id").eq("booking_id", bookingId).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data ?? [] });
}
export async function POST(request: Request) {
  const rl = rateLimit(`comments:${clientIp(request)}`, 30, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many messages. Try later." }, { status: 429 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let body: { booking_id?: string; body?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }
  const bookingId = body.booking_id?.trim() ?? "";
  const text = body.body?.trim() ?? "";
  if (!bookingId) return NextResponse.json({ error: "booking_id required." }, { status: 400 });
  if (!text || text.length > 5000) return NextResponse.json({ error: "Message must be 1-5000 chars." }, { status: 400 });
  const { data: booking } = await supabase.from("service_bookings").select("id").eq("id", bookingId).eq("user_id", user.id).single();
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  const admin = createAdminClient();
  const client = admin ?? supabase;
  const { data, error } = await (client as any).from("service_comments").insert([{ booking_id: bookingId, user_id: user.id, body: text, is_admin: false }]).select("id,booking_id,body,is_admin,created_at,user_id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, comment: data });
}

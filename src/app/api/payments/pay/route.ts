import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { payheroStkPush } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rl = rateLimit(`pay:${clientIp(request)}`, 5, 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: { bookingId?: string; phone?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid." }, { status: 400 }); }
  const bookingId = body.bookingId?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  if (!bookingId || !phone) return NextResponse.json({ error: "Booking and phone required." }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable." }, { status: 500 });
  const { data: booking } = await admin.from("service_bookings").select("id,user_id,status,amount,payment_status,project_url").eq("id", bookingId).eq("user_id", user.id).single();
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  if (booking.status !== "completed") return NextResponse.json({ error: "Project not yet completed by admin." }, { status: 400 });
  if (booking.payment_status === "paid") return NextResponse.json({ error: "Already paid." }, { status: 400 });
  if (!booking.amount || Number(booking.amount) <= 0) return NextResponse.json({ error: "No amount set by admin yet." }, { status: 400 });
  const result = await payheroStkPush({ amount: Number(booking.amount), phone, externalRef: bookingId });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  await admin.from("service_bookings").update({ payment_ref: result.reference }).eq("id", bookingId);
  return NextResponse.json({ ok: true, reference: result.reference, message: result.message });
}

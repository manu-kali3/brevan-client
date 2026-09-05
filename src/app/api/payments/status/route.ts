import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { payheroTransactionStatus } from "@/lib/payments";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const bookingId = new URL(request.url).searchParams.get("bookingId") ?? "";
  if (!bookingId) return NextResponse.json({ error: "bookingId required." }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable." }, { status: 500 });
  const { data: booking } = await admin.from("service_bookings").select("id,payment_ref,payment_status").eq("id", bookingId).eq("user_id", user.id).single();
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (booking.payment_status === "paid") return NextResponse.json({ status: "paid" });
  if (!booking.payment_ref) return NextResponse.json({ status: "pending" });
  const s = await payheroTransactionStatus(booking.payment_ref);
  if (s.status === "SUCCESS") {
    await admin.from("service_bookings").update({ payment_status: "paid" }).eq("id", bookingId);
    return NextResponse.json({ status: "paid", receipt: s.receipt });
  }
  if (s.status === "FAILED") return NextResponse.json({ status: "failed" });
  return NextResponse.json({ status: "pending" });
}

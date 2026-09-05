import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { payheroTransactionStatus } from "@/lib/payments";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rl = rateLimit(`webhook:${clientIp(request)}`, 60, 60 * 1000);
  if (!rl.ok) return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  let payload: any;
  try { payload = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const body = payload?.response ?? payload ?? {};
  const externalRef = body.ExternalReference ?? payload.external_reference;
  const status = String(body.Status ?? body.status ?? "").toUpperCase();
  if (!externalRef) return NextResponse.json({ ok: true });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: true });
  const { data: booking } = await admin.from("service_bookings").select("id,payment_ref").eq("id", String(externalRef)).single();
  if (!booking) return NextResponse.json({ ok: true });
  if (status === "SUCCESS" || status === "PAID") {
    const v = await payheroTransactionStatus(booking.payment_ref ?? String(externalRef));
    if (v.status === "SUCCESS") {
      await admin.from("service_bookings").update({ payment_status: "paid" }).eq("id", booking.id);
    }
  }
  return NextResponse.json({ ok: true });
}

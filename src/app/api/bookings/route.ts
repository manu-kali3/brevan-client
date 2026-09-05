import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { data, error } = await supabase.from("service_bookings").select("id,service,description,status,amount,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data ?? [] });
}
export async function POST(request: Request) {
  const rl = rateLimit(`bookings:${clientIp(request)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let body: { service?: string; description?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }
  const service = body.service?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  if (!service || service.length > 200) return NextResponse.json({ error: "Service required." }, { status: 400 });
  if (description.length > 5000) return NextResponse.json({ error: "Description too long." }, { status: 400 });
  const admin = createAdminClient();
  const client = admin ?? supabase;
  const { data, error } = await (client as any).from("service_bookings").insert([{ user_id: user.id, service, description: description || null, status: "pending" }]).select("id,service,description,status,amount,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, booking: data });
}

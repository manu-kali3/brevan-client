import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Bookings", description: "View your service bookings and message thread.", robots: { index: false, follow: false } };

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div style={{ maxWidth: 640, margin: "48px auto", textAlign: "center" }}><p>Please <a href="/login" style={{ color: "#43ba7f" }}>sign in</a> to view bookings.</p></div>;
  const { data: bookings } = await supabase.from("service_bookings").select("id,service,description,status,amount,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return <BookingsClient initialBookings={bookings ?? []} userId={user.id} />;
}

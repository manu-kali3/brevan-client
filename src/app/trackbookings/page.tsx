import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Track Bookings", description: "Track your service bookings, access project links and suggest changes.", robots: { index: false, follow: false } };

import { redirect } from "next/navigation";

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/trackbookings");
  const { data: bookings } = await supabase.from("service_bookings").select("id,service,description,status,amount,created_at,project_url,payment_status").eq("user_id", user.id).order("created_at", { ascending: false });
  return <BookingsClient initialBookings={(bookings ?? []) as any} userId={user.id} />;
}

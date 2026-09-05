import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Bookings", description: "View your service bookings and message thread.", robots: { index: false, follow: false } };

import { redirect } from "next/navigation";

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/bookings");
  const { data: bookings } = await supabase.from("service_bookings").select("id,service,description,status,amount,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return <BookingsClient initialBookings={bookings ?? []} userId={user.id} />;
}

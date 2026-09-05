"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowser } from "@/lib/supabase-browser";

export default function HeroActions() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const s = createBrowser();
    s.auth.getSession().then(({ data }) => setUser(data.session?.user ? { id: data.session.user.id } : null));
    const { data: sub } = s.auth.onAuthStateChange((_e, session) => setUser(session?.user ? { id: session.user.id } : null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link href="/trackbookings" style={{ background: "#ff511a", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>My bookings</Link>
        <Link href="/settings" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Settings</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
      <Link href="/login" style={{ background: "#43ba7f", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
      <Link href="/signup" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Create account</Link>
      <Link href="/trackbookings" style={{ background: "#ff511a", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>My bookings</Link>
    </div>
  );
}

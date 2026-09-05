import Link from "next/link";
export default function NotFound() {
  return (
    <div style={{ maxWidth: 520, margin: "80px auto", textAlign: "center", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, color: "#212741" }}>Bookings not found</h1>
      <p style={{ color: "#667085", marginTop: 8 }}>No booking matches that link or you may need to sign in.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
        <Link href="/trackbookings" style={{ background: "#43ba7f", color: "#fff", padding: "10px 18px", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>My track bookings</Link>
        <Link href="/login" style={{ border: "1px solid #e5e7eb", padding: "10px 18px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#212741" }}>Sign in</Link>
      </div>
    </div>
  );
}

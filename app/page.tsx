import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>My Service Bookings</h1>
      <p>View your bookings for Brevan services and comment to request changes.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href="/bookings" style={{ background: "#43ba7f", color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>View bookings</Link>
        <Link href="/login" style={{ border: "1px solid #e8eaf0", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
      </div>
      <div style={{ marginTop: 32, background: "#fff", border: "1px solid #e8eaf0", borderRadius: 12, padding: 20 }}>
        <h3>How it works</h3>
        <ol style={{ color: "#667085" }}>
          <li>Sign in with your email</li>
          <li>Book a service (Web, App, Branding...)</li>
          <li>Open your booking → comment to request changes — admin replies same thread</li>
        </ol>
      </div>
    </div>
  );
}

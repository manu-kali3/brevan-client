import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="swiper-container" style={{ background: "linear-gradient(135deg, #1a2138 0%, #20294a 60%, #1e6a48 130%)", padding: "88px 0 72px", color: "#fff" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#43ba7f", fontWeight: 700 }}>Client Portal</span>
              <h1 style={{ fontSize: 42, fontWeight: 800, margin: "16px 0 12px", lineHeight: 1.15, color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
                Track your <em style={{ color: "#43ba7f", fontStyle: "normal" }}>service</em> &amp; request <em style={{ color: "#ff511a", fontStyle: "normal" }}>changes</em>
              </h1>
              <p style={{ color: "#ffffff", opacity: 0.92, fontSize: 16, maxWidth: 560, textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>Same trusted Brevan design. Sign in to view your bookings, check status, and comment directly on your service — admin replies in the same thread.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <Link href="/login" className="btn" style={{ background: "#43ba7f", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
                <Link href="/signup" className="btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Create account</Link>
                <Link href="/bookings" className="btn" style={{ background: "#ff511a", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>My bookings</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div style={{ border: "1px solid #e8eaf0", borderRadius: 12, padding: 20 }}>
                <h4>1. Book a service</h4>
                <p style={{ color: "#667085", fontSize: 14 }}>Request via Brevan Softwares — your booking appears here automatically.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ border: "1px solid #e8eaf0", borderRadius: 12, padding: 20 }}>
                <h4>2. Comment changes</h4>
                <p style={{ color: "#667085", fontSize: 14 }}>Open any booking → write what to change. Attach details, admin sees instantly.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ border: "1px solid #e8eaf0", borderRadius: 12, padding: 20 }}>
                <h4>3. Get updates</h4>
                <p style={{ color: "#667085", fontSize: 14 }}>Brevan team replies in the same thread. Status moves: pending → review → completed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

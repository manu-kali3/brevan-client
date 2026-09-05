import Link from "next/link";

export default function ClientFooter() {
  return (
    <footer style={{ background: "#1a2138", color: "rgba(255,255,255,0.7)", padding: "32px 0 20px", marginTop: 48 }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/assets/images/brevan-logo.jpg" alt="Brevan" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 800 }}>Brevan Client</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Track bookings & request changes</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.75)" }}>Terms</Link>
            <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.75)" }}>Privacy</Link>
            <a href="mailto:brevansoftwares@gmail.com" style={{ color: "rgba(255,255,255,0.75)" }}>brevansoftwares@gmail.com</a>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>© 2026 Brevan Softwares — Client Portal. All rights reserved.</div>
      </div>
    </footer>
  );
}

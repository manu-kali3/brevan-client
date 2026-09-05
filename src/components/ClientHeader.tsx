"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ClientHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");
  const linkStyle = (active: boolean) => ({
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    color: active ? "#fff" : "rgba(255,255,255,0.85)",
    background: active ? "rgba(67,186,127,0.22)" : "transparent",
    textDecoration: "none",
  });

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#1a2138", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, gap: 16 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }} onClick={() => setOpen(false)}>
          <img src="/assets/images/brevan-logo.jpg" alt="Brevan" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Brevan <span style={{ color: "#43ba7f" }}>Client</span></span>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700, borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: 10, marginLeft: 2 }}>Portal</span>
        </Link>

        <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="d-none d-md-flex">
          <Link href="/" style={linkStyle(pathname === "/")}>Home</Link>
          <Link href="/bookings" style={linkStyle(isActive("/bookings"))}>My Bookings</Link>
          <Link href="/terms" style={linkStyle(isActive("/terms"))}>Terms</Link>
          <Link href="/privacy-policy" style={linkStyle(isActive("/privacy-policy"))}>Privacy</Link>
          <Link href="/login" style={{ ...linkStyle(isActive("/login")), border: "1px solid rgba(255,255,255,0.2)", marginLeft: 6 }}>Sign in</Link>
          <Link href="/signup" style={{ background: "#43ba7f", color: "#fff", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", marginLeft: 4 }}>Create account</Link>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="d-md-none" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 12px", fontWeight: 700 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "#1a2138", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <Link href="/" onClick={() => setOpen(false)} style={linkStyle(pathname === "/")}>Home</Link>
          <Link href="/bookings" onClick={() => setOpen(false)} style={linkStyle(isActive("/bookings"))}>My Bookings</Link>
          <Link href="/terms" onClick={() => setOpen(false)} style={linkStyle(isActive("/terms"))}>Terms</Link>
          <Link href="/privacy-policy" onClick={() => setOpen(false)} style={linkStyle(isActive("/privacy-policy"))}>Privacy</Link>
          <Link href="/login" onClick={() => setOpen(false)} style={{ ...linkStyle(isActive("/login")), textAlign: "center" }}>Sign in</Link>
          <Link href="/signup" onClick={() => setOpen(false)} style={{ background: "#43ba7f", color: "#fff", padding: "10px", borderRadius: 8, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>Create account</Link>
        </div>
      )}
    </header>
  );
}

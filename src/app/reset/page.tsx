"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const d = await res.json();
      if (!res.ok) { setErr(d.error ?? "Could not send."); setBusy(false); return; }
      setSent(true);
    } catch { setErr("Something went wrong."); }
    setBusy(false);
  }
  return (
    <div style={{ maxWidth: 440, margin: "48px auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28 }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Reset password</h1>
      {sent ? <><div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>If an account exists for <strong>{email}</strong>, a reset link has been sent. Check spam if you don&apos;t see it.</div><p><Link href="/login" style={{ color: "#43ba7f", fontWeight: 600 }}>Back to sign in</Link></p></> : (
        <>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 14px" }}>Enter your email to receive a reset link.</p>
          {err && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{err}</div>}
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 14 }}><label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} /></div>
            <button disabled={busy} style={{ width: "100%", padding: "11px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{busy ? "Sending…" : "Send reset link"}</button>
          </form>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 14 }}><Link href="/login" style={{ color: "#43ba7f" }}>Back to sign in</Link></p>
        </>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResendMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, full_name: fullName }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Sign-up failed."); setBusy(false); return; }
      if (data.requiresConfirmation) { setNeedsConfirm(true); setInfo("Check your email to confirm your account, then sign in. If you don't see it, check spam."); setBusy(false); }
      else { router.push("/bookings"); router.refresh(); }
    } catch { setError("Something went wrong. Try again."); setBusy(false); }
  }

  async function onResend() {
    if (!email.trim()) return;
    setResending(true); setResendMsg("");
    try {
      const res = await fetch("/api/auth/resend-confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) setResendMsg(data.error ?? "Could not resend.");
      else setResendMsg("A new confirmation link has been sent.");
    } catch { setResendMsg("Could not resend. Try again."); }
    finally { setResending(false); }
  }

  return (
    <div style={{ maxWidth: 440, margin: "48px auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28, boxShadow: "0 10px 30px rgba(33,39,65,.08)" }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Create your account</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Track service bookings and chat with our team.</p>
      {error && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{error}</div>}
      {info && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{info}</div>}
      {needsConfirm && <div style={{ marginBottom: 14 }}><button type="button" onClick={onResend} disabled={resending} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 600, cursor: "pointer" }}>{resending ? "Resending…" : "Resend confirmation link"}</button>{resendMsg && <div style={{ marginTop: 8, fontSize: 13, color: resendMsg.includes("Could") ? "#b3261e" : "#1c7a4a" }}>{resendMsg}</div>}</div>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Full name (optional)</label>
          <input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Wanjiku" autoComplete="name" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 }} />
        </div>
        <button type="submit" disabled={busy} style={{ width: "100%", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", opacity: busy ? .6 : 1 }}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#6b7280" }}>Already have an account? <Link href="/login" style={{ color: "#43ba7f", fontWeight: 600 }}>Sign in</Link></p>
    </div>
  );
}

"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function safeNext(next: string | null) {
  if (!next) return "/bookings";
  if (!next.startsWith("/")) return "/bookings";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/bookings";
  return next;
}

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = safeNext(sp.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [code, setCode] = useState("");
  const resetDone = sp.get("reset") === "done";
  const confirmed = sp.get("confirmed") === "1";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setBusy(false);
        return;
      }
      if (data.needs2FA) {
        setStep("2fa");
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed.");
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: "48px auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28, boxShadow: "0 10px 30px rgba(33,39,65,.08)" }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Welcome back</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Sign in to track your bookings and messages.</p>
      {resetDone && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>Password updated. Sign in with your new password.</div>}
      {confirmed && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>Email confirmed. You can now sign in.</div>}
      {error && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{error}</div>}
      {step === "login" ? (
        <>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Email</label>
              <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Password</label>
              <input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 }} />
            </div>
            <p style={{ textAlign: "right", margin: "0 0 14px" }}><Link href="/reset" style={{ fontSize: 13, fontWeight: 600, color: "#43ba7f" }}>Forgot password?</Link></p>
            <button type="submit" disabled={busy} style={{ width: "100%", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>{busy ? "Sending code…" : "Sign in"}</button>
          </form>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#6b7280" }}>New here? <Link href="/signup" style={{ color: "#43ba7f", fontWeight: 600 }}>Create an account</Link></p>
        </>
      ) : (
        <form onSubmit={onVerify}>
          <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="code" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Verification code</label>
            <input id="code" inputMode="numeric" pattern="[0-9]{6}" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 18, letterSpacing: 4, textAlign: "center" }} />
          </div>
          <button type="submit" disabled={busy || code.length !== 6} style={{ width: "100%", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>{busy ? "Verifying…" : "Verify & sign in"}</button>
          <button type="button" onClick={async () => { setError(""); const r = await fetch("/api/auth/2fa/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); if (r.ok) setError("New code sent."); }} style={{ width: "100%", marginTop: 10, background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px", fontWeight: 600, color: "#212741", cursor: "pointer" }}>Resend code</button>
          <button type="button" onClick={() => setStep("login")} style={{ width: "100%", marginTop: 8, background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer" }}>← Back to login</button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div style={{ maxWidth: 440, margin: "48px auto" }}>Loading…</div>}><LoginForm /></Suspense>;
}

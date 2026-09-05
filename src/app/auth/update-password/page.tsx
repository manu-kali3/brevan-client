"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
function Form() {
  const router = useRouter();
  const sp = useSearchParams();
  const code = sp.get("code") ?? "";
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (pw !== confirm) { setErr("Passwords do not match."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/update-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, password: pw }) });
      const d = await res.json();
      if (!res.ok) { setErr(d.error ?? "Could not update."); setBusy(false); return; }
      router.push("/login?reset=done");
    } catch { setErr("Something went wrong."); setBusy(false); }
  }
  return (
    <div style={{ maxWidth: 440, margin: "48px auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28 }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Set new password</h1>
      {!code ? <><div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: 10, marginBottom: 12 }}>Invalid or expired link.</div><Link href="/reset" style={{ color: "#43ba7f" }}>Request new link</Link></> : (
        <>
          {err && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: 10, marginBottom: 12 }}>{err}</div>}
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>New password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} /></div>
            <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} /></div>
            <button disabled={busy} style={{ width: "100%", padding: 11, borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600 }}>{busy ? "Updating…" : "Update password"}</button>
          </form>
        </>
      )}
    </div>
  );
}
export default function Page() { return <Suspense fallback={<div>Loading…</div>}><Form /></Suspense>; }

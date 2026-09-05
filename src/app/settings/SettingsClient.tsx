"use client";
import { useState } from "react";

export default function SettingsClient({ initialName, initialPhone, initialEmail, initial2FA }: { initialName: string; initialPhone: string; initialEmail: string; initial2FA: boolean }) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [enable2FA, setEnable2FA] = useState(initial2FA);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: name, phone, enable2FA }) });
      const d = await res.json();
      if (!res.ok) setErr(d.error ?? "Could not save.");
      else setMsg("Changes saved.");
    } catch { setErr("Something went wrong."); }
    setBusy(false);
  }

  return (
    <form onSubmit={onSave} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, display: "grid", gap: 14 }}>
      {msg && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{msg}</div>}
      {err && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{err}</div>}

      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Email</label>
        <input value={initialEmail} disabled style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", color: "#6b7280" }} />
        <div style={{ fontSize: 11, color: "#667085", marginTop: 4 }}>Email cannot be changed here.</div>
      </div>

      <div>
        <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Full name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
      </div>

      <div>
        <label htmlFor="phone" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 }}>Phone number</label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", background: enable2FA ? "#f0faf5" : "#fff" }}>
        <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} style={{ width: 18, height: 18 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#212741" }}>Enable 2FA via email</div>
          <div style={{ fontSize: 12, color: "#667085" }}>{enable2FA ? "We will send a 6-digit code on each login." : "Disabled — login with password only."}</div>
        </div>
      </label>

      <button disabled={busy} style={{ justifySelf: "start", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? .6 : 1 }}>{busy ? "Saving…" : "Save changes"}</button>
    </form>
  );
}

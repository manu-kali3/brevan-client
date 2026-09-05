"use client";
import { useState, useEffect } from "react";

type Booking = { id: string; service: string; description: string | null; status: string; amount: number | null; created_at: string };
type Comment = { id: string; booking_id: string; body: string; is_admin: boolean; created_at: string; user_id: string };

export default function BookingsClient({ initialBookings, userId }: { initialBookings: Booking[]; userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [service, setService] = useState("Website Design");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string | null>(initialBookings[0]?.id ?? null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [cBusy, setCBusy] = useState(false);
  const [cErr, setCErr] = useState("");

  async function refresh() {
    const res = await fetch("/api/bookings");
    if (res.ok) { const d = await res.json(); setBookings(d.bookings ?? []); if (!selected && d.bookings?.[0]) setSelected(d.bookings[0].id); }
  }

  async function loadComments(id: string) {
    const res = await fetch(`/api/comments?booking_id=${encodeURIComponent(id)}`);
    if (res.ok) { const d = await res.json(); setComments(d.comments ?? []); }
  }

  useEffect(() => { if (selected) loadComments(selected); }, [selected]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setMsg(""); setBusy(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service, description }) });
      const d = await res.json();
      if (!res.ok) { setErr(d.error ?? "Could not create booking."); setBusy(false); return; }
      setMsg("Booking created."); setDescription(""); await refresh(); if (d.booking?.id) setSelected(d.booking.id);
    } catch { setErr("Something went wrong."); }
    setBusy(false);
  }

  async function onComment(e: React.FormEvent) {
    e.preventDefault(); if (!selected) return;
    setCErr(""); setCBusy(true);
    try {
      const res = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: selected, body: commentBody }) });
      const d = await res.json();
      if (!res.ok) { setCErr(d.error ?? "Could not send."); setCBusy(false); return; }
      setCommentBody(""); await loadComments(selected);
    } catch { setCErr("Could not send."); }
    setCBusy(false);
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div style={{ maxWidth: 1050, margin: "32px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, color: "#212741", margin: 0 }}>My Bookings</h1>
        <button onClick={onLogout} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Sign out</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#212741" }}>Request a service</h3>
        {err && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{err}</div>}
        {msg && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{msg}</div>}
        <form onSubmit={onCreate} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <select value={service} onChange={(e) => setService(e.target.value)} style={{ padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }}>
              <option>Website Design</option><option>WordPress &amp; Joomla</option><option>E-Commerce Solutions</option><option>Real Estate Platforms</option><option>Graphic Design &amp; Branding</option><option>AI Automation</option>
            </select>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description (optional)" style={{ padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
          </div>
          <button disabled={busy} style={{ justifySelf: "start", padding: "10px 18px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? .6 : 1 }}>{busy ? "Creating…" : "Create booking"}</button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#212741" }}>Bookings ({bookings.length})</div>
          {bookings.length === 0 ? <div style={{ padding: 20, color: "#6b7280", fontSize: 14 }}>No bookings yet. Create one above.</div> :
            bookings.map((b) => (
              <button key={b.id} onClick={() => setSelected(b.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 16px", border: 0, borderBottom: "1px solid #f3f4f6", background: selected === b.id ? "#f0faf5" : "#fff", cursor: "pointer" }}>
                <div style={{ fontWeight: 600, color: "#212741", fontSize: 14 }}>{b.service}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{b.status} · {new Date(b.created_at).toLocaleDateString()}</div>
              </button>
            ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, minHeight: 320 }}>
          {!selected ? <div style={{ color: "#6b7280" }}>Select a booking to view messages.</div> : (
            <>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "#212741" }}>Messages</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 360, overflowY: "auto", marginBottom: 14, padding: 4 }}>
                {comments.length === 0 ? <div style={{ color: "#6b7280", fontSize: 14 }}>No messages yet. Start the conversation.</div> :
                  comments.map((c) => (
                    <div key={c.id} style={{ alignSelf: c.user_id === userId && !c.is_admin ? "flex-end" : "flex-start", background: c.is_admin ? "#fff7e8" : c.user_id === userId ? "#eefaf3" : "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 14px", maxWidth: "78%" }}>
                      <div style={{ fontSize: 13, color: "#1e2430", whiteSpace: "pre-wrap" }}>{c.body}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{c.is_admin ? "Team · " : ""}{new Date(c.created_at).toLocaleString()}</div>
                    </div>
                  ))}
              </div>
              {cErr && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 10 }}>{cErr}</div>}
              <form onSubmit={onComment} style={{ display: "flex", gap: 10 }}>
                <input value={commentBody} onChange={(e) => setCommentBody(e.target.value)} placeholder="Write a message…" required maxLength={5000} style={{ flex: 1, padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 10 }} />
                <button disabled={cBusy} style={{ padding: "11px 18px", borderRadius: 10, border: 0, background: "#ff511a", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: cBusy ? .6 : 1 }}>{cBusy ? "…" : "Send"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then((d) => setBookings(d.bookings ?? []));
  }, []);

  async function loadComments(bookingId: string) {
    const r = await fetch(`/api/comments?bookingId=${bookingId}`);
    const d = await r.json();
    setComments((c) => ({ ...c, [bookingId]: d.comments ?? [] }));
  }

  async function postComment(bookingId: string) {
    const body = newComment[bookingId]?.trim();
    if (!body) return;
    await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId, body }) });
    setNewComment((c) => ({ ...c, [bookingId]: "" }));
    loadComments(bookingId);
  }

  return (
    <div>
      <h2>My bookings</h2>
      {bookings.length === 0 && <p style={{ color: "#667085" }}>No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b.id} style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{b.service}</strong>
            <span style={{ background: "#ecf8f1", color: "#36a06d", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{b.status}</span>
          </div>
          <p style={{ color: "#667085", fontSize: 14 }}>{b.description ?? "—"}</p>
          <button onClick={() => loadComments(b.id)} style={{ fontSize: 13, color: "#43ba7f", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View / add comments</button>
          {comments[b.id] && (
            <div style={{ marginTop: 12, borderTop: "1px solid #e8eaf0", paddingTop: 12 }}>
              {comments[b.id].map((c: any) => (
                <div key={c.id} style={{ marginBottom: 8, background: c.is_admin ? "#fff0ea" : "#f4f6f9", padding: 8, borderRadius: 8, fontSize: 13 }}>
                  <strong>{c.is_admin ? "Brevan Team" : "You"}:</strong> {c.body} <span style={{ color: "#667085", fontSize: 11 }}>· {new Date(c.created_at).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input value={newComment[b.id] ?? ""} onChange={(e) => setNewComment((c) => ({ ...c, [b.id]: e.target.value }))} placeholder="Request a change..." style={{ flex: 1, padding: "8px 12px", border: "1px solid #e8eaf0", borderRadius: 8 }} />
                <button onClick={() => postComment(b.id)} style={{ background: "#43ba7f", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontWeight: 600 }}>Send</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

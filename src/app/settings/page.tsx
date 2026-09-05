import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const { data } = await supabase.from("rate_limit_settings").select("key,value").order("key");
  const settings = (data ?? []) as { key: string; value: number }[];

  return (
    <div style={{ maxWidth: 640, margin: "32px auto" }}>
      <h1 style={{ fontSize: 22 }}>Rate limiting settings</h1>
      <p style={{ color: "#667085", fontSize: 14 }}>Requests per 10-15 min window per IP/email. Stored in <code>rate_limit_settings</code>.</p>
      <div style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 12, padding: 16, marginTop: 16 }}>
        {settings.length === 0 ? (
          <p style={{ color: "#667085" }}>No settings found. Defaults: login 10, signup 10, bookings 20, comments 30, 2fa 5.</p>
        ) : (
          <table style={{ width: "100%", fontSize: 14 }}>
            <thead><tr style={{ textAlign: "left", color: "#667085" }}><th>Key</th><th>Limit</th></tr></thead>
            <tbody>
              {settings.map((s) => <tr key={s.key}><td style={{ padding: "8px 0", fontWeight: 600 }}>{s.key}</td><td>{s.value}</td></tr>)}
            </tbody>
          </table>
        )}
        <p style={{ marginTop: 12, fontSize: 12, color: "#667085" }}>To change, update via Supabase SQL: <code>update rate_limit_settings set value=20 where key='login';</code></p>
      </div>
    </div>
  );
}

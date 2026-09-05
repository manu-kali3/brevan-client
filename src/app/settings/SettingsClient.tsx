"use client";
import { useState } from "react";
type Props = {
  initialName: string;
  initialPhone: string;
  initialEmail: string;
  initial2FA: boolean;
  initialDob?: string;
  initialOrgType?: string;
  initialGender?: string;
  initialLocation?: string;
  initialReferralSource?: string;
  initialSecondaryPhone?: string;
  initialSecondaryEmail?: string;
  initialNextOfKinName?: string;
  initialNextOfKinPhone?: string;
  initialNextOfKinRelationship?: string;
};
export default function SettingsClient({
  initialName,
  initialPhone,
  initialEmail,
  initial2FA,
  initialDob = "",
  initialOrgType = "",
  initialGender = "",
  initialLocation = "",
  initialReferralSource = "",
  initialSecondaryPhone = "",
  initialSecondaryEmail = "",
  initialNextOfKinName = "",
  initialNextOfKinPhone = "",
  initialNextOfKinRelationship = "",
}: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [enable2FA, setEnable2FA] = useState(initial2FA);
  const [dob, setDob] = useState(initialDob);
  const [orgType, setOrgType] = useState(initialOrgType);
  const [gender, setGender] = useState(initialGender);
  const [location, setLocation] = useState(initialLocation);
  const [referralSource, setReferralSource] = useState(initialReferralSource);
  const [secondaryPhone, setSecondaryPhone] = useState(initialSecondaryPhone);
  const [secondaryEmail, setSecondaryEmail] = useState(initialSecondaryEmail);
  const [nextOfKinName, setNextOfKinName] = useState(initialNextOfKinName);
  const [nextOfKinPhone, setNextOfKinPhone] = useState(initialNextOfKinPhone);
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState(initialNextOfKinRelationship);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone,
          enable2FA,
          dob,
          org_type: orgType,
          gender,
          location,
          referral_source: referralSource,
          secondary_phone: secondaryPhone,
          secondary_email: secondaryEmail,
          next_of_kin_name: nextOfKinName,
          next_of_kin_phone: nextOfKinPhone,
          next_of_kin_relationship: nextOfKinRelationship,
        }),
      });
      const d = await res.json();
      if (!res.ok) setErr(d.error ?? "Could not save.");
      else setMsg("Changes saved.");
    } catch {
      setErr("Something went wrong.");
    }
    setBusy(false);
  }
  const inputStyle = { width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8 } as const;
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 } as const;
  return (
    <form onSubmit={onSave} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, display: "grid", gap: 14 }}>
      {msg && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{msg}</div>}
      {err && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{err}</div>}
      <div>
        <label style={labelStyle}>Email</label>
        <input value={initialEmail} disabled style={{ width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", color: "#6b7280" }} />
        <div style={{ fontSize: 11, color: "#667085", marginTop: 4 }}>Email cannot be changed here.</div>
      </div>
      <div>
        <label htmlFor="name" style={labelStyle}>Full name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="phone" style={labelStyle}>Phone number</label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="dob" style={labelStyle}>Date of birth</label>
          <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="gender" style={labelStyle}>Gender</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="org_type" style={labelStyle}>Organisation type</label>
          <select id="org_type" value={orgType} onChange={(e) => setOrgType(e.target.value)} style={inputStyle}>
            <option value="">Select type</option>
            <option value="individual">Individual</option>
            <option value="organisation">Organisation</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" style={labelStyle}>Location</label>
          <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nairobi, Kenya" style={inputStyle} />
        </div>
      </div>
      <div>
        <label htmlFor="referral_source" style={labelStyle}>Referral source</label>
        <input id="referral_source" value={referralSource} onChange={(e) => setReferralSource(e.target.value)} placeholder="How did you hear about us?" style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="secondary_phone" style={labelStyle}>Secondary phone</label>
          <input id="secondary_phone" value={secondaryPhone} onChange={(e) => setSecondaryPhone(e.target.value)} placeholder="0712 345 678" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="secondary_email" style={labelStyle}>Secondary email</label>
          <input id="secondary_email" type="email" value={secondaryEmail} onChange={(e) => setSecondaryEmail(e.target.value)} placeholder="alt@example.com" style={inputStyle} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, display: "grid", gap: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#212741" }}>Next of kin</div>
        <div>
          <label htmlFor="nok_name" style={labelStyle}>Next of kin name</label>
          <input id="nok_name" value={nextOfKinName} onChange={(e) => setNextOfKinName(e.target.value)} placeholder="Full name" style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label htmlFor="nok_phone" style={labelStyle}>Next of kin phone</label>
            <input id="nok_phone" value={nextOfKinPhone} onChange={(e) => setNextOfKinPhone(e.target.value)} placeholder="0712 345 678" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="nok_rel" style={labelStyle}>Relationship</label>
            <input id="nok_rel" value={nextOfKinRelationship} onChange={(e) => setNextOfKinRelationship(e.target.value)} placeholder="e.g. Spouse, Parent" style={inputStyle} />
          </div>
        </div>
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", background: enable2FA ? "#f0faf5" : "#fff" }}>
        <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} style={{ width: 18, height: 18 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#212741" }}>Enable 2FA via email</div>
          <div style={{ fontSize: 12, color: "#667085" }}>{enable2FA ? "We will send a 6-digit code on each login." : "Disabled — login with password only."}</div>
        </div>
      </label>
      <button disabled={busy} style={{ justifySelf: "start", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [orgType, setOrgType] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [nextOfKinName, setNextOfKinName] = useState("");
  const [nextOfKinPhone, setNextOfKinPhone] = useState("");
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
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
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-up failed.");
        setBusy(false);
        return;
      }
      if (data.requiresConfirmation) {
        setNeedsConfirm(true);
        setInfo("Check your email to confirm your account, then sign in. If you don't see it, check spam.");
        setBusy(false);
      } else {
        router.push("/bookings");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }
  async function onResend() {
    if (!email.trim()) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/auth/resend-confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) setResendMsg(data.error ?? "Could not resend.");
      else setResendMsg("A new confirmation link has been sent.");
    } catch {
      setResendMsg("Could not resend. Try again.");
    } finally {
      setResending(false);
    }
  }
  const inputStyle = { width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 15 } as const;
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#212741", marginBottom: 6 } as const;
  return (
    <div style={{ maxWidth: 520, margin: "48px auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28, boxShadow: "0 10px 30px rgba(33,39,65,.08)" }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Create your account</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Track service bookings and chat with our team.</p>
      {error && <div style={{ background: "#fff1f0", border: "1px solid #f4c4c1", color: "#b3261e", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{error}</div>}
      {info && <div style={{ background: "#eefaf3", border: "1px solid #bfe8d2", color: "#1c7a4a", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>{info}</div>}
      {needsConfirm && (
        <div style={{ marginBottom: 14 }}>
          <button type="button" onClick={onResend} disabled={resending} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {resending ? "Resending…" : "Resend confirmation link"}
          </button>
          {resendMsg && <div style={{ marginTop: 8, fontSize: 13, color: resendMsg.includes("Could") ? "#b3261e" : "#1c7a4a" }}>{resendMsg}</div>}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="name" style={labelStyle}>Full name (optional)</label>
          <input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Wanjiku" autoComplete="name" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
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
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="referral_source" style={labelStyle}>Referral source</label>
          <input id="referral_source" value={referralSource} onChange={(e) => setReferralSource(e.target.value)} placeholder="How did you hear about us?" style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label htmlFor="secondary_phone" style={labelStyle}>Secondary phone</label>
            <input id="secondary_phone" value={secondaryPhone} onChange={(e) => setSecondaryPhone(e.target.value)} placeholder="0712 345 678" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="secondary_email" style={labelStyle}>Secondary email</label>
            <input id="secondary_email" type="email" value={secondaryEmail} onChange={(e) => setSecondaryEmail(e.target.value)} placeholder="alt@example.com" style={inputStyle} />
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, marginBottom: 14, display: "grid", gap: 14 }}>
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
        <button type="submit" disabled={busy} style={{ width: "100%", padding: "11px 20px", borderRadius: 10, border: 0, background: "#43ba7f", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#6b7280" }}>
        Already have an account? <Link href="/login" style={{ color: "#43ba7f", fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}

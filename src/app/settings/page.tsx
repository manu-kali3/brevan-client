import { createClient, createAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");
  const admin = createAdminClient();
  let profile: {
    full_name: string | null;
    phone: string | null;
    dob: string | null;
    org_type: string | null;
    gender: string | null;
    location: string | null;
    referral_source: string | null;
    secondary_phone: string | null;
    secondary_email: string | null;
    next_of_kin_name: string | null;
    next_of_kin_phone: string | null;
    next_of_kin_relationship: string | null;
  } | null = null;
  let enable2FA = true;
  if (admin) {
    const { data } = await admin.from("profiles").select("full_name,phone,dob,org_type,gender,location,referral_source,secondary_phone,secondary_email,next_of_kin_name,next_of_kin_phone,next_of_kin_relationship").eq("id", user.id).single();
    if (data) profile = data as any;
    const { data: pref } = await admin.from("user_preferences").select("enable_2fa").eq("user_id", user.id).single();
    if (pref && typeof (pref as any).enable_2fa === "boolean") enable2FA = (pref as any).enable_2fa;
  }
  return (
    <div style={{ maxWidth: 640, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, color: "#212741", margin: "0 0 6px" }}>Settings</h1>
      <p style={{ color: "#667085", fontSize: 14, margin: "0 0 18px" }}>Update your details and security preferences.</p>
      <SettingsClient
        initialName={profile?.full_name ?? (user.user_metadata?.full_name as string) ?? ""}
        initialPhone={profile?.phone ?? ""}
        initialEmail={user.email ?? ""}
        initial2FA={enable2FA}
        initialDob={profile?.dob ?? ""}
        initialOrgType={profile?.org_type ?? ""}
        initialGender={profile?.gender ?? ""}
        initialLocation={profile?.location ?? ""}
        initialReferralSource={profile?.referral_source ?? ""}
        initialSecondaryPhone={profile?.secondary_phone ?? ""}
        initialSecondaryEmail={profile?.secondary_email ?? ""}
        initialNextOfKinName={profile?.next_of_kin_name ?? ""}
        initialNextOfKinPhone={profile?.next_of_kin_phone ?? ""}
        initialNextOfKinRelationship={profile?.next_of_kin_relationship ?? ""}
      />
    </div>
  );
}

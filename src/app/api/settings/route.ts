import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
const EMAIL_PATTERN = /^[^ @]+@[^ @]+$/;
const PHONE_PATTERN = /^[\d+\s-]{7,32}$/;
const GENDERS = new Set(["male", "female", "other"]);
const ORG_TYPES = new Set(["individual", "organisation"]);
export async function POST(request: Request) {
  const rl = rateLimit(`settings:${clientIp(request)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: {
    full_name?: string;
    phone?: string;
    enable2FA?: boolean;
    dob?: string;
    org_type?: string;
    gender?: string;
    location?: string;
    referral_source?: string;
    secondary_phone?: string;
    secondary_email?: string;
    next_of_kin_name?: string;
    next_of_kin_phone?: string;
    next_of_kin_relationship?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const fullName = body.full_name?.trim().slice(0, 200) ?? "";
  const phone = body.phone?.trim().slice(0, 32) ?? "";
  const enable2FA = body.enable2FA ?? true;
  const dobRaw = body.dob?.trim() ?? "";
  const orgTypeRaw = body.org_type?.trim().toLowerCase() ?? "";
  const genderRaw = body.gender?.trim().toLowerCase() ?? "";
  const location = body.location?.trim().slice(0, 300) ?? "";
  const referralSource = body.referral_source?.trim().slice(0, 300) ?? "";
  const secondaryPhone = body.secondary_phone?.trim().slice(0, 32) ?? "";
  const secondaryEmail = body.secondary_email?.trim() ?? "";
  const nextOfKinName = body.next_of_kin_name?.trim().slice(0, 200) ?? "";
  const nextOfKinPhone = body.next_of_kin_phone?.trim().slice(0, 32) ?? "";
  const nextOfKinRelationship = body.next_of_kin_relationship?.trim().slice(0, 100) ?? "";
  if (phone && !PHONE_PATTERN.test(phone)) return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  if (dobRaw) {
    const d = new Date(dobRaw);
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Invalid date of birth." }, { status: 400 });
  }
  if (orgTypeRaw && !ORG_TYPES.has(orgTypeRaw)) return NextResponse.json({ error: "Invalid organisation type." }, { status: 400 });
  if (genderRaw && !GENDERS.has(genderRaw)) return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
  if (secondaryPhone && !PHONE_PATTERN.test(secondaryPhone)) return NextResponse.json({ error: "Invalid secondary phone number." }, { status: 400 });
  if (nextOfKinPhone && !PHONE_PATTERN.test(nextOfKinPhone)) return NextResponse.json({ error: "Invalid next of kin phone number." }, { status: 400 });
  if (secondaryEmail && !EMAIL_PATTERN.test(secondaryEmail)) return NextResponse.json({ error: "Enter a valid secondary email." }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  await admin.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName || null,
      phone: phone || null,
      dob: dobRaw || null,
      org_type: orgTypeRaw || null,
      gender: genderRaw || null,
      location: location || null,
      referral_source: referralSource || null,
      secondary_phone: secondaryPhone || null,
      secondary_email: secondaryEmail || null,
      next_of_kin_name: nextOfKinName || null,
      next_of_kin_phone: nextOfKinPhone || null,
      next_of_kin_relationship: nextOfKinRelationship || null,
    },
    { onConflict: "id" }
  );
  await admin.from("user_preferences").upsert({ user_id: user.id, enable_2fa: !!enable2FA, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
const EMAIL_PATTERN = /^[^ @]+@[^ @]+$/;
const PHONE_PATTERN = /^[\d+\s-]{7,32}$/;
const GENDERS = new Set(["male", "female", "other"]);
const ORG_TYPES = new Set(["individual", "organisation"]);
export async function POST(request: Request) {
  let body: {
    email?: string;
    password?: string;
    full_name?: string;
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
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const fullName = body.full_name?.trim().slice(0, 200) ?? "";
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
  if (!email || !EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (dobRaw) {
    const d = new Date(dobRaw);
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Invalid date of birth." }, { status: 400 });
  }
  if (orgTypeRaw && !ORG_TYPES.has(orgTypeRaw)) return NextResponse.json({ error: "Invalid organisation type." }, { status: 400 });
  if (genderRaw && !GENDERS.has(genderRaw)) return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
  if (secondaryPhone && !PHONE_PATTERN.test(secondaryPhone)) return NextResponse.json({ error: "Invalid secondary phone number." }, { status: 400 });
  if (nextOfKinPhone && !PHONE_PATTERN.test(nextOfKinPhone)) return NextResponse.json({ error: "Invalid next of kin phone number." }, { status: 400 });
  if (secondaryEmail && !EMAIL_PATTERN.test(secondaryEmail)) return NextResponse.json({ error: "Enter a valid secondary email." }, { status: 400 });
  const rl = rateLimit(`signup:${clientIp(request)}:${email.toLowerCase()}`, 10, 15 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || null }, emailRedirectTo: `${siteUrl}/auth/callback?next=/bookings` },
  });
  if (error) return NextResponse.json({ error: "Could not create account. Try again." }, { status: 400 });
  const userId = (data as any)?.user?.id as string | undefined;
  if (userId) {
    const admin = createAdminClient();
    if (admin) {
      const { error: upErr } = await admin.from("profiles").upsert(
        {
          id: userId,
          full_name: fullName || null,
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
      if (upErr) console.error(upErr.message);
    }
  }
  const session = (data as any).session;
  if (session) {
    const { error: sErr } = await supabase.auth.setSession(session);
    if (sErr) console.error(sErr.message);
  }
  return NextResponse.json({ ok: true, requiresConfirmation: !session });
}

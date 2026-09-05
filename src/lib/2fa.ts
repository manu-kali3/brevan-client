import { createHash, randomInt } from "crypto";
import { createAdminClient } from "./supabase";
import { sendEmail } from "./email";

export function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function send2FACode(userId: string, email: string) {
  const code = String(randomInt(100000, 999999));
  const hash = hashCode(code);
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const admin = createAdminClient();
  if (!admin) throw new Error("DB unavailable");
  await admin.from("user_2fa_codes").upsert({ user_id: userId, code_hash: hash, expires_at: expires, attempts: 0, created_at: new Date().toISOString() }, { onConflict: "user_id" });
  await sendEmail({
    type: "2fa",
    to: email,
    subject: "Your Brevan Client verification code",
    text: `Your verification code is ${code}\nIt expires in 10 minutes.\nIf you did not try to sign in, ignore this email.`,
  });
  return code;
}

export async function verify2FACode(userId: string, code: string) {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "DB unavailable" };
  const { data, error } = await admin.from("user_2fa_codes").select("code_hash,expires_at,attempts").eq("user_id", userId).single();
  if (error || !data) return { ok: false, error: "Code not found. Request a new one." };
  if (new Date(data.expires_at).getTime() < Date.now()) return { ok: false, error: "Code expired. Request a new one." };
  if (data.attempts >= 5) return { ok: false, error: "Too many attempts. Request a new code." };
  await admin.from("user_2fa_codes").update({ attempts: (data.attempts ?? 0) + 1 }).eq("user_id", userId);
  if (hashCode(code) !== data.code_hash) return { ok: false, error: "Invalid code." };
  await admin.from("user_2fa_codes").delete().eq("user_id", userId);
  return { ok: true };
}

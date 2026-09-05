export const payheroEnabled = Boolean(process.env.PAYHERO_TOKEN) && Boolean(process.env.PAYHERO_CHANNEL_ID);
const payheroBase = process.env.PAYHERO_BASE_URL ?? "https://backend.payhero.co.ke";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";

export function normalizePhone(input: string): string | null {
  let c = input.replace(/[^\d]/g, "");
  if (c.startsWith("0")) c = "254" + c.slice(1);
  else if (c.startsWith("7") && c.length === 9) c = "254" + c;
  if (!/^2547\d{8}$/.test(c)) return null;
  return c;
}

async function payheroHeaders() {
  return { Authorization: `Basic ${process.env.PAYHERO_TOKEN}`, "Content-Type": "application/json" };
}

export async function payheroStkPush(input: { amount: number; phone: string; externalRef: string }): Promise<{ reference: string; message: string } | { error: string }> {
  if (!payheroEnabled) return { error: "PayHero not configured." };
  const phone = normalizePhone(input.phone);
  if (!phone) return { error: "Enter valid Kenyan phone." };
  const res = await fetch(`${payheroBase}/api/v2/payments`, {
    method: "POST",
    headers: await payheroHeaders(),
    body: JSON.stringify({ amount: input.amount, phone_number: phone, channel_id: Number(process.env.PAYHERO_CHANNEL_ID), provider: "m-pesa", external_reference: input.externalRef, callback_url: `${SITE_URL}/api/webhooks/payhero` }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: "PayHero failed." };
  const ref = data.reference ?? data.CheckoutRequestID ?? data.external_reference;
  if (!ref) return { error: "No reference." };
  return { reference: String(ref), message: "Enter M-PESA PIN." };
}

export async function payheroTransactionStatus(reference: string): Promise<{ status: "PENDING" | "SUCCESS" | "FAILED" | "NOT_FOUND"; receipt?: string }> {
  const res = await fetch(`${payheroBase}/api/v2/transaction-status?reference=${encodeURIComponent(reference)}`, { headers: await payheroHeaders() });
  if (!res.ok) return res.status === 404 ? { status: "NOT_FOUND" } : { status: "PENDING" };
  const data = await res.json().catch(() => ({}));
  const s = String(data.status ?? "").toUpperCase();
  if (s === "SUCCESS") return { status: "SUCCESS", receipt: data.provider_reference || data.third_party_reference || undefined };
  if (s === "FAILED") return { status: "FAILED" };
  return { status: "PENDING" };
}

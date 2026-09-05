/** Returns the URL when it is a plausible http(s) link, otherwise null. */
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > 2000) return null;
  if (!/^https?:\/\/[^\s]+$/i.test(trimmed)) return null;
  return trimmed;
}

/** Strips CR/LF so user input cannot inject extra email headers. */
export function stripCRLF(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

"use client";

import { useState } from "react";

type Status = { type: "idle" | "loading" | "success" | "error"; message: string };

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Subscribing..." });

    const form = e.currentTarget;
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement).value;
    const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: json.error ?? "Something went wrong." });
        return;
      }
      form.reset();
      setStatus({
        type: "success",
        message: "Thanks for subscribing! We will keep you posted.",
      });
    } catch {
      setStatus({ type: "error", message: "Could not subscribe. Please try again." });
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
      <div className="newsletter-row">
        <input
          type="email"
          name="newsletter-email"
          id="newsletter-email"
          placeholder="Your email address"
          pattern="[^ @]*@[^ @]*"
          aria-label="Email address for updates"
          required
        />
        <button type="submit" disabled={status.type === "loading"} aria-label="Subscribe to updates">
          {status.type === "loading" ? (
            "Sending..."
          ) : (
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          )}
        </button>
      </div>
      {status.type === "success" && (
        <p className="newsletter-status success" role="status">
          {status.message}
        </p>
      )}
      {status.type === "error" && (
        <p className="newsletter-status error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}

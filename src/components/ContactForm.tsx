"use client";

import { useState } from "react";

type Status = { type: "idle" | "loading" | "success" | "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending..." });

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: json.error ?? "Something went wrong." });
        return;
      }
      form.reset();
      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent. We will reply as soon as possible.",
      });
    } catch {
      setStatus({ type: "error", message: "Could not send your message. Please try again." });
    }
  }

  return (
    <form id="contact" onSubmit={handleSubmit} noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
      <div className="row">
        <div className="col-lg-6">
          <fieldset>
            <input type="text" name="name" id="name" placeholder="Your Name..." autoComplete="on" required />
          </fieldset>
        </div>
        <div className="col-lg-6">
          <fieldset>
            <input type="tel" name="phone" id="phone" placeholder="Your Phone..." autoComplete="on" />
          </fieldset>
        </div>
        <div className="col-lg-6">
          <fieldset>
            <input type="text" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder="Your E-mail..." required />
          </fieldset>
        </div>
        <div className="col-lg-6">
          <fieldset>
            <input type="text" name="subject" id="subject" placeholder="Subject..." autoComplete="on" />
          </fieldset>
        </div>
        <div className="col-lg-12">
          <fieldset>
            <textarea name="message" id="message" placeholder="Your Message" required></textarea>
          </fieldset>
        </div>
        <div className="col-lg-12">
          <fieldset>
            <button type="submit" id="form-submit" className="orange-button" disabled={status.type === "loading"}>
              {status.type === "loading" ? "Sending..." : "Send Message"}
            </button>
          </fieldset>
          {status.type === "success" && (
            <p className="form-status success">{status.message}</p>
          )}
          {status.type === "error" && (
            <p className="form-status error">{status.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";

const SERVICES = [
  "Website Design",
  "WordPress",
  "Joomla",
  "E-Commerce",
  "Real Estate",
  "Graphic Design",
  "AI Automation",
  "Digital Training",
];

type Status = { type: "idle" | "loading" | "success" | "error"; message: string };

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending..." });

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      service: (form.elements.namedItem("Category") as HTMLSelectElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "",
    };

    try {
      const res = await fetch("/api/quote", {
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
        message: "Thank you! Your request has been received. We will get back to you soon.",
      });
    } catch {
      setStatus({ type: "error", message: "Could not send your request. Please try again." });
    }
  }

  return (
    <form id="calculate" onSubmit={handleSubmit} noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
      <div className="row">
        <div className="col-lg-6">
          <fieldset>
            <label htmlFor="name">Your Name</label>
            <input type="text" name="name" id="name" placeholder="" autoComplete="on" required />
          </fieldset>
        </div>
        <div className="col-lg-6">
          <fieldset>
            <label htmlFor="email">Your Email</label>
            <input
              type="text"
              name="email"
              id="email"
              pattern="[^ @]*@[^ @]*"
              placeholder=""
              required
            />
          </fieldset>
        </div>
        <div className="col-lg-12">
          <fieldset>
            <label htmlFor="subject">Subject</label>
            <input type="text" name="subject" id="subject" placeholder="" autoComplete="on" />
          </fieldset>
        </div>
        <div className="col-lg-12">
          <fieldset>
            <label htmlFor="chooseOption" className="form-label">
              Service Needed
            </label>
            <select name="Category" className="form-select" aria-label="Choose a service" id="chooseOption">
              <option value="">Choose a Service</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
        <div className="col-lg-12">
          <fieldset>
            <button type="submit" id="form-submit" className="orange-button" disabled={status.type === "loading"}>
              {status.type === "loading" ? "Sending..." : "Submit Now"}
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

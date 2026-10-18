"use client";

import { FormEvent, useEffect, useState } from "react";
import { agency } from "@/lib/content";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onBrief = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) setMessage(detail);
    };
    window.addEventListener("b2b-brief", onBrief);
    return () => window.removeEventListener("b2b-brief", onBrief);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const brief = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Project consult from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBusiness: ${company || "—"}\n\n${brief}`,
    );

    window.location.href = `mailto:${agency.email}?subject=${subject}&body=${body}`;
    setStatus("Your mail app will open with the note ready. Nothing is stored on this site.");
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-row">
        <label className="field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="field">
        <span>Business</span>
        <input name="company" type="text" autoComplete="organization" />
      </label>
      <label className="field">
        <span>Brief</span>
        <textarea
          id="brief"
          name="message"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="The field, what you need, and what should change."
        />
      </label>
      <div>
        <button className="button" type="submit">
          Send the brief
        </button>
      </div>
      <p className="form-note">Opens your email to {agency.email}. Nothing is stored here.</p>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}

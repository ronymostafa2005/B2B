"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { agency } from "@/lib/content";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/site/SocialIcons";
import { sound } from "@/lib/sound";

export function ContactSection() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

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
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${company || "—"}\n\n${brief}`);
    window.location.href = `mailto:${agency.email}?subject=${subject}&body=${body}`;
    setStatus("Your mail app will open with the note ready. Nothing is stored on this site.");
    sound.playSuccess();
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl border-t border-zinc-900/80 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div data-flow className="lg:col-span-5">
          <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            15-MINUTE CONSULT
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">Send the brief</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
            Tell us the field, what you need, and what should change. The note opens in your mail app to {agency.email}.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              {agency.location}
            </li>
            <li>
              <a href={`mailto:${agency.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-red-500" />
                {agency.email}
              </a>
            </li>
            <li>
              <a href={agency.phoneHref} className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-red-500" />
                {agency.phone}
              </a>
            </li>
            <li>
              <a href={agency.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="h-4 w-4 text-red-500" />
                {agency.whatsapp}
              </a>
            </li>
            <li>
              <a href={agency.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <FacebookIcon className="h-4 w-4 text-red-500" />
                Facebook
              </a>
            </li>
            <li>
              <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <InstagramIcon className="h-4 w-4 text-red-500" />
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <form data-flow onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-zinc-800 bg-[#0c0c10] p-5 sm:p-8 lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" />
          </div>
          <Field label="Business" name="company" autoComplete="organization" />
          <label className="block text-xs tracking-wider text-zinc-400 uppercase">
            Brief
            <textarea
              id="brief"
              name="message"
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="The field, what you need, and what should change."
              className="mt-2 min-h-32 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white normal-case placeholder:text-zinc-600 focus:border-red-500 focus:outline-none"
            />
          </label>
          <button type="submit" className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700">
            Send the brief
          </button>
          <p className="text-xs text-zinc-500">Opens your email to {agency.email}. Nothing is stored here.</p>
          <p className="text-sm text-red-300" role="status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-xs tracking-wider text-zinc-400 uppercase">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white normal-case focus:border-red-500 focus:outline-none"
      />
    </label>
  );
}

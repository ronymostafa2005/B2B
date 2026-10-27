"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/site/SocialIcons";
import { sound } from "@/lib/sound";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function ContactSection() {
  const { config } = useSiteConfig();
  const agency = config.agency;
  const sec = config.sections.contact;

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
    <section id="contact" className="mx-auto max-w-7xl border-t border-[var(--line-soft)] band px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div data-flow className="lg:col-span-5">
          <div className="mb-3 inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-veil)] px-3 py-1 text-xs text-[var(--brand)]">
            {sec.badgeText || "15-MINUTE CONSULT"}
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">{sec.title || "Send the brief"}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
            {sec.description || `Tell us the field, what you need, and what should change. The note opens in your mail app to ${agency.email}.`}
          </p>
          <ul className="mt-6 space-y-3 text-sm text-zinc-300">
            {agency.location && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--brand)]" />
                {agency.location}
              </li>
            )}
            {agency.email && (
              <li>
                <a href={`mailto:${agency.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4 text-[var(--brand)]" />
                  {agency.email}
                </a>
              </li>
            )}
            {agency.phone && (
              <li>
                <a href={agency.phoneHref || `tel:${agency.phone}`} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 text-[var(--brand)]" />
                  {agency.phone}
                </a>
              </li>
            )}
            {agency.whatsapp && (
              <li>
                <a href={agency.whatsappHref || `https://wa.me/${agency.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  <WhatsAppIcon className="h-4 w-4 text-[var(--brand)]" />
                  {agency.whatsapp}
                </a>
              </li>
            )}
            {agency.facebook && (
              <li>
                <a href={agency.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  <FacebookIcon className="h-4 w-4 text-[var(--brand)]" />
                  Facebook
                </a>
              </li>
            )}
            {agency.instagram && (
              <li>
                <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  <InstagramIcon className="h-4 w-4 text-[var(--brand)]" />
                  Instagram
                </a>
              </li>
            )}
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
              className="mt-2 min-h-32 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white normal-case placeholder:text-zinc-600 focus:border-[var(--brand)] focus:outline-none"
            />
          </label>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--brand)] px-8 py-3.5 text-sm font-bold text-[var(--brand-contrast)] shadow-[0_0_20px_var(--brand-glow)] hover:bg-[var(--brand)] sm:w-auto"
            >
              Open mail client
            </button>
            <p className="text-xs text-zinc-500">
              {status || "Opens your system mail composer directly."}
            </p>
          </div>
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
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white normal-case focus:border-[var(--brand)] focus:outline-none"
      />
    </label>
  );
}

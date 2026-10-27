"use client";

import { BarChart3, Clock3, Gem, Layers3, Lightbulb, Mail, MapPin, MessagesSquare, Phone, Scale, Users } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/site/SocialIcons";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { SmartImage } from "@/components/SmartImage";

const whyIcons = [Users, Lightbulb, Gem, Clock3, Layers3, MessagesSquare, BarChart3, Scale];

export function About() {
  const { config } = useSiteConfig();
  const sec = config.sections.about;
  const agency = config.agency;
  const whyUs = config.whyUs || [];

  return (
    <section id="about" className="mx-auto max-w-7xl border-t border-[var(--line-soft)] band-loose px-4 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div data-flow className="space-y-8 lg:col-span-7">
          <div>
            <div className="inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-veil)] px-3 py-1 text-xs text-[var(--brand)]">
              {sec.badgeText || "ABOUT B2B."}
            </div>
            <h2 className="font-brand mt-4 text-3xl leading-tight font-black text-white md:text-5xl">
              {sec.title || "A studio"}
              <br />
              <span className="text-[var(--brand)]">{sec.titleHighlight || "for the next job"}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">{agency.description}</p>
            {agency.former && <p className="mt-2 text-sm text-zinc-500">Formerly {agency.former}.</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <h3 className="text-xs tracking-wider text-[var(--brand)] uppercase">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agency.vision}</p>
            </article>
            <article className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <h3 className="text-xs tracking-wider text-[var(--brand)] uppercase">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agency.mission}</p>
            </article>
          </div>
        </div>
        <aside data-flow className="rounded-3xl border border-[var(--brand-line)] bg-gradient-to-br from-[#120304] via-[#09090c] to-[#040405] p-6 shadow-[0_20px_50px_var(--brand-glow)] sm:p-8 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <span className="text-xs font-bold text-[var(--brand)]">STUDIO</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_#e50914]" />
          </div>
          <SmartImage
            src={config.header.logoUrl || "/brand/wordmark.png"}
            alt="B2B. Marketing Agency"
            width={792}
            height={398}
            autoAxis="width"
            className="h-20 w-auto"
          />
          <ul className="mt-6 space-y-4 text-sm text-zinc-300">
            {agency.location && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                {agency.location}
              </li>
            )}
            {agency.email && (
              <li>
                <a href={`mailto:${agency.email}`} className="flex items-start gap-3 hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {agency.email}
                </a>
              </li>
            )}
            {agency.phone && (
              <li>
                <a href={agency.phoneHref || `tel:${agency.phone}`} className="flex items-start gap-3 hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {agency.phone}
                </a>
              </li>
            )}
            {agency.whatsapp && (
              <li>
                <a href={agency.whatsappHref || `https://wa.me/${agency.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-white">
                  <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {agency.whatsapp}
                </a>
              </li>
            )}
            {agency.facebook && (
              <li>
                <a href={agency.facebook} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-white">
                  <FacebookIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  Facebook
                </a>
              </li>
            )}
            {agency.instagram && (
              <li>
                <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-white">
                  <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </aside>
      </div>
      {whyUs.length > 0 && (
        <div className="mt-14">
          <h3 className="font-brand text-2xl font-black text-white md:text-3xl">Why this studio</h3>
          <ol data-flow className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, index) => {
              const Icon = whyIcons[index % whyIcons.length];
              return (
                <li key={item || index} className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#0c0c10] px-4 py-4">
                  <span className="relative grid h-16 w-16 shrink-0 place-items-center [perspective:280px]">
                    <span className="absolute bottom-1 h-2 w-10 rounded-full bg-black/80 blur-[1px]" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-[var(--brand-line)] bg-gradient-to-br from-[#ff4d57] via-[#c1121f] to-[#4a0610] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),4px_8px_0_#2a0508] [transform:rotateX(22deg)_rotateY(-24deg)]">
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                    </span>
                  </span>
                  <span>
                    <span className="font-brand text-xs text-[var(--brand)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-white">{item}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}

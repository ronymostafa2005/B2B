"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { agency, whyUs } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl border-t border-zinc-900/80 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <div>
            <div className="inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
              ABOUT B2B.
            </div>
            <h2 className="font-brand mt-4 text-3xl leading-tight font-black text-white md:text-5xl">
              A studio in Zagazig
              <br />
              <span className="text-red-600">for the next job</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">{agency.description}</p>
            <p className="mt-2 text-sm text-zinc-500">Formerly {agency.former}.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <h3 className="text-xs tracking-wider text-red-400 uppercase">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agency.vision}</p>
            </article>
            <article className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <h3 className="text-xs tracking-wider text-red-400 uppercase">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agency.mission}</p>
            </article>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">Why this studio</h3>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {whyUs.map((item, index) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-black/40 px-3 py-3 text-sm text-zinc-300">
                  <span className="font-brand text-red-500">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <aside className="rounded-3xl border border-red-500/40 bg-gradient-to-br from-[#120304] via-[#09090c] to-[#040405] p-6 shadow-[0_20px_50px_rgba(229,9,20,0.3)] sm:p-8 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <span className="text-xs font-bold text-red-500">STUDIO</span>
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#e50914]" />
          </div>
          <p className="font-brand text-5xl font-black text-white">B2B.</p>
          <ul className="mt-6 space-y-4 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              {agency.location}
            </li>
            <li>
              <a href={`mailto:${agency.email}`} className="flex items-start gap-3 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {agency.email}
              </a>
            </li>
            <li>
              <a href={agency.phoneHref} className="flex items-start gap-3 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {agency.phone}
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

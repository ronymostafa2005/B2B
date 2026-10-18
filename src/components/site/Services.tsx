"use client";

import { CheckCircle2, Film, Megaphone, Palette, Sparkles } from "lucide-react";

const services = [
  {
    title: "Identity",
    tag: "MARK",
    icon: Palette,
    text: "One system for the name, the type, and the color, so the next post does not invent a new voice.",
    deliverables: ["Logo lockup", "Type and color", "Social templates", "Usage notes"],
  },
  {
    title: "Campaign",
    tag: "SEASON",
    icon: Megaphone,
    text: "A set of frames for the season, the booth, and the feed. Each piece works alone and in the set.",
    deliverables: ["Key visual", "Post set", "Booth frames", "Headline"],
  },
  {
    title: "Social",
    tag: "FEED",
    icon: Film,
    text: "A run of posts that keep the mark readable from a phone, ready on the morning they are needed.",
    deliverables: ["Feed set", "Story frames", "Caption direction", "Export files"],
  },
  {
    title: "Full brand",
    tag: "SYSTEM",
    icon: Sparkles,
    text: "Identity, campaign, and the social set as one job, for a launch that has to hold together.",
    deliverables: ["Identity system", "Launch campaign", "Social set", "Handover"],
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl border-t border-zinc-900/80 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            WHAT THE STUDIO SHIPS
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
            From the brief to <span className="text-red-600">the files</span>
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-400 md:text-base">
          Identities, seasonal campaigns, and social for companies in automotive, education, real estate, and the occasions of the year.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-[#0c0c10] p-6 transition hover:-translate-y-1 hover:border-red-500/60 hover:shadow-[0_20px_50px_rgba(229,9,20,0.2)] sm:p-8"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5">
                    <Icon className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] tracking-widest text-zinc-400 uppercase">
                    {service.tag}
                  </span>
                </div>
                <h3 className="font-brand text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{service.text}</p>
              </div>
              <div className="mt-6 border-t border-zinc-900 pt-5">
                <span className="mb-2 block text-[11px] tracking-wider text-zinc-500 uppercase">Deliverables</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-red-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

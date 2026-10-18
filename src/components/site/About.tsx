"use client";

import { Compass, Target, Users } from "lucide-react";
import { agency, recipe } from "@/lib/content";

const values = [
  {
    title: "One line the frame can hold",
    text: recipe[0].text,
    icon: Target,
  },
  {
    title: "Craft that works in a set",
    text: recipe[1].text,
    icon: Compass,
  },
  {
    title: "Files on the morning they are needed",
    text: recipe[2].text,
    icon: Users,
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl border-t border-zinc-900/80 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            ABOUT B2B.
          </div>
          <h2 className="font-brand text-3xl leading-tight font-black text-white md:text-5xl">
            Identities and campaigns
            <br />
            <span className="text-red-600">for companies</span>
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{agency.description}</p>
          <p className="text-sm text-zinc-500">Formerly {agency.former}.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-4">
                  <div className="mb-3 w-fit rounded-lg bg-zinc-900 p-2">
                    <Icon className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{value.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{value.text}</p>
                </article>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-red-500/40 bg-gradient-to-br from-[#120304] via-[#09090c] to-[#040405] p-6 shadow-[0_20px_50px_rgba(229,9,20,0.3)] sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-red-500">STUDIO RECORD</span>
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#e50914]" />
            </div>
            <p className="font-brand text-5xl font-black text-white">B2B.</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{agency.location}</p>
            <a href={`mailto:${agency.email}`} className="mt-6 inline-flex text-sm font-semibold text-red-400 hover:text-red-300">
              {agency.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

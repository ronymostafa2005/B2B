"use client";

import { Box, Layers, Sparkles } from "lucide-react";
import { agency, impact, projects } from "@/lib/content";
import { sound } from "@/lib/sound";

const fields = ["Automotive", "schools", "places", "brands"];

export function Hero() {
  function scrollTo(id: string) {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="top" className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24 lg:px-8">
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[380px] w-[min(720px,90%)] -translate-y-1/2 rounded-full bg-red-600/12 blur-[140px]" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div data-flow className="space-y-6 text-center lg:col-span-12 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 text-xs text-red-400 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-red-500" />
            <span>B2B. creative studio · identities, campaigns, social</span>
          </div>
          <h1 className="font-brand text-4xl leading-[1.05] font-black tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Work that{" "}
            <span className="text-red-600 whitespace-nowrap drop-shadow-[0_0_35px_rgba(229,9,20,0.8)]">holds the frame</span>
          </h1>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-brand text-3xl leading-none font-black text-white italic sm:gap-x-4 sm:text-5xl lg:justify-start lg:text-6xl">
            {fields.map((field, index) => (
              <span key={field} className="inline-flex items-center gap-3 sm:gap-4">
                {index > 0 ? <span className="h-2 w-2 shrink-0 rounded-full bg-red-600 shadow-[0_0_10px_#e50914]" aria-hidden="true" /> : null}
                {field}
              </span>
            ))}
          </p>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0">{agency.description}</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={() => scrollTo("showcase-3d")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(229,9,20,0.6)] hover:bg-red-700 sm:w-auto sm:text-base"
            >
              <Box className="h-5 w-5" />
              Enter the 3D showroom
            </button>
            <button
              type="button"
              onClick={() => scrollTo("portfolio")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-8 py-3.5 text-sm font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white sm:w-auto sm:text-base"
            >
              <Layers className="h-4 w-4 text-red-500" />
              Browse the archive ({projects.length} works)
            </button>
          </div>
        </div>
      </div>
      <div data-flow className="relative z-10 mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
        {impact.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="font-brand text-2xl font-black text-white sm:text-3xl">
              {item.value}
              {item.suffix}
            </div>
            <div className="mt-0.5 text-xs text-zinc-400">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

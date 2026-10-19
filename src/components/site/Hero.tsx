"use client";

import { FormEvent, useState } from "react";
import { Box, Calculator, Layers, Sparkles } from "lucide-react";
import { agency, impact, projects, readEstimate, type EstimateRead, type Project } from "@/lib/content";
import { sound } from "@/lib/sound";

const fields = ["Automotive", "schools", "places", "the year"];

function money(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Hero({ onSelectProject }: { onSelectProject: (project: Project) => void }) {
  const [brief, setBrief] = useState("");
  const [reading, setReading] = useState<EstimateRead | null>(null);
  const [hint, setHint] = useState("");

  function scrollTo(id: string) {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function onRead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = readEstimate(brief);
    if (!next) {
      setReading(null);
      setHint("Write the field and what you need.");
      sound.playClick();
      return;
    }
    setHint("");
    setReading(next);
    sound.playWhoosh();
  }

  function sendRange() {
    if (!reading || reading.outside) return;
    const field = reading.fieldLabel ?? "Field not in the archive";
    const summary = [
      `Brief: ${brief.trim()}`,
      `Starting range: ${field} · ${reading.kindLabel} · ${reading.sizeLabel}. ${money(reading.low)} to ${money(reading.high)}.`,
      reading.closestTitle ? `Closest in the archive: ${reading.closestTitle}.` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.dispatchEvent(new CustomEvent("b2b-brief", { detail: summary }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    sound.playSuccess();
  }

  const closest = reading?.closestSlug ? projects.find((project) => project.slug === reading.closestSlug) : undefined;

  return (
    <section id="top" className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24 lg:px-8">
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[380px] w-[min(720px,90%)] -translate-y-1/2 rounded-full bg-red-600/12 blur-[140px]" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div data-flow className="space-y-6 text-center lg:col-span-7 lg:text-left">
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
        <form
          onSubmit={onRead}
          data-flow
          className="rounded-[28px] border border-white/15 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 lg:col-span-5"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-red-300 uppercase">
            <Calculator className="h-3.5 w-3.5" />
            Starting range
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Write the field and what you need. The reader matches it to the studio bands.
          </p>
          <label htmlFor="hero-brief" className="mt-5 block text-xs tracking-wider text-zinc-500 uppercase">
            The brief
          </label>
          <textarea
            id="hero-brief"
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            rows={4}
            placeholder="Eid campaign for a car brand"
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/70"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(229,9,20,0.45)] hover:bg-red-700"
          >
            Read the brief
          </button>
          {hint ? <p className="mt-3 text-sm text-zinc-400">{hint}</p> : null}
          {reading?.outside ? <p className="mt-4 text-sm leading-relaxed text-zinc-300">{reading.craft}</p> : null}
          {reading && !reading.outside ? (
            <div className="mt-5 border-t border-white/10 pt-5" aria-live="polite">
              <p className="text-xs tracking-wider text-zinc-500 uppercase">Starting range</p>
              <p className="font-brand mt-2 text-3xl font-black text-white">
                {money(reading.low)}
                <span className="mt-1 block text-xl text-red-500">to {money(reading.high)}</span>
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                {reading.fieldLabel ?? "Field not in the archive"} · {reading.kindLabel} · {reading.sizeLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{reading.craft}</p>
              {closest ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectProject(closest);
                  }}
                  className="mt-3 text-left text-sm text-red-300 underline-offset-4 hover:underline"
                >
                  Closest in the archive: {closest.title}
                </button>
              ) : null}
              <button
                type="button"
                onClick={sendRange}
                className="mt-4 w-full rounded-xl border border-red-500/50 bg-red-950/40 py-3 text-sm font-semibold text-white hover:bg-red-950"
              >
                Send this range for a consult
              </button>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">The range is a guide. The free call sets the number.</p>
            </div>
          ) : null}
        </form>
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

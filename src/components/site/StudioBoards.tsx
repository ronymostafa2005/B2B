"use client";

import { LogoStage } from "@/components/site/LogoStage";
import { ScreeningRoom } from "@/components/site/ScreeningRoom";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function StudioBoards() {
  const { config } = useSiteConfig();
  const sec = config.sections.studioBoards;
  const filmPrograms = config.filmPrograms || [];

  return (
    <section id="boards" className="overflow-hidden border-t border-[var(--line-soft)] band">
      <div data-flow className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-veil)] px-3 py-1 text-xs text-[var(--brand)]">
          {sec.badgeText || "THE HOUSE REEL"}
        </div>
        <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
          {sec.title || "Marks in the light, then"}{" "}
          <span className="text-[var(--brand)]">{sec.titleHighlight || "the films"}</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
          {sec.description || "Each mark steps into the center. The films below are split into production and the cut made for the feed."}
        </p>
      </div>

      <LogoStage />

      {filmPrograms.map((program) => (
        <ScreeningRoom key={program.id} eyebrow={program.eyebrow} title={program.title} films={program.films} />
      ))}
    </section>
  );
}

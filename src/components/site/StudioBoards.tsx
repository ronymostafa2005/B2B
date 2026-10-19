import { filmPrograms } from "@/lib/content";
import { LogoStage } from "@/components/site/LogoStage";
import { ScreeningRoom } from "@/components/site/ScreeningRoom";

export function StudioBoards() {
  return (
    <section id="boards" className="overflow-hidden border-t border-zinc-900/80 py-16 sm:py-24">
      <div data-flow className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
          THE HOUSE REEL
        </div>
        <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
          Marks in the light, then <span className="text-red-600">the films</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
          Each mark steps into the center. The films below are split into production and the cut made for the feed.
        </p>
      </div>

      <LogoStage />

      {filmPrograms.map((program) => (
        <ScreeningRoom key={program.id} eyebrow={program.eyebrow} title={program.title} films={program.films} />
      ))}
    </section>
  );
}

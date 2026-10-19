import Image from "next/image";
import { marks } from "@/lib/content";
import { ScreeningRoom } from "@/components/site/ScreeningRoom";

export function StudioBoards() {
  const loop = [...marks, ...marks];

  return (
    <section id="boards" className="overflow-hidden border-t border-zinc-900/80 py-16 sm:py-24">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
          THE HOUSE REEL
        </div>
        <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
          The marks, then <span className="text-red-600">the screening</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
          Twelve marks on a quiet card. The film in the middle plays edge to edge, and the two beside it are the cut before and after.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070709] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070709] to-transparent" />
        <div className="wall-marquee flex w-max items-center gap-2 py-4">
          {loop.map((mark, index) => (
            <figure key={`${mark.src}-${index}`} className="flex h-28 w-44 shrink-0 items-center justify-center rounded-lg border border-[#6e6962] bg-[#b7b0a6] px-4">
              <Image
                src={mark.src}
                alt={mark.name}
                width={180}
                height={90}
                className="max-h-14 w-auto object-contain"
              />
              <figcaption className="sr-only">{mark.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <ScreeningRoom />
    </section>
  );
}

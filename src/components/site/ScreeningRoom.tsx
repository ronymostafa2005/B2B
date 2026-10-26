"use client";

import { useState } from "react";
import { SmartImage } from "@/components/SmartImage";

type Film = {
  src: string;
  poster: string;
  title: string;
  line: string;
  wide?: boolean;
};

export function ScreeningRoom({
  eyebrow,
  title,
  films,
}: {
  eyebrow: string;
  title: string;
  films: readonly Film[];
}) {
  const [active, setActive] = useState(0);
  const film = films[active];

  return (
    <div data-flow className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-red-500">{eyebrow}</p>
          <h3 className="font-brand mt-2 text-2xl font-black text-white sm:text-4xl">{title}</h3>
        </div>
        <p className="text-sm text-zinc-500">
          {String(active + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")}
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_24px_80px_rgba(229,9,20,0.16)]">
          <div className={`relative bg-black ${film.wide ? "aspect-video" : "mx-auto aspect-[9/16] w-full max-w-[420px]"}`}>
            <video
              key={film.src}
              src={film.src}
              poster={film.poster}
              controls
              playsInline
              muted
              autoPlay
              loop
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="border-t border-white/10 px-5 py-4">
            <p className="font-brand text-xl font-bold text-white">{film.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{film.line}</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {films.map((item, index) => {
            const on = index === active;
            return (
              <button
                key={item.src}
                type="button"
                onClick={() => setActive(index)}
                className={`flex w-56 shrink-0 items-center gap-3 rounded-2xl border p-2 text-left transition lg:w-full ${
                  on ? "border-red-500 bg-red-950/40" : "border-zinc-800 bg-[#0c0c10] hover:border-zinc-600"
                }`}
              >
                <SmartImage
                  src={item.poster}
                  alt=""
                  width={96}
                  height={128}
                  className={`h-16 w-12 rounded-lg object-cover ${item.wide ? "w-20" : ""}`}
                />
                <span>
                  <span className="block text-[10px] tracking-widest text-zinc-500 uppercase">{String(index + 1).padStart(2, "0")}</span>
                  <span className={`block text-sm font-semibold ${on ? "text-white" : "text-zinc-300"}`}>{item.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

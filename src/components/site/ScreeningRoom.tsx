"use client";

import { useEffect, useRef, useState } from "react";
import { mediaFilms } from "@/lib/content";

function Gate({
  index,
  active,
  onPick,
}: {
  index: number;
  active: boolean;
  onPick: (index: number) => void;
}) {
  const film = mediaFilms[index];
  const wide = active && "wide" in film && film.wide;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const park = () => {
      if (!active && video.currentTime < 0.2) video.currentTime = 0.35;
    };
    video.addEventListener("loadeddata", park);
    if (active) {
      video.muted = true;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
    return () => video.removeEventListener("loadeddata", park);
  }, [active, film.src]);

  const frame = (
    <span
      className={`relative block overflow-hidden border border-white/15 ${
        wide ? "aspect-video w-[min(92vw,920px)]" : active ? "aspect-[9/16] w-[min(78vw,380px)]" : "aspect-[9/16] w-[22vw] max-w-[170px]"
      } ${active ? "border-red-600 shadow-[0_0_40px_rgba(229,9,20,0.28)]" : "opacity-80"}`}
    >
      <video
        ref={videoRef}
        key={film.src}
        src={film.src}
        controls={active}
        playsInline
        muted
        loop={active}
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </span>
  );

  return (
    <div className={`shrink-0 ${active ? "" : "hidden sm:block"}`}>
      {active ? (
        frame
      ) : (
        <button type="button" onClick={() => onPick(index)} className="block">
          {frame}
        </button>
      )}
      <p className={`mt-2 max-w-[380px] text-sm font-semibold ${active ? "text-white" : "text-zinc-400"}`}>{film.title}</p>
      {active ? <p className="mt-0.5 max-w-[380px] text-[11px] text-zinc-500">{film.line}</p> : null}
    </div>
  );
}

export function ScreeningRoom() {
  const [active, setActive] = useState(0);
  const count = mediaFilms.length;
  const slots = [(active - 1 + count) % count, active, (active + 1) % count];

  return (
    <div className="mt-14">
      <div className="flex items-center justify-center gap-3 px-4 sm:gap-5">
        {slots.map((index, slot) => (
          <Gate key={`${slot}-${mediaFilms[index].src}`} index={index} active={slot === 1} onPick={setActive} />
        ))}
      </div>
      <div className="mx-auto mt-5 flex max-w-5xl gap-2 overflow-x-auto px-4 pb-2 sm:hidden">
        {mediaFilms.map((film, index) => (
          <button
            key={film.src}
            type="button"
            onClick={() => setActive(index)}
            className={`shrink-0 border px-3 py-2 text-xs ${index === active ? "border-red-600 text-white" : "border-zinc-800 text-zinc-400"}`}
          >
            {film.title}
          </button>
        ))}
      </div>
    </div>
  );
}

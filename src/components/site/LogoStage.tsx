"use client";

import { useEffect, useState } from "react";
import { marks } from "@/lib/content";

function wrapOffset(index: number, active: number, count: number) {
  let offset = index - active;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

export function LogoStage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = marks.length;

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  return (
    <div
      data-flow
      className="relative mx-auto max-w-6xl px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/25 blur-3xl" />
      <div className="logo-orbit relative h-[240px] sm:h-[280px]">
        {marks.map((mark, index) => {
          const offset = wrapOffset(index, active, count);
          const distance = Math.abs(offset);
          if (distance > 3) return null;
          return (
            <button
              key={mark.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={mark.name}
              className="logo-card absolute top-1/2 left-1/2 flex h-28 w-40 items-center justify-center sm:h-36 sm:w-52"
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 190}px) scale(${distance === 0 ? 1 : 0.9})`,
                opacity: distance === 0 ? 1 : 0.8,
                zIndex: 20 - distance,
              }}
            >
              <img src={mark.src} alt="" width={240} height={140} className="h-auto max-h-[110px] w-auto max-w-[170px] object-contain sm:max-h-[128px] sm:max-w-[190px]" />
            </button>
          );
        })}
      </div>
      <p className="font-brand mt-2 text-center text-xl font-bold text-white" aria-live="polite">
        {marks[active].name}
      </p>
      <div className="mt-4 flex justify-center gap-1.5">
        {marks.map((mark, index) => (
          <button
            key={mark.src}
            type="button"
            aria-label={`Show ${mark.name}`}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-red-600" : "w-1.5 bg-zinc-700"}`}
          />
        ))}
      </div>
    </div>
  );
}

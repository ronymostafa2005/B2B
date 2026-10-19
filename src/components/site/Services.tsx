"use client";

import { useEffect, useState } from "react";
import { studioServices } from "@/lib/content";

export function Services() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const service = studioServices[active];

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % studioServices.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section id="services" className="border-t border-zinc-900/80 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-flow className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            WHAT THE STUDIO SHIPS
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
            From the brief to <span className="text-red-600">the files</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Four offers. One stays on stage, and the line moves when the next one is ready.
          </p>
        </div>

        <div
          data-flow
          className="grid items-stretch gap-6 lg:grid-cols-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ol className="flex gap-3 overflow-x-auto lg:col-span-4 lg:flex-col lg:overflow-visible">
            {studioServices.map((item, index) => {
              const on = index === active;
              return (
                <li key={item.title} className="min-w-[220px] flex-1 lg:min-w-0">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={on ? "true" : undefined}
                    className={`relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left transition ${
                      on ? "border-red-500/70 bg-red-950/30" : "border-zinc-800 bg-[#0c0c10] hover:border-zinc-600"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-brand text-xs text-red-500">{item.index}</span>
                      <span className="text-[10px] tracking-[0.22em] text-zinc-500 uppercase">{item.tag}</span>
                    </span>
                    <span className={`mt-1 block font-brand text-lg font-bold ${on ? "text-white" : "text-zinc-300"}`}>
                      {item.title}
                    </span>
                    <span className="mt-3 block h-0.5 overflow-hidden rounded-full bg-zinc-800">
                      <span className={`block h-full bg-red-600 ${on && !paused ? "service-meter" : on ? "w-full" : "w-0"}`} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <article key={service.title} className="service-panel relative overflow-hidden rounded-[28px] border border-red-500/30 bg-[#10060a] lg:col-span-8">
            <div className="pointer-events-none absolute -top-16 -right-10 font-brand text-[9rem] leading-none font-black text-white/5">
              {service.index}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-red-600/20 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
              <div>
                <p className="text-xs tracking-[0.28em] text-red-400 uppercase">{service.tag}</p>
                <h3 className="font-brand mt-3 text-4xl font-black text-white sm:text-5xl">{service.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">{service.text}</p>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((item, index) => (
                  <li
                    key={item}
                    className="service-chip rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    style={{ animationDelay: `${120 + index * 90}ms` }}
                  >
                    <span className="mr-2 font-brand text-xs text-red-500">{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

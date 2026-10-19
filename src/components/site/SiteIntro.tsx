"use client";

import { useEffect, useState } from "react";
import { studioServices } from "@/lib/content";
import { markIntroDone } from "@/components/site/Flow";

type Phase = "logo" | "services" | "leave" | "done";

export function SiteIntro() {
  const [phase, setPhase] = useState<Phase>("logo");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      markIntroDone();
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const showServices = window.setTimeout(() => setPhase("services"), 1600);
    const leave = window.setTimeout(() => {
      setPhase("leave");
      markIntroDone();
    }, 5200);
    const done = window.setTimeout(() => {
      document.body.style.overflow = previous;
      setPhase("done");
    }, 6100);
    return () => {
      window.clearTimeout(showServices);
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  if (phase === "done") return null;

  const showServices = phase === "services" || phase === "leave";

  return (
    <div data-intro="" className={`fixed inset-0 z-[80] flex items-center justify-center bg-black ${phase === "leave" ? "intro-leave" : ""}`}>
      <div className={`flex w-[min(92vw,640px)] flex-col items-center ${showServices ? "intro-lockup" : ""}`}>
        <img
          src="/brand/wordmark.png"
          alt="B2B. Marketing Agency"
          className={`intro-logo h-auto object-contain ${showServices ? "w-[min(46vw,220px)]" : "w-[min(78vw,460px)]"}`}
        />
        {showServices ? (
          <ol className="mt-8 w-full space-y-2">
            {studioServices.map((service, index) => (
              <li
                key={service.title}
                className="intro-row flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                style={{ animationDelay: `${index * 160}ms` }}
              >
                <span className="font-brand text-sm text-red-500">{service.index}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-red-600/80 to-transparent" />
                <span className="font-brand text-lg text-white sm:text-2xl">{service.title}</span>
                <span className="hidden text-[10px] tracking-[0.22em] text-zinc-500 uppercase sm:inline">{service.tag}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}

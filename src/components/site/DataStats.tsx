"use client";

import { useEffect, useState, type ReactNode } from "react";
import { recipe, sectors } from "@/lib/content";
import { sound } from "@/lib/sound";
import { useSiteConfig } from "@/context/SiteConfigContext";

const colors = ["#E50914", "#F59E0B", "#6366F1", "#10B981", "#EC4899"];

export function DataStats() {
  const { config } = useSiteConfig();
  const sec = config.sections.dataStats;
  const impactList = config.impact;
  const projectList = config.projects;

  const [tab, setTab] = useState<"kpi" | "fields" | "build">("kpi");
  const [on, setOn] = useState(false);
  const fields = sectors
    .filter((item) => item.id !== "all")
    .map((item, index) => {
      const count = projectList.filter((project) => project.sector === item.id).length;
      return {
        label: item.label,
        count,
        pct: projectList.length ? Math.round((count / projectList.length) * 100) : 0,
        color: colors[index % colors.length],
      };
    });

  useEffect(() => {
    const node = document.getElementById("agency-data");
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="agency-data" data-flow className="mx-auto max-w-7xl border-t border-zinc-900/80 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
          {sec.badgeText || "THE RECORD"}
        </div>
        <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
          {sec.title || "The archive,"} <span className="text-red-600">{sec.titleHighlight || "in the open"}</span>
        </h2>
        <p className="mt-3 text-sm text-zinc-400 md:text-base">
          {sec.description || "Years, shipped projects, clients, and how the work on this site is split across fields."}
        </p>
        <div className="mt-8 inline-flex flex-wrap justify-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-1.5">
          {(
            [
              ["kpi", "Studio record"],
              ["fields", "Fields in view"],
              ["build", "How it is built"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                sound.playClick();
              }}
              className={`rounded-xl px-4 py-2 text-xs font-semibold sm:text-sm ${
                tab === id ? "bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]" : "text-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "kpi" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactList.map((item) => (
            <article key={item.label} className="rounded-2xl border border-zinc-800/80 bg-[#0c0c10] p-6 transition hover:-translate-y-1 hover:border-red-500/50">
              <div className="font-brand text-4xl font-black text-white sm:text-5xl">
                <Count to={item.value} run={on} />
                {item.suffix}
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-200">{item.label}</h3>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "fields" ? (
        <div className="grid items-center gap-8 rounded-3xl border border-zinc-800 bg-[#0c0c10] p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-4">
            <h3 className="font-brand text-2xl font-bold text-white">Share of the archive</h3>
            <p className="text-sm text-zinc-400">
              {projectList.length} cases on this site, counted by the field they were made for.
            </p>
            {fields.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>
                    {item.label} · {item.count}
                  </span>
                  <span className="text-red-400">{item.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 208 208" aria-hidden="true">
                <circle cx="104" cy="104" r="88" stroke="#18181b" strokeWidth="16" fill="transparent" />
                {fields.reduce<{ offset: number; nodes: ReactNode[] }>(
                  (state, item) => {
                    const length = 2 * Math.PI * 88;
                    const dash = (item.pct / 100) * length;
                    state.nodes.push(
                      <circle
                        key={item.label}
                        cx="104"
                        cy="104"
                        r="88"
                        stroke={item.color}
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray={`${dash} ${length - dash}`}
                        strokeDashoffset={-state.offset}
                      />,
                    );
                    state.offset += dash;
                    return state;
                  },
                  { offset: 0, nodes: [] },
                ).nodes}
              </svg>
              <div className="absolute text-center">
                <div className="font-brand text-3xl font-black text-white">{projectList.length}</div>
                <div className="text-[11px] text-zinc-400">cases</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "build" ? (
        <ol className="grid gap-4 md:grid-cols-3">
          {recipe.map((step) => (
            <li key={step.step} className="rounded-2xl border border-zinc-800 bg-[#0c0c10] p-6">
              <span className="text-xs font-bold text-red-500">{step.step}</span>
              <h3 className="font-brand mt-2 text-2xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{step.text}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function Count({ to, run }: { to: number; run: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setValue(Math.round(to * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);
  return <span>{value}</span>;
}

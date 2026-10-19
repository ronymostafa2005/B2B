"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import { filterProjects, matchBrief, prompts, projects, sectors, studioFrames, styles, type Project, type SectorId, type StyleFilter } from "@/lib/content";
import { sound } from "@/lib/sound";

export function PortfolioGrid({ onSelectProject }: { onSelectProject: (project: Project) => void }) {
  const [sector, setSector] = useState<SectorId>("all");
  const [tone, setTone] = useState<StyleFilter>("all");
  const [query, setQuery] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    const base = filterProjects(sector, "all", tone);
    const text = query.trim().toLowerCase();
    if (!text) return base;
    return base.filter((project) =>
      [project.title, project.solution, project.problem, project.sector, ...project.keys, ...project.needs]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [query, sector, tone]);

  function runBrief(text: string) {
    setQuery(text);
    const hits = matchBrief(text);
    setReasons(Object.fromEntries(hits.map((hit) => [hit.slug, hit.reason])));
    sound.playSuccess();
  }

  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div data-flow className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            SELECTED CASE STUDIES
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
            The <span className="text-red-600">archive</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-400 md:text-base">
            {projects.length} shipped campaigns and identities. Search a brief and the reader puts the closest work first.
          </p>
        </div>
        <label className="relative w-full md:w-80">
          <span className="sr-only">Search the archive</span>
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setReasons({});
            }}
            placeholder="Search campaigns, fields, briefs"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {sectors.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSector(item.id);
              sound.playClick();
            }}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold sm:text-sm ${
              sector === item.id ? "bg-red-600 text-white shadow-[0_0_20px_rgba(229,9,20,0.5)]" : "border border-zinc-800 bg-zinc-900/90 text-zinc-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {styles.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTone(item.id);
              sound.playClick();
            }}
            className={`rounded-full px-3 py-1 text-xs ${
              tone === item.id ? "bg-white text-black" : "border border-zinc-800 text-zinc-400"
            }`}
          >
            {item.id === "all" ? "Any tone" : item.label}
          </button>
        ))}
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => runBrief(prompt)}
            className="rounded-full border border-red-900/60 px-3 py-1 text-xs text-red-300 hover:border-red-500"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mb-10">
        <p className="mb-4 text-xs tracking-[0.22em] text-zinc-500 uppercase">Offers and the clinic</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {studioFrames.map((frame) => (
            <figure key={frame.src} data-flow className="group">
              <div className="relative bg-[#070709] p-3 ring-1 ring-white/10">
                <span className="pointer-events-none absolute top-1.5 left-1.5 h-3.5 w-3.5 border-t border-l border-red-600" />
                <span className="pointer-events-none absolute top-1.5 right-1.5 h-3.5 w-3.5 border-t border-r border-red-600" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-3.5 w-3.5 border-b border-l border-red-600" />
                <span className="pointer-events-none absolute right-1.5 bottom-1.5 h-3.5 w-3.5 border-r border-b border-red-600" />
                <Image
                  src={frame.src}
                  alt={frame.line}
                  width={480}
                  height={517}
                  quality={100}
                  unoptimized
                  sizes="(min-width: 1024px) 280px, 45vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-white">{frame.title}</span>
                <span className="text-[11px] text-zinc-500">{frame.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => {
              sound.playSuccess();
              onSelectProject(project);
            }}
            data-flow
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0d0d11] text-left transition duration-300 hover:-translate-y-2 hover:border-red-500/60 hover:shadow-[0_20px_40px_rgba(229,9,20,0.25)]"
          >
            <span className="relative block h-56 overflow-hidden sm:h-64">
              <Image
                src={project.images[0]}
                alt={project.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <span className="absolute top-3 left-3 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-[10px] tracking-wider text-zinc-300 uppercase">
                {sectors.find((item) => item.id === project.sector)?.label}
              </span>
              <span className="absolute right-3 bottom-3 rounded-full bg-red-600 p-2.5 text-white opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </span>
            <span className="flex flex-1 flex-col border-t border-zinc-900 bg-gradient-to-b from-[#0d0d11] to-[#070709] p-5">
              <span className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                <span>{project.needs.join(" · ")}</span>
                <span className="font-bold text-red-500">{project.images.length} frames</span>
              </span>
              <span className="font-brand text-xl font-bold text-white group-hover:text-red-500">{project.title}</span>
              <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {reasons[project.slug] ?? project.solution}
              </span>
            </span>
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 py-16 text-center">
          <p className="text-zinc-400">No projects matched that search.</p>
          <button
            type="button"
            onClick={() => {
              setSector("all");
              setTone("all");
              setQuery("");
              setReasons({});
            }}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </section>
  );
}

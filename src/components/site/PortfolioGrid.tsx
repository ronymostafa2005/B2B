"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import { prompts, sectors, studioFrames, styles, type Project, type SectorId, type StyleFilter } from "@/lib/content";
import { sound } from "@/lib/sound";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function PortfolioGrid({ onSelectProject }: { onSelectProject: (project: Project) => void }) {
  const { config } = useSiteConfig();
  const portfolioSection = config.sections.portfolio;
  // Memoised so the `|| []` fallback does not produce a fresh array on every
  // render, which would defeat the filtering memo below.
  const allProjects = useMemo(
    () => (config.projects as unknown as Project[]) || [],
    [config.projects]
  );

  const [sector, setSector] = useState<SectorId>("all");
  const [tone, setTone] = useState<StyleFilter>("all");
  const [query, setQuery] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    return allProjects.filter((project) => {
      const sectorOk = sector === "all" || project.sector === sector;
      const toneOk = tone === "all" || project.styles.includes(tone as unknown as typeof project.styles[number]);
      if (!sectorOk || !toneOk) return false;

      const text = query.trim().toLowerCase();
      if (!text) return true;
      return [project.title, project.arabic, project.solution, project.problem, project.sector, ...(project.keys || []), ...(project.needs || [])]
        .join(" ")
        .toLowerCase()
        .includes(text);
    });
  }, [allProjects, query, sector, tone]);

  function runBrief(text: string) {
    setQuery(text);
    const tokens = text.toLowerCase().split(/\s+/);
    const hits = allProjects.filter((p) =>
      tokens.some((t) => [p.title, p.arabic, p.problem, p.solution, ...(p.keys || [])].join(" ").toLowerCase().includes(t))
    );
    setReasons(Object.fromEntries(hits.map((hit) => [hit.slug, hit.solution])));
    sound.playSuccess();
  }

  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div data-flow className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-500">
            {portfolioSection.badgeText || "SELECTED CASE STUDIES"}
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
            {portfolioSection.title || "The"}{" "}
            <span className="text-red-600">{portfolioSection.titleHighlight || "archive"}</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-400 md:text-base">
            {allProjects.length} shipped campaigns and identities. Search a brief and the reader puts the closest work first.
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
        {visible.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => {
              sound.playSuccess();
              onSelectProject(project);
            }}
            data-flow
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0d0d11] text-left transition duration-300 hover:border-zinc-600"
          >
            <span className="relative grid h-52 place-items-center overflow-hidden bg-[#0c0c10] sm:h-60">
              <span className="px-8 text-center">
                <span
                  className="mark-name font-brand block text-balance text-[1.65rem] leading-none font-semibold text-white sm:text-[2rem]"
                  style={{ animationDelay: `${(index % 3) * 80}ms` }}
                >
                  {project.title}
                </span>
                <span
                  className="mark-rule mx-auto mt-4 block h-px w-10 origin-center bg-red-600"
                  style={{ animationDelay: `${180 + (index % 3) * 80}ms` }}
                />
                <span
                  className="mark-arabic mt-3 block text-[11px] tracking-[0.32em] text-zinc-500"
                  dir="rtl"
                  style={{ animationDelay: `${320 + (index % 3) * 80}ms` }}
                >
                  {project.arabic}
                </span>
              </span>
              <span className="absolute top-3 left-3 rounded-full border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-zinc-400 uppercase">
                {sectors.find((item) => item.id === project.sector)?.label || project.sector}
              </span>
              <span className="absolute right-3 bottom-3 text-zinc-500 opacity-0 transition duration-300 group-hover:text-zinc-200 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </span>
            <span className="flex flex-1 flex-col border-t border-zinc-900 bg-[#070709] p-5">
              <span className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>{project.needs.join(" · ")}</span>
                <span>{project.images.length} frames</span>
              </span>
              <span className="text-sm font-semibold tracking-wide text-zinc-200">{project.title}</span>
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

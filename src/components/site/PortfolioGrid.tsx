"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, ImageOff, Search } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { briefTokens, prompts, sectors, styles, type Project, type SectorId, type StyleFilter } from "@/lib/content";
import { sound } from "@/lib/sound";
import { useSiteConfig } from "@/context/SiteConfigContext";

/* Three rows of the widest grid, so a "show more" always lands on a clean
   row rather than a ragged half-row. */
const PAGE_STEP = 9;

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
  /* How many of the matched projects are on screen. The archive grows as the
     studio ships work, and rendering every card mounts every cover image. */
  const [shown, setShown] = useState(PAGE_STEP);

  // Any change of filter, tone or query is a new result set, so the window
  // goes back to the first page rather than keeping a deep scroll.
  const resetWindow = () => setShown(PAGE_STEP);

  const visible = useMemo(() => {
    const inScope = allProjects.filter((project) => {
      const sectorOk = sector === "all" || project.sector === sector;
      const toneOk = tone === "all" || project.styles.includes(tone as unknown as typeof project.styles[number]);
      return sectorOk && toneOk;
    });

    /* Match on tokens, not the whole phrase, and rank by how many land.
       Matching the raw string meant a suggested brief like "Bold campaign for
       a car brand" was never a substring of any project and emptied the grid —
       while the copy promises the closest work comes first. */
    const tokens = briefTokens(query);
    if (tokens.length === 0) return inScope;

    return inScope
      .map((project) => {
        const haystack = [
          project.title,
          project.arabic,
          project.solution,
          project.problem,
          project.sector,
          ...(project.keys || []),
          ...(project.needs || []),
          ...(project.styles || []),
        ]
          .join(" ")
          .toLowerCase();
        const score = tokens.reduce((n, token) => n + (haystack.includes(token) ? 1 : 0), 0);
        return { project, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.project);
  }, [allProjects, query, sector, tone]);

  function runBrief(text: string) {
    setQuery(text);
    resetWindow();
    const tokens = text.toLowerCase().split(/\s+/);
    const hits = allProjects.filter((p) =>
      tokens.some((t) => [p.title, p.arabic, p.problem, p.solution, ...(p.keys || [])].join(" ").toLowerCase().includes(t))
    );
    setReasons(Object.fromEntries(hits.map((hit) => [hit.slug, hit.solution])));
    sound.playSuccess();
  }

  return (
    <section id="portfolio" className="mx-auto max-w-7xl band px-4 sm:px-6 lg:px-8">
      <div data-flow className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-veil)] px-3 py-1 text-xs text-[var(--brand)]">
            {portfolioSection.badgeText || "SELECTED CASE STUDIES"}
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-5xl">
            {portfolioSection.title || "The"}{" "}
            <span className="text-[var(--brand)]">{portfolioSection.titleHighlight || "archive"}</span>
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
              resetWindow();
            }}
            placeholder="Search campaigns, fields, briefs"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] py-2.5 pr-4 pl-10 text-sm text-[var(--ink)] placeholder:text-[var(--ink-ghost)] transition focus:border-[var(--brand)]"
          />
        </label>
      </div>

      {/* Three different kinds of control used to sit in two unlabelled rows:
          sector filters, tone filters, and brief prompts that run a search
          rather than filter. Grouping and labelling them makes the difference
          legible, and the accent is reserved for the one active choice. */}
      <div className="mb-10 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="micro w-16 shrink-0 pt-1 sm:pt-0">Sector</span>
          <div className="flex flex-wrap gap-2">
            {sectors.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={sector === item.id}
                onClick={() => {
                  setSector(item.id);
                  resetWindow();
                  sound.playClick();
                }}
                className="chip"
                data-active={sector === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="micro w-16 shrink-0 pt-1 sm:pt-0">Tone</span>
          <div className="flex flex-wrap gap-2">
            {styles.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={tone === item.id}
                onClick={() => {
                  setTone(item.id);
                  resetWindow();
                  sound.playClick();
                }}
                className="chip"
                data-active={tone === item.id}
              >
                {item.id === "all" ? "Any tone" : item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--line-soft)] pt-5 sm:flex-row sm:items-start">
          <span className="micro w-16 shrink-0 pt-1.5">Try</span>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => runBrief(prompt)}
                className="chip chip-ghost"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The archive leads with the work itself. The static four-frame strip
          that used to sit here showed one brand's set and never responded to
          the filters, while the real projects rendered as text-only cards —
          their title set large on an empty panel, then repeated underneath.
          Each card now opens on its own first frame. */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {visible.slice(0, shown).map((project, index) => {
          const sectorLabel =
            sectors.find((item) => item.id === project.sector)?.label || project.sector;
          const cover = project.images?.[0];

          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => {
                sound.playSuccess();
                onSelectProject(project);
              }}
              data-flow
              aria-label={`Open ${project.title}`}
              className="group flex flex-col text-left"
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface-sunk)] transition duration-300 group-hover:border-[var(--line-strong)]">
                {cover ? (
                  <SmartImage
                    src={cover}
                    alt={project.alt || project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center">
                    <ImageOff className="h-5 w-5 text-[var(--ink-ghost)]" />
                  </span>
                )}

                {/* Scrim only at the foot, so the artwork stays readable while
                    the sector and the open affordance keep their contrast. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/85 uppercase backdrop-blur-sm">
                  {sectorLabel}
                </span>

                <span className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[11px] text-white/70">
                  <span className="translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {project.images.length} frames
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
                </span>
              </span>

              <span className="mt-3.5 flex items-baseline justify-between gap-3">
                <span className="font-brand text-[1.05rem] leading-tight text-[var(--ink)]">
                  {project.title}
                </span>
                <span className="shrink-0 text-[11px] tracking-[0.2em] text-[var(--ink-ghost)]" dir="rtl">
                  {project.arabic}
                </span>
              </span>

              <span className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--ink-faint)]">
                {reasons[project.slug] ?? project.solution}
              </span>

              {/* The rule is the one accent on the card and only draws on hover,
                  so a wall of twenty does not read as twenty competing marks. */}
              <span className="mt-3 block h-px w-8 origin-left bg-[var(--brand)] transition-all duration-300 group-hover:w-16" />
            </button>
          );
        })}
      </div>

      {/* Progressive reveal rather than numbered pages. The archive is ranked
          — closest work first — and numbered pages would bury the strongest
          matches behind a click, reload every cover on each page change, and
          throw away the reader's scroll position mid-browse. */}
      {visible.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div
            className="h-px w-full max-w-xs"
            style={{ background: "linear-gradient(90deg,transparent,var(--line),transparent)" }}
          />

          {/* Announced politely so the count reaches a screen reader after the
              new row mounts, without interrupting. */}
          <p className="micro" aria-live="polite">
            Showing {Math.min(shown, visible.length)} of {visible.length}
          </p>

          {shown < visible.length && (
            <button
              type="button"
              onClick={() => {
                setShown((n) => n + PAGE_STEP);
                sound.playClick();
              }}
              className="btn btn-quiet"
            >
              Show {Math.min(PAGE_STEP, visible.length - shown)} more
              <ArrowDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

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
              resetWindow();
            }}
            className="mt-4 rounded-xl bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-[var(--brand-contrast)]"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </section>
  );
}

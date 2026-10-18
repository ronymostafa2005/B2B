"use client";

import { useMemo, useState } from "react";
import { WorkCard } from "@/components/WorkCard";
import {
  filterProjects,
  matchBrief,
  needs,
  prompts,
  sectors,
  styles,
  type BriefMatch,
  type NeedFilter,
  type SectorId,
  type StyleFilter,
} from "@/lib/content";

export function StudioDesk() {
  const [sector, setSector] = useState<SectorId>("all");
  const [need, setNeed] = useState<NeedFilter>("all");
  const [style, setStyle] = useState<StyleFilter>("all");
  const [brief, setBrief] = useState("");
  const [reading, setReading] = useState(false);
  const [note, setNote] = useState("");
  const [hits, setHits] = useState<BriefMatch[] | null>(null);

  const matches = useMemo(() => {
    const pool = filterProjects(sector, need, style);
    if (!hits) return pool;
    const order = new Map(hits.map((hit, index) => [hit.slug, index]));
    const focused = pool
      .filter((project) => order.has(project.slug))
      .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
    return focused.length > 0 ? focused : pool;
  }, [sector, need, style, hits]);

  const sectorLabel = sectors.find((item) => item.id === sector)?.label;
  const needLabel = needs.find((item) => item.id === need)?.label;
  const styleLabel = styles.find((item) => item.id === style)?.label;

  function askFor(title: string) {
    const detail = `Something close to “${title}”. Sector: ${sectorLabel}. Need: ${needLabel}. Tone: ${styleLabel}.`;
    window.dispatchEvent(new CustomEvent("b2b-brief", { detail }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function readBrief(text: string) {
    const query = text.trim();
    setBrief(text);
    if (!query) {
      setHits(null);
      setNote("");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReading(true);
    setNote("Reading the brief against the archive.");
    window.setTimeout(() => {
      const found = matchBrief(query);
      setReading(false);
      if (found.length === 0) {
        setHits(null);
        setNote("No close set for that mix. The full archive is below — or send it as a new brief.");
        return;
      }
      setHits(found);
      setNote(found[0].reason);
    }, reduce ? 0 : 700);
  }

  return (
    <section className="section" id="work">
      <div className="wrap">
        <header className="band">
          <div>
            <p className="eyebrow">
              <span>{String(matches.length).padStart(2, "0")}</span> in view
            </p>
            <h2>The archive.</h2>
          </div>
          <p className="deck">
            Write a brief. The reader reorders the wall and says why each piece is here.
          </p>
        </header>

        <form
          id="brief-reader"
          className={`reader ${reading ? "is-reading" : ""}`}
          onSubmit={(event) => {
            event.preventDefault();
            readBrief(brief);
          }}
        >
          <label htmlFor="studio-brief">Brief</label>
          <textarea
            id="studio-brief"
            value={brief}
            rows={3}
            placeholder="A bold Eid campaign for a car brand, or a calm school identity."
            onChange={(event) => setBrief(event.target.value)}
          />
          <div className="reader-row">
            <button className="button" type="submit">
              Match the work
            </button>
            {hits ? (
              <button
                className="text-link"
                type="button"
                onClick={() => {
                  setHits(null);
                  setNote("");
                  setBrief("");
                }}
              >
                Show the full archive
              </button>
            ) : null}
          </div>
          <div className="prompt-row">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => readBrief(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <p className="reader-note" role="status">
            {note}
          </p>
        </form>

        <div className="config" aria-label="Filter the work">
          <Choice legend="Field" value={sector} options={sectors} onChange={setSector} />
          <Choice legend="Need" value={need} options={needs} onChange={setNeed} />
          <Choice legend="Tone" value={style} options={styles} onChange={setStyle} />
        </div>

        {matches.length === 0 ? (
          <div className="empty-work">
            <p>No shipped example for this mix yet. We can start it on your project.</p>
            <button className="button" type="button" onClick={() => askFor("A new project")}>
              Start this case
            </button>
          </div>
        ) : (
          <div className="cards">
            {matches.map((project) => (
              <WorkCard
                key={project.slug}
                project={project}
                picked={Boolean(hits?.some((hit) => hit.slug === project.slug))}
                reason={hits?.find((hit) => hit.slug === project.slug)?.reason}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      <div className="choice-row">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

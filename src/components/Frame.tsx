"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProject, reel } from "@/lib/content";

type Read = {
  id: string;
  label: string;
  x: number;
  y: number;
  line: string;
};

const reads: Record<(typeof reel)[number]["slug"], Read[]> = {
  "shark-care": [
    {
      id: "type",
      label: "Read the type",
      x: 54,
      y: 46,
      line: "The red calligraphy is the greeting. Shark Care stays in the mark above it.",
    },
    {
      id: "roster",
      label: "Find the roster",
      x: 48,
      y: 82,
      line: "The partner marks sit on the road, so the occasion never hides who made it.",
    },
    {
      id: "mood",
      label: "Name the mood",
      x: 22,
      y: 18,
      line: "A lit city, one red voice. Bold enough to stop a thumb.",
    },
  ],
  tevo: [
    {
      id: "type",
      label: "Read the type",
      x: 58,
      y: 34,
      line: "White calligraphy carries the wish. TEVO stays small and clear at the top.",
    },
    {
      id: "car",
      label: "Find the car",
      x: 62,
      y: 78,
      line: "The blue car is the product. The night is only the setting.",
    },
    {
      id: "mood",
      label: "Name the mood",
      x: 22,
      y: 48,
      line: "Crescent, lanterns, wet ground. Calm, then the headlights.",
    },
  ],
  onyx: [
    {
      id: "type",
      label: "Read the type",
      x: 50,
      y: 16,
      line: "The white line is the greeting. ONYX is the quiet mark under the car.",
    },
    {
      id: "car",
      label: "Find the car",
      x: 48,
      y: 62,
      line: "A dark SUV on wet stone. The coating is the thing you are meant to want.",
    },
    {
      id: "mood",
      label: "Name the mood",
      x: 70,
      y: 28,
      line: "The mosque holds the occasion. The car holds the brand.",
    },
  ],
  protexa: [
    {
      id: "type",
      label: "Read the type",
      x: 72,
      y: 22,
      line: "The calligraphy wishes the year well. PROTEXA is named once, at the base.",
    },
    {
      id: "car",
      label: "Find the car",
      x: 55,
      y: 72,
      line: "A black sedan in evening light. Paint protection, shown as a finish.",
    },
    {
      id: "mood",
      label: "Name the mood",
      x: 24,
      y: 36,
      line: "Warm stone arches. The greeting feels settled, not loud.",
    },
  ],
};

export function Frame() {
  const [index, setIndex] = useState(0);
  const [readId, setReadId] = useState(reads[reel[0].slug][0].id);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [spoken, setSpoken] = useState("");
  const slide = reel[index];
  const project = getProject(slide.slug);
  const notes = reads[slide.slug];
  const note = notes.find((item) => item.id === readId) ?? notes[0];
  const point = lens ?? { x: note.x / 100, y: note.y / 100 };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSpoken(note.line);
      return;
    }
    let cursor = 0;
    setSpoken("");
    const timer = window.setInterval(() => {
      cursor += 1;
      setSpoken(note.line.slice(0, cursor));
      if (cursor >= note.line.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [note.line]);

  return (
    <section className="section" id="frame">
      <div className="wrap">
        <header className="band">
          <div>
            <p className="eyebrow">
              <span>02</span> Director
            </p>
            <h2>Ask the frame.</h2>
          </div>
          <p className="deck">
            Pick a read. The glass moves to the type, the car, or the mood, and says what the picture is doing.
          </p>
        </header>

        <div className="director">
          <div
            className="director-stage"
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              setLens({
                x: (event.clientX - rect.left) / rect.width,
                y: (event.clientY - rect.top) / rect.height,
              });
            }}
            onPointerLeave={() => setLens(null)}
          >
            <Image src={slide.src} alt={slide.line} fill sizes="(max-width: 900px) 100vw, 1120px" />
            <span
              className="frame-lens"
              style={{
                left: `${point.x * 100}%`,
                top: `${point.y * 100}%`,
                backgroundImage: `url(${slide.src})`,
                backgroundPosition: `${point.x * 100}% ${point.y * 100}%`,
              }}
            />
            <div className="director-copy">
              <p>
                <strong>{slide.title}</strong>
                <span className="ar">{slide.arabic}</span>
              </p>
              <p className="director-line" aria-live="polite">
                {spoken}
              </p>
            </div>
          </div>

          <div className="director-tools">
            <div className="prompt-row" role="tablist" aria-label="What to read">
              {notes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === note.id}
                  onClick={() => {
                    setReadId(item.id);
                    setLens(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {project ? (
              <Link className="button" href={`/work/${project.slug}`}>
                Open the case
              </Link>
            ) : null}
          </div>

          <div className="filmstrip">
            {reel.map((item, itemIndex) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={itemIndex === index}
                onClick={() => {
                  setIndex(itemIndex);
                  setReadId(reads[item.slug][0].id);
                  setLens(null);
                }}
              >
                <Image src={item.src} alt="" width={240} height={300} />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

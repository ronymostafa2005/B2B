"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { projects } from "@/lib/content";

const chapters = [
  {
    id: "campaign",
    label: "Campaign",
    title: "The picture that sells the place.",
    text: "New Era, Glory, and Aqar Expo. One frame has to carry the name.",
  },
  {
    id: "app",
    label: "App",
    title: "The product, in a hand.",
    text: "A clinic that books, a pharmacy nearby, a nurse at home, and a field team that checks in.",
  },
  {
    id: "site",
    label: "Site",
    title: "The site that takes the next step.",
    text: "Gogi seats the table. Cozmatics sells the ritual. Joury carries the wardrobe.",
  },
] as const;

const posters = [
  {
    src: "/work/archive/rise-tower/01.webp",
    title: "Rise Tower",
    line: "The tower, and the offer",
    href: "/work/rise-tower",
  },
  {
    src: "/work/archive/new-era/01.webp",
    title: "New Era",
    line: "Real estate, through a new lens",
    href: "/work/new-era",
  },
  {
    src: "/work/archive/glory/01.webp",
    title: "Glory",
    line: "A new future, built today",
    href: "/work/glory",
  },
  {
    src: "/work/archive/aqar-expo/01.webp",
    title: "Aqar Expo",
    line: "The choice, before the investment",
    href: "/work/aqar-expo",
  },
] as const;

const screens = [
  { src: "/work/pitch/clinic-home.webp", title: "Clinic", line: "Doctor, pharmacy, nurse, lab" },
  { src: "/work/pitch/clinic-doctor.webp", title: "Book a doctor", line: "Specialty, fee, and a slot" },
  { src: "/work/pitch/clinic-nurse.webp", title: "Home nursing", line: "A visit, booked from the phone" },
  { src: "/work/pitch/clinic-pharmacy.webp", title: "Pharmacy", line: "The nearest counter, and the offer" },
  { src: "/work/pitch/clinic-ai.webp", title: "Medical assistant", line: "Symptoms in, a next step out" },
] as const;

const sites = [
  {
    id: "gogi",
    title: "Gogi",
    href: "https://gogi-eight.vercel.app/",
    label: "gogi-eight.vercel.app",
  },
  {
    id: "cozmatics",
    title: "Cozmatics",
    href: "https://cozmatics-luxury-beauty.vercel.app/",
    label: "cozmatics-luxury-beauty.vercel.app",
  },
  {
    id: "joury",
    title: "Joury",
    href: "/work/pitch/joury.webp",
    label: "Joury — modest fashion",
    image: "/work/pitch/joury.webp",
  },
] as const;

export function Reel() {
  const [chapter, setChapter] = useState(0);
  const [poster, setPoster] = useState(0);
  const [screen, setScreen] = useState(0);
  const [site, setSite] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sitesReady, setSitesReady] = useState(false);
  const active = chapters[chapter];

  // Once the sites chapter has been reached, keep it mounted. Adjusting state
  // during render is the supported pattern here; an effect would cause an
  // extra cascading render on every chapter change.
  if (chapter === 2 && !sitesReady) {
    setSitesReady(true);
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;

    const inner = window.setInterval(() => {
      if (chapter === 0) setPoster((current) => (current + 1) % posters.length);
      if (chapter === 1) setScreen((current) => (current + 1) % screens.length);
      if (chapter === 2) setSite((current) => (current + 1) % sites.length);
    }, chapter === 2 ? 5600 : 2600);

    const outer = window.setTimeout(() => {
      setChapter((current) => (current + 1) % chapters.length);
    }, 9800);

    return () => {
      window.clearInterval(inner);
      window.clearTimeout(outer);
    };
  }, [chapter, paused]);

  const names = ["Gogi", "Cozmatics", "Joury", "SANVIX", ...projects.map((project) => project.title)];

  return (
    <section className="stage" id="top">
      <div className="wrap stage-grid">
        <div className="stage-copy">
          <p className="eyebrow">
            <span>0{chapter + 1}</span> {active.label}
          </p>
          <h1>
            {active.title.replace(/\.$/, "")}
            <span className="period">.</span>
          </h1>
          <p className="lede">{active.text}</p>
          <div className="pitch-tabs" role="tablist" aria-label="What we ship">
            {chapters.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === chapter}
                onClick={() => setChapter(index)}
              >
                {item.label}
                {index === chapter ? <span className={`pitch-meter ${paused ? "is-paused" : ""}`} /> : null}
              </button>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button" href="#work">
              Enter the archive
            </a>
            <a className="text-link" href="#brief-reader">
              Match a brief
            </a>
          </div>
        </div>

        <div
          className="stage-frame pitch"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {chapter === 0 ? (
            <div className="deck" role="tablist" aria-label="Campaign posters">
              {posters.map((item, index) => {
                const shift = deckShift(index, poster, posters.length);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.title}
                    className={`deck-card ${index === poster ? "is-front" : ""}`}
                    data-shift={shift}
                    style={{ "--shift": String(shift) } as CSSProperties}
                    aria-current={index === poster ? "true" : undefined}
                    tabIndex={Math.abs(shift) > 1 ? -1 : undefined}
                  >
                    <Image src={item.src} alt={item.line} fill sizes="40vw" priority={index === 0} />
                  </Link>
                );
              })}
              <p className="pitch-caption">
                <strong>{posters[poster].title}</strong>
                <span>{posters[poster].line}</span>
              </p>
            </div>
          ) : null}

          {chapter === 1 ? (
            <div className="handset-scene">
              <Image
                className="handset-back"
                src="/work/pitch/sanvix.webp"
                alt=""
                fill
                sizes="46vw"
              />
              <div className="handset">
                <div className="handset-screen">
                  {screens.map((item, index) => (
                    <span key={item.src} className={`handset-shot ${index === screen ? "is-live" : ""}`}>
                      <Image src={item.src} alt={index === screen ? item.line : ""} fill sizes="240px" />
                    </span>
                  ))}
                </div>
              </div>
              <p className="pitch-caption pitch-caption-light">
                <strong>{screens[screen].title}</strong>
                <span>{screens[screen].line}</span>
              </p>
            </div>
          ) : null}

          {chapter === 2 ? (
            <div className="browser">
              <div className="browser-bar">
                <span className="browser-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <div className="browser-tabs" role="tablist" aria-label="Live sites">
                  {sites.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={index === site}
                      onClick={() => setSite(index)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="browser-view">
                {sites.map((item, index) =>
                  "image" in item && item.image ? (
                    <span key={item.id} className={`browser-pane ${index === site ? "is-live" : ""}`}>
                      <Image src={item.image} alt="Joury modest fashion site and identity" fill sizes="50vw" />
                    </span>
                  ) : sitesReady ? (
                    <iframe
                      key={item.id}
                      className={`browser-pane ${index === site ? "is-live" : ""}`}
                      src={item.href}
                      title={item.title}
                      tabIndex={index === site ? 0 : -1}
                    />
                  ) : null,
                )}
                {"image" in sites[site] ? null : (
                  <a className="browser-open" href={sites[site].href} target="_blank" rel="noreferrer">
                    Open {sites[site].title}
                  </a>
                )}
              </div>
              <p className="pitch-caption">
                <strong>{sites[site].title}</strong>
                <span>{sites[site].label}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...names, ...names].map((name, nameIndex) => (
            <span key={`${name}-${nameIndex}`}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function deckShift(index: number, current: number, total: number) {
  let shift = index - current;
  if (shift > total / 2) shift -= total;
  if (shift < -total / 2) shift += total;
  return shift;
}

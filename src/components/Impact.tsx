"use client";

import { useEffect, useRef, useState } from "react";
import { impact, recipe } from "@/lib/content";

export function Impact() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section section-tight" id="impact" ref={ref}>
      <div className="wrap">
        <p className="eyebrow">
          <span>03</span> The record
        </p>
        <ul className="impact">
          {impact.map((item) => (
            <li key={item.label}>
              <strong>
                <Count to={item.value} run={on} />
                {item.suffix}
              </strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <ol className="recipe">
          {recipe.map(({ step, title, text }) => (
            <li key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Count({ to, run }: { to: number; run: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const frame = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return <span className="count">{value}</span>;
}

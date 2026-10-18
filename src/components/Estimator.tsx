"use client";

import { useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import { quoteBands } from "@/lib/content";

const kinds = [
  { id: "identity", label: "Identity" },
  { id: "site", label: "Campaign" },
  { id: "system", label: "Social set" },
  { id: "app", label: "Full brand" },
] as const;

const sizes = [
  { id: "one", label: "One location" },
  { id: "multi", label: "More than one" },
] as const;

const fields = [
  { id: "clinic", label: "Automotive" },
  { id: "school", label: "Education" },
  { id: "shop", label: "Real estate" },
  { id: "food", label: "Hospitality" },
  { id: "other", label: "Another field" },
] as const;

type Kind = (typeof kinds)[number]["id"];
type Size = (typeof sizes)[number]["id"];
type Field = (typeof fields)[number]["id"];

export function Estimator() {
  const [field, setField] = useState<Field>("clinic");
  const [kind, setKind] = useState<Kind>("site");
  const [size, setSize] = useState<Size>("one");

  const [low, high] = quoteBands[kind][size];
  const summary = `Starting range: ${label(fields, field)} · ${label(kinds, kind)} · ${label(sizes, size)}. ${money(low)} to ${money(high)}.`;

  function book() {
    window.dispatchEvent(new CustomEvent("b2b-brief", { detail: summary }));
    document.getElementById("brief")?.focus();
  }

  return (
    <section className="section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">
            <span>05</span> 15 minutes
          </p>
          <h2>A starting range in one minute.</h2>
          <p className="deck">
            The range is a guide. The free call sets the number for your project.
          </p>
          <div className="config estimate">
            <Pick legend="Field" value={field} options={fields} onChange={setField} />
            <Pick legend="Need" value={kind} options={kinds} onChange={setKind} />
            <Pick legend="Size" value={size} options={sizes} onChange={setSize} />
          </div>
          <p className="quote" aria-live="polite">
            <span>From {money(low)}</span>
            <span>to {money(high)}</span>
          </p>
          <button className="button" type="button" onClick={book}>
            Free 15-minute consult
          </button>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function Pick<T extends string>({
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

function label(options: readonly { id: string; label: string }[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

function money(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { quoteBands } from "@/lib/content";
import { sound } from "@/lib/sound";

const fields = [
  { id: "auto", label: "Automotive" },
  { id: "education", label: "Education" },
  { id: "realestate", label: "Real estate" },
  { id: "places", label: "Places and hospitality" },
  { id: "occasion", label: "Occasions" },
] as const;

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

type Kind = (typeof kinds)[number]["id"];
type Size = (typeof sizes)[number]["id"];

export function EstimatorPanel() {
  const [field, setField] = useState<(typeof fields)[number]["id"]>("auto");
  const [kind, setKind] = useState<Kind>("site");
  const [size, setSize] = useState<Size>("one");
  const [low, high] = quoteBands[kind][size];
  const fieldLabel = fields.find((item) => item.id === field)?.label;
  const kindLabel = kinds.find((item) => item.id === kind)?.label;
  const sizeLabel = sizes.find((item) => item.id === size)?.label;

  function book() {
    const summary = `Starting range: ${fieldLabel} · ${kindLabel} · ${sizeLabel}. ${money(low)} to ${money(high)}.`;
    window.dispatchEvent(new CustomEvent("b2b-brief", { detail: summary }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    sound.playSuccess();
  }

  return (
    <section id="estimator" className="mx-auto max-w-7xl border-t border-[var(--line-soft)] band px-4 sm:px-6 lg:px-8">
      <div data-flow className="rounded-3xl border border-[var(--brand-line)] bg-gradient-to-b from-[#100809] via-[#0c0c10] to-[#070709] p-5 shadow-[0_20px_60px_var(--brand-glow)] sm:p-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--brand-soft)] px-3 py-1 text-xs text-[var(--brand)]">
            <Calculator className="h-3.5 w-3.5" />
            PROJECT RANGE
          </div>
          <h2 className="font-brand text-3xl font-black text-white md:text-4xl">
            A starting range for <span className="text-[var(--brand)]">the next job</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">The range is a guide. The free call sets the number.</p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Picker legend="1. Field" value={field} options={fields} onChange={setField} />
            <Picker legend="2. What you need" value={kind} options={kinds} onChange={setKind} />
            <Picker legend="3. Size" value={size} options={sizes} onChange={setSize} />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-6 lg:col-span-5">
            <p className="text-xs tracking-wider text-zinc-500 uppercase">Starting range</p>
            <p className="font-brand mt-3 text-3xl font-black text-white sm:text-4xl" aria-live="polite">
              {money(low)}
              <span className="mt-1 block text-xl text-[var(--brand)] sm:text-2xl">to {money(high)}</span>
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              {fieldLabel} · {kindLabel} · {sizeLabel}
            </p>
            <button
              type="button"
              onClick={book}
              className="mt-6 w-full rounded-xl bg-[var(--brand)] py-3 text-sm font-bold text-[var(--brand-contrast)] shadow-[0_0_20px_var(--brand-glow)] hover:bg-[var(--brand)]"
            >
              Put this range in the brief
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Picker<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs tracking-wider text-zinc-400 uppercase">{legend}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => {
              onChange(option.id);
              sound.playClick();
            }}
            className={`rounded-xl border px-3 py-3 text-left text-sm ${
              value === option.id ? "border-[var(--brand)] bg-[var(--brand-soft)] font-bold text-white" : "border-zinc-800 bg-zinc-900/80 text-zinc-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

/* Presentational primitives for the dashboard. Keeping every control in one
   place is what stops ten tabs drifting into ten different-looking forms. */

export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag
      className={`rounded-[14px] border border-[var(--ad-line)] bg-[var(--ad-panel)]/80 ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Title bar inside a panel — a hairline rule and a mono caption. */
export function PanelHead({
  title,
  caption,
  icon: Icon,
  action,
}: {
  title: string;
  caption?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--ad-line-soft)] px-5 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--ad-accent)]" />}
          <h3 className="truncate text-[13px] font-semibold text-[var(--ad-ink)]">{title}</h3>
        </div>
        {caption && <p className="mt-0.5 text-[11.5px] text-[var(--ad-ink-faint)]">{caption}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** The large editorial heading that opens each tab. */
export function TabHead({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-[var(--ad-line-soft)] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <p className="ad-micro">{eyebrow}</p>
        <h2 className="ad-display mt-2.5 text-[30px] text-[var(--ad-ink)] sm:text-[38px]">{title}</h2>
        {lede && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--ad-ink-dim)]">{lede}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11.5px] font-medium text-[var(--ad-ink-dim)]"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] leading-snug text-[var(--ad-ink-ghost)]">{hint}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean };

export function Input({ mono, className = "", ...props }: InputProps) {
  return <input className={`ad-field ${mono ? "ad-mono text-[11.5px]" : ""} ${className}`} {...props} />;
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className = "", ...props }: TextAreaProps) {
  return <textarea className={`ad-field ${className}`} {...props} />;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select className={`ad-field ${className}`} {...props}>
      {children}
    </select>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ad-accent)] text-[var(--ad-accent-contrast)] hover:brightness-110 border border-transparent shadow-[0_1px_0_rgba(255,255,255,0.14)_inset]",
  secondary:
    "bg-[var(--ad-raised)] text-[var(--ad-ink)] border border-[var(--ad-line)] hover:border-[var(--ad-line-strong)] hover:bg-white/[0.06]",
  ghost:
    "bg-transparent text-[var(--ad-ink-dim)] border border-transparent hover:text-[var(--ad-ink)] hover:bg-white/[0.05]",
  danger:
    "bg-transparent text-[#f87171] border border-[#f87171]/35 hover:bg-[#f87171]/10 hover:border-[#f87171]/60",
};

export function Button({
  variant = "secondary",
  icon: Icon,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: LucideIcon;
}) {
  return (
    <button
      className={`ad-focusable inline-flex items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12px] font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

/** Accessible switch. The native checkbox stays, so keyboard and labels work. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="ad-focusable relative h-[22px] w-[38px] shrink-0 rounded-full border transition-colors"
      style={{
        backgroundColor: checked ? "var(--ad-accent)" : "var(--ad-raised)",
        borderColor: checked ? "transparent" : "var(--ad-line-strong)",
      }}
    >
      <span
        className="absolute top-1/2 block h-[16px] w-[16px] -translate-y-1/2 rounded-full bg-white transition-all duration-200"
        style={{ left: checked ? "19px" : "3px" }}
      />
    </button>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "ok" | "muted";
}) {
  const tones = {
    neutral: "border-[var(--ad-line)] text-[var(--ad-ink-dim)] bg-white/[0.03]",
    accent: "border-[var(--ad-accent-line)] text-[var(--ad-accent)] bg-[var(--ad-accent-soft)]",
    ok: "border-[var(--ad-ok)]/35 text-[var(--ad-ok)] bg-[var(--ad-ok)]/10",
    muted: "border-[var(--ad-line-soft)] text-[var(--ad-ink-ghost)] bg-transparent",
  };
  return (
    <span
      className={`ad-mono inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px] uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--ad-line)] px-6 py-14 text-center">
      <Icon className="h-6 w-6 text-[var(--ad-ink-ghost)]" />
      <p className="mt-3.5 text-[13px] font-medium text-[var(--ad-ink)]">{title}</p>
      <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[var(--ad-ink-faint)]">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Keyboard hint, e.g. ⌘S next to the save button. */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ad-mono rounded-[5px] border border-[var(--ad-line)] bg-[var(--ad-void)] px-1.5 py-0.5 text-[9.5px] text-[var(--ad-ink-faint)]">
      {children}
    </kbd>
  );
}

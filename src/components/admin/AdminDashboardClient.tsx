"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SmartImage } from "@/components/SmartImage";
import { adminFontVars } from "@/app/admin/fonts";
import {
  Type,
  Layout,
  SlidersHorizontal,
  FolderKanban,
  Wrench,
  Film,
  Building,
  Upload,
  Save,
  RotateCcw,
  LogOut,
  ExternalLink,
  Trash2,
  Plus,
  Copy,
  Palette,
  Sparkles,
  Search,
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  FileJson,
  Undo2,
} from "lucide-react";
import type { SiteConfig, ProjectConfig, ClientMarkConfig } from "@/types/config";
import {
  Button,
  EmptyState,
  Field,
  Input,
  Kbd,
  Panel,
  PanelHead,
  Select,
  Tag,
  TabHead,
  TextArea,
  Toggle,
} from "./ui";

const BRAND_FONTS = [
  { id: "Playfair Display", name: "Playfair Display — classic, elegant (default)" },
  { id: "Cairo", name: "Cairo — premium bilingual" },
  { id: "Tajawal", name: "Tajawal — modern, balanced" },
  { id: "Almarai", name: "Almarai — elegant, smooth" },
  { id: "Outfit", name: "Outfit — ultra-modern digital" },
  { id: "Montserrat", name: "Montserrat — strong geometric" },
  { id: "Syne", name: "Syne — bold, creative" },
  { id: "Amiri", name: "Amiri — classic Arabic serif" },
];

const BODY_FONTS = [
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans — universal (default)" },
  { id: "Cairo", name: "Cairo — excellent for reading" },
  { id: "Almarai", name: "Almarai — smooth and fluid" },
  { id: "Tajawal", name: "Tajawal — modern and clear" },
  { id: "Inter", name: "Inter — technical standard" },
  { id: "Roboto", name: "Roboto — practical, versatile" },
];

const COLOR_PRESETS = [
  { name: "B2B Signature Red", hex: "#E50914", bg: "#070709" },
  { name: "Luxury Gold", hex: "#D97706", bg: "#080705" },
  { name: "Cyber Neon Blue", hex: "#2563EB", bg: "#05070e" },
  { name: "Emerald Studio", hex: "#059669", bg: "#040906" },
  { name: "Royal Purple", hex: "#7C3AED", bg: "#07050d" },
  { name: "Crimson Rose", hex: "#E11D48", bg: "#090406" },
];

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];

function isVideoUrl(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

/** Expand #abc / #aabbcc into rgba(), for the accent tint variables. */
function hexToRgba(hex: string, alpha: number): string {
  let value = (hex || "").trim().replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return `rgba(229, 9, 20, ${alpha})`;
  const int = parseInt(value, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

type TabId =
  | "typography"
  | "sections"
  | "headerFooter"
  | "hero"
  | "projects"
  | "services"
  | "brandsReels"
  | "agencyAbout"
  | "media"
  | "backup";

/**
 * Text input for a comma-separated list.
 *
 * Keeps the raw text the user is typing in local state, because parsing
 * straight back into `value.join(", ")` on every keystroke swallows the comma
 * the moment it is typed (`"a," -> ["a"] -> "a"`), making a second item
 * impossible to enter. The parsed array is still committed on every change;
 * the draft is dropped on blur so the field re-syncs to the canonical value.
 */
function CommaListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <Input
      value={draft ?? value.join(", ")}
      placeholder={placeholder}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean));
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

/* Ten tabs grouped into four labelled clusters: a flat list of ten gives the
   client no map of what the product actually contains. */
const NAV_GROUPS: { label: string; items: { id: TabId; label: string; icon: typeof Type }[] }[] = [
  {
    label: "Appearance",
    items: [{ id: "typography", label: "Fonts & Theme", icon: Type }],
  },
  {
    label: "Structure",
    items: [
      { id: "sections", label: "Sections", icon: Layout },
      { id: "headerFooter", label: "Header & Footer", icon: SlidersHorizontal },
      { id: "hero", label: "Hero Stage", icon: Sparkles },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "services", label: "Services", icon: Wrench },
      { id: "brandsReels", label: "Clients & Reels", icon: Film },
      { id: "agencyAbout", label: "About & Contact", icon: Building },
    ],
  },
  {
    label: "System",
    items: [
      { id: "media", label: "Media Library", icon: Upload },
      { id: "backup", label: "Backup & Reset", icon: RotateCcw },
    ],
  },
];

/** The bundled brand wordmark, mirroring `defaultConfig`. Kept as a literal so
 *  the admin bundle does not have to carry a second copy of the whole config. */
const DEFAULT_LOGO = "/brand/wordmark.png";

/**
 * Logo picker with two separate ways back.
 *
 * "Undo change" returns to the last published value, for when an upload was a
 * mistake. "Use original" returns to the bundled brand wordmark. They are
 * different destinations, so both are offered rather than one ambiguous reset.
 */
function LogoField({
  label,
  hint,
  value,
  savedValue,
  onChange,
  onUpload,
  previewHeight = "h-7",
}: {
  label: string;
  hint?: string;
  value: string;
  savedValue: string;
  onChange: (next: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewHeight?: string;
}) {
  const isDefault = value === DEFAULT_LOGO;
  const isUnsaved = value !== savedValue;

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <Input mono value={value} onChange={(e) => onChange(e.target.value)} dir="ltr" aria-label={label} />
        <label className="ad-focusable inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[var(--ad-line)] bg-[var(--ad-raised)] px-3 text-[12px] font-medium text-[var(--ad-ink)] transition hover:border-[var(--ad-line-strong)]">
          <Upload className="h-3.5 w-3.5" />
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <Tag tone={isUnsaved ? "accent" : isDefault ? "muted" : "neutral"}>
          {isUnsaved ? "Unsaved" : isDefault ? "Original" : "Custom"}
        </Tag>

        {isUnsaved && (
          <button
            type="button"
            onClick={() => onChange(savedValue)}
            className="ad-focusable inline-flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-[11px] text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
          >
            <Undo2 className="h-3 w-3" />
            Undo change
          </button>
        )}

        {!isDefault && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_LOGO)}
            className="ad-focusable inline-flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-[11px] text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
          >
            <RotateCcw className="h-3 w-3" />
            Use original
          </button>
        )}
      </div>

      {value && (
        <div className="mt-2.5 inline-block rounded-[8px] border border-[var(--ad-line-soft)] bg-[var(--ad-void)] px-3 py-2">
          <SmartImage
            src={value}
            alt={`${label} preview`}
            width={792}
            height={398}
            autoAxis="width"
            className={`${previewHeight} w-auto`}
          />
        </div>
      )}
    </Field>
  );
}

interface Props {
  initialConfig: SiteConfig;
  userEmail: string;
}

export function AdminDashboardClient({ initialConfig, userEmail }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  /* The last state known to be on disk. Everything about "unsaved changes" is
     derived by comparing against this. */
  const [savedConfig, setSavedConfig] = useState<SiteConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabId>("typography");

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(null);
  // The slug the project had when the modal was opened. The slug itself is
  // editable, so this is what we match on when writing the edit back.
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(savedConfig),
    [config, savedConfig]
  );

  /* The dashboard wears the brand it is editing: the accent is read live from
     the client's own saved colour rather than hard-coded. */
  const accent = config.typography?.primaryColor || "#E50914";
  const accentVars = {
    "--ad-accent": accent,
    "--ad-accent-soft": hexToRgba(accent, 0.14),
    "--ad-accent-line": hexToRgba(accent, 0.42),
  } as React.CSSProperties;

  const notify = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  /* Publishes a save to any other open tab, so the public site refreshes
     without a manual reload. */
  const notifySiteTabs = () => {
    try {
      if (typeof window !== "undefined") {
        if ("BroadcastChannel" in window) {
          const ch = new BroadcastChannel("b2b_site_sync");
          ch.postMessage({ type: "CONFIG_UPDATED", time: Date.now() });
          ch.close();
        }
        localStorage.setItem("b2b_config_updated_at", Date.now().toString());
      }
    } catch (e) {
      console.warn("Cross-tab sync error:", e);
    }
  };

  const openProjectEditor = (project: ProjectConfig) => {
    setSelectedProject(project);
    setEditingSlug(project.slug);
    setIsEditingProject(true);
  };

  const closeProjectEditor = useCallback(() => {
    setIsEditingProject(false);
    setSelectedProject(null);
    setEditingSlug(null);
  }, []);

  // Keep the page behind the editor still, and let Escape close it.
  useEffect(() => {
    if (!isEditingProject) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProjectEditor();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isEditingProject, closeProjectEditor]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        notify("error", data.error || "Failed to save changes");
      } else {
        setConfig(data.config);
        setSavedConfig(data.config);
        // The layout renders from the saved config, so refresh the server
        // components to match what was just written.
        router.refresh();
        notifySiteTabs();
        notify("success", "All changes saved — the live site is updated.");
      }
    } catch {
      notify("error", "A server error occurred while saving changes");
    } finally {
      setSaving(false);
    }
  }, [config, router]);

  /* Save on Cmd/Ctrl+S, and warn before leaving with unsaved edits — without
     this a long editing session is lost to a stray tab close. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (isDirty && !saving) void handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDirty, saving, handleSave]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const handleReset = async () => {
    if (!window.confirm("Restore the original default settings for this portfolio?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.config);
        setSavedConfig(data.config);
        router.refresh();
        notifySiteTabs();
        notify("success", "Original settings have been restored");
      } else {
        notify("error", data.error || "Restore operation failed");
      }
    } catch {
      notify("error", "Server error during restore");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (isDirty && !window.confirm("You have unsaved changes. Log out and discard them?")) {
      return;
    }
    await fetch("/api/auth/logout", { method: "POST" });
    // Refresh so the server re-reads the (now cleared) session cookie.
    router.replace("/admin/login");
    router.refresh();
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());

      // Only accept something that actually looks like a site config, so a
      // wrong file can't wipe the dashboard into a blank state.
      const required = ["typography", "header", "sections", "agency", "footer"];
      const missing = required.filter((key) => !parsed || typeof parsed[key] !== "object");
      if (missing.length > 0) {
        notify("error", `Not a valid backup file (missing: ${missing.join(", ")})`);
        return;
      }

      if (
        !window.confirm(
          "Replace all current settings with this backup? Nothing is published until you press Save."
        )
      ) {
        return;
      }

      setConfig((prev) => ({ ...prev, ...parsed }));
      notify("success", "Backup loaded — review it, then press Save changes");
    } catch {
      notify("error", "Could not read that file. Please choose a valid JSON backup.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback?: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFiles((prev) => [{ url: data.url, name: file.name }, ...prev]);
        notify("success", "File uploaded successfully");
        if (callback) {
          callback(data.url);
        }
      } else {
        notify("error", data.error || "File upload failed");
      }
    } catch {
      notify("error", "An error occurred while uploading the file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Helper updates
  const updateTypography = (key: keyof SiteConfig["typography"], value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: value },
    }));
  };

  const updateHeader = (key: keyof SiteConfig["header"], value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      header: { ...prev.header, [key]: value },
    }));
  };

  const updateSection = (sec: keyof SiteConfig["sections"], key: string, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sec]: {
          ...prev.sections[sec],
          [key]: value,
        },
      },
    }));
  };

  const updateAgency = (key: keyof SiteConfig["agency"], value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      agency: { ...prev.agency, [key]: value },
    }));
  };

  const updateFooter = (key: keyof SiteConfig["footer"], value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, [key]: value },
    }));
  };

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return config.projects;
    return config.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.arabic.includes(projectSearch.trim()) ||
        p.sector.toLowerCase().includes(q)
    );
  }, [config.projects, projectSearch]);

  const counts: Partial<Record<TabId, number>> = {
    projects: config.projects.length,
    services: config.studioServices.length,
    brandsReels: config.marks.length,
  };

  return (
    <div className="ad-root ad-atmos min-h-screen" style={accentVars}>
      {/* ----------------------------- Top bar ----------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--ad-line)] bg-[var(--ad-base)]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <Link href="/" target="_blank" className="ad-focusable shrink-0 transition hover:opacity-80">
              <SmartImage
                src={config.header.logoUrl || "/brand/wordmark.png"}
                alt="B2B."
                width={792}
                height={398}
                autoAxis="width"
                priority
                className="h-7 w-auto"
              />
            </Link>
            <span className="h-7 w-px bg-[var(--ad-line)]" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight text-[var(--ad-ink)]">
                Portfolio Control
              </p>
              <p className="ad-mono truncate text-[10.5px] leading-tight text-[var(--ad-ink-faint)]" dir="ltr">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live save state, so the client can always tell whether the site
                reflects what is on screen. */}
            <span className="hidden items-center gap-1.5 pr-1 md:inline-flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isDirty ? "ad-pulse" : ""}`}
                style={{ background: isDirty ? "var(--ad-warn)" : "var(--ad-ok)" }}
              />
              <span className="ad-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ad-ink-faint)]">
                {isDirty ? "Unsaved" : "Published"}
              </span>
            </span>

            <Link
              href="/"
              target="_blank"
              className="ad-focusable hidden items-center gap-1.5 rounded-[10px] border border-[var(--ad-line)] bg-[var(--ad-raised)] px-3 py-2 text-[12px] font-medium text-[var(--ad-ink-dim)] transition hover:border-[var(--ad-line-strong)] hover:text-[var(--ad-ink)] sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || !isDirty}
              icon={saving ? undefined : Save}
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span className="whitespace-nowrap">Saving</span>
                </>
              ) : (
                <>
                  <span className="whitespace-nowrap">
                    Save<span className="hidden sm:inline"> changes</span>
                  </span>
                  <span className="ml-1 hidden lg:inline">
                    <Kbd>⌘S</Kbd>
                  </span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="ad-focusable rounded-[10px] border border-[var(--ad-line)] bg-[var(--ad-raised)] p-2 text-[var(--ad-ink-faint)] transition hover:border-[var(--ad-line-strong)] hover:text-[var(--ad-ink)]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8">
        {/* --------------------------- Nav rail --------------------------- */}
        <aside className="w-full shrink-0 lg:w-[232px]">
          <nav
            aria-label="Dashboard sections"
            className="ad-scroll sticky top-[76px] -mx-1 flex gap-5 overflow-x-auto px-1 pb-2 lg:mx-0 lg:block lg:space-y-5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="shrink-0">
                <p className="ad-micro mb-1.5 hidden px-3 lg:block">{group.label}</p>
                <div className="flex gap-1 lg:block lg:space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    const count = counts[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-active={active}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setActiveTab(item.id)}
                        className="ad-nav-item ad-focusable shrink-0 whitespace-nowrap"
                      >
                        <Icon
                          className="h-[15px] w-[15px] shrink-0"
                          style={{ color: active ? "var(--ad-accent)" : "var(--ad-ink-ghost)" }}
                        />
                        <span className="flex-1 text-[12.5px] font-medium">{item.label}</span>
                        {count !== undefined && (
                          <span className="ad-mono text-[10px] text-[var(--ad-ink-ghost)]">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* ------------------------- Work surface ------------------------- */}
        <main className="min-w-0 flex-1 pb-20">
          {/* ---------------- TAB 1: TYPOGRAPHY & THEME ---------------- */}
          {activeTab === "typography" && (
            <div key="typography" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Appearance"
                title="Fonts, scale & brand colour"
                lede="Set the heading and body typefaces, the base reading size, and the brand palette. Every page of the portfolio follows these."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Panel>
                  <PanelHead title="Heading & brand typeface" icon={Type} caption="Titles and the wordmark" />
                  <div className="space-y-4 p-5">
                    <Select
                      value={config.typography.brandFont}
                      onChange={(e) => updateTypography("brandFont", e.target.value)}
                      aria-label="Heading font"
                    >
                      {BRAND_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </Select>
                    <div className="rounded-[10px] border border-[var(--ad-line-soft)] bg-[var(--ad-void)] px-4 py-5">
                      <p className="ad-micro mb-2.5">Preview</p>
                      <p
                        className="text-[22px] leading-tight text-[var(--ad-ink)]"
                        style={{ fontFamily: `"${config.typography.brandFont}", serif` }}
                      >
                        Work that holds the frame
                      </p>
                      <p
                        className="mt-1 text-[15px]"
                        style={{ fontFamily: `"${config.typography.brandFont}", serif`, color: accent }}
                      >
                        Identity, campaigns & film
                      </p>
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <PanelHead title="Body typeface" icon={Type} caption="Paragraphs and interface text" />
                  <div className="space-y-4 p-5">
                    <Select
                      value={config.typography.bodyFont}
                      onChange={(e) => updateTypography("bodyFont", e.target.value)}
                      aria-label="Body font"
                    >
                      {BODY_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </Select>
                    <div className="rounded-[10px] border border-[var(--ad-line-soft)] bg-[var(--ad-void)] px-4 py-5">
                      <p className="ad-micro mb-2.5">Preview</p>
                      <p
                        className="text-[13px] leading-relaxed text-[var(--ad-ink-dim)]"
                        style={{ fontFamily: `"${config.typography.bodyFont}", sans-serif` }}
                      >
                        B2B. Studio — specialists in visual identity, advertising campaigns and
                        AI-powered solutions for leading projects across the Middle East.
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>

              <Panel>
                <PanelHead title="Reading scale" icon={SlidersHorizontal} caption="Base size and heading emphasis" />
                <div className="grid gap-7 p-5 sm:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-[12px] font-medium text-[var(--ad-ink-dim)]">Base text size</span>
                      <span className="ad-mono text-[12px]" style={{ color: accent }}>
                        {config.typography.baseFontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="13"
                      max="22"
                      step="1"
                      aria-label="Base font size"
                      value={config.typography.baseFontSize}
                      onChange={(e) => updateTypography("baseFontSize", Number(e.target.value))}
                      className="ad-range"
                    />
                    <div className="ad-mono mt-2 flex justify-between text-[9.5px] text-[var(--ad-ink-ghost)]">
                      <span>13 — compact</span>
                      <span>16 — default</span>
                      <span>22 — large</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-[12px] font-medium text-[var(--ad-ink-dim)]">Heading scale</span>
                      <span className="ad-mono text-[12px]" style={{ color: accent }}>
                        ×{config.typography.headingScale}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.05"
                      aria-label="Heading scale"
                      value={config.typography.headingScale}
                      onChange={(e) => updateTypography("headingScale", Number(e.target.value))}
                      className="ad-range"
                    />
                    <div className="ad-mono mt-2 flex justify-between text-[9.5px] text-[var(--ad-ink-ghost)]">
                      <span>0.8 — modest</span>
                      <span>1.0 — standard</span>
                      <span>1.4 — bold</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHead title="Brand palette" icon={Palette} caption="One accent carries the whole site" />
                <div className="space-y-6 p-5">
                  <div>
                    <p className="ad-micro mb-2.5">Presets</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {COLOR_PRESETS.map((preset) => {
                        const selected =
                          config.typography.primaryColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              updateTypography("primaryColor", preset.hex);
                              updateTypography("primaryGlow", `${preset.hex}66`);
                              updateTypography("backgroundColor", preset.bg);
                            }}
                            aria-pressed={selected}
                            className="ad-focusable flex items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left transition"
                            style={{
                              borderColor: selected ? preset.hex : "var(--ad-line)",
                              background: selected ? hexToRgba(preset.hex, 0.1) : "var(--ad-raised)",
                            }}
                          >
                            <span
                              className="h-5 w-5 shrink-0 rounded-full border border-white/15"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[11.5px] font-medium text-[var(--ad-ink)]">
                                {preset.name}
                              </span>
                              <span className="ad-mono block text-[9.5px] uppercase text-[var(--ad-ink-ghost)]">
                                {preset.hex}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 border-t border-[var(--ad-line-soft)] pt-5 sm:grid-cols-3">
                    {([
                      ["Accent", "primaryColor"],
                      ["Background", "backgroundColor"],
                      ["Text", "textColor"],
                    ] as const).map(([label, key]) => (
                      <Field key={key} label={label}>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            aria-label={`${label} colour picker`}
                            value={config.typography[key]}
                            onChange={(e) => updateTypography(key, e.target.value)}
                            className="ad-focusable h-9 w-9 shrink-0 cursor-pointer rounded-[8px] border border-[var(--ad-line)] bg-[var(--ad-input)] p-1"
                          />
                          <Input
                            mono
                            value={config.typography[key]}
                            onChange={(e) => updateTypography(key, e.target.value)}
                            dir="ltr"
                            className="uppercase"
                            aria-label={`${label} hex value`}
                          />
                        </div>
                      </Field>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {/* ---------------- TAB 2: SECTIONS ---------------- */}
          {activeTab === "sections" && (
            <div key="sections" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Structure"
                title="Page sections"
                lede="Turn any section of the portfolio on or off, and rewrite the label, title and highlighted word that introduce it."
              />

              <div className="ad-stagger grid gap-3">
                {/* `titleKey` and `hasHighlight` describe the shape each section
                    actually has. The hero stores its title as `titleLead`, and
                    the contact section has no highlighted word — rendering a
                    plain "title"/"titleHighlight" box for those showed an empty
                    field that wrote a key nothing on the site reads. */}
                {([
                  { key: "hero", label: "Hero stage", desc: "Main headline, logo and animated keywords", titleKey: "titleLead", hasHighlight: true },
                  { key: "showroom3d", label: "Interactive 3D showroom", desc: "Projects shown in a three-dimensional space", titleKey: "title", hasHighlight: true },
                  { key: "portfolio", label: "Portfolio archive", desc: "Full archive with sector and style filters", titleKey: "title", hasHighlight: true },
                  { key: "dataStats", label: "Data & KPI stats", desc: "Years of work, projects delivered, sector ratios", titleKey: "title", hasHighlight: true },
                  { key: "services", label: "Services & deliverables", desc: "Service packages and what each includes", titleKey: "title", hasHighlight: true },
                  { key: "studioBoards", label: "Client logos & house reel", desc: "Partner logo strip and production videos", titleKey: "title", hasHighlight: true },
                  { key: "about", label: "About & why us", desc: "Vision, mission and studio differentiators", titleKey: "title", hasHighlight: true },
                  { key: "contact", label: "Contact & consult", desc: "Brief form and cost estimator", titleKey: "title", hasHighlight: false },
                ] as const).map((sec, i) => {
                  const secData = config.sections[sec.key as keyof SiteConfig["sections"]];
                  return (
                    <Panel key={sec.key} className={secData.visible ? "" : "opacity-60"}>
                      <div className="flex items-start justify-between gap-4 border-b border-[var(--ad-line-soft)] px-5 py-3.5">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="ad-mono mt-[3px] text-[10px] text-[var(--ad-ink-ghost)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[13px] font-semibold text-[var(--ad-ink)]">{sec.label}</h3>
                              <Tag tone={secData.visible ? "ok" : "muted"}>
                                {secData.visible ? "Live" : "Hidden"}
                              </Tag>
                            </div>
                            <p className="mt-0.5 text-[11.5px] text-[var(--ad-ink-faint)]">{sec.desc}</p>
                          </div>
                        </div>
                        <Toggle
                          checked={secData.visible}
                          label={`Show ${sec.label}`}
                          onChange={(next) =>
                            updateSection(sec.key as keyof SiteConfig["sections"], "visible", next)
                          }
                        />
                      </div>

                      <div
                        className={`grid gap-4 p-5 ${sec.hasHighlight ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
                      >
                        <Field label="Label">
                          <Input
                            value={secData.badgeText || ""}
                            onChange={(e) =>
                              updateSection(sec.key as keyof SiteConfig["sections"], "badgeText", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Title">
                          <Input
                            value={((secData as unknown as Record<string, string>)[sec.titleKey]) ?? ""}
                            onChange={(e) =>
                              updateSection(sec.key as keyof SiteConfig["sections"], sec.titleKey, e.target.value)
                            }
                          />
                        </Field>
                        {sec.hasHighlight && (
                          <Field label="Highlighted word">
                            <Input
                              value={"titleHighlight" in secData ? (secData.titleHighlight as string) : ""}
                              onChange={(e) =>
                                updateSection(sec.key as keyof SiteConfig["sections"], "titleHighlight", e.target.value)
                              }
                            />
                          </Field>
                        )}
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- TAB 3: HEADER & FOOTER ---------------- */}
          {activeTab === "headerFooter" && (
            <div key="headerFooter" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Structure"
                title="Header & footer"
                lede="The navigation bar at the top of every page, and the footer that closes it."
              />

              <Panel>
                <PanelHead title="Navigation bar" icon={SlidersHorizontal} />
                <div className="space-y-6 p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <LogoField
                      label="Logo image"
                      hint="Upload a file, or paste a path such as /brand/wordmark.png"
                      value={config.header.logoUrl}
                      savedValue={savedConfig.header.logoUrl}
                      onChange={(next) => updateHeader("logoUrl", next)}
                      onUpload={(e) => handleFileUpload(e, (url) => updateHeader("logoUrl", url))}
                    />

                    <Field label="WhatsApp button" hint="Appears at the right of the navigation bar">
                      <div className="flex items-center gap-2.5">
                        <Input
                          value={config.header.whatsappCta.label}
                          placeholder="Button text, e.g. WhatsApp"
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              header: {
                                ...prev.header,
                                whatsappCta: { ...prev.header.whatsappCta, label: e.target.value },
                              },
                            }))
                          }
                        />
                        <Toggle
                          checked={config.header.whatsappCta.show}
                          label="Show WhatsApp button"
                          onChange={(next) =>
                            setConfig((prev) => ({
                              ...prev,
                              header: {
                                ...prev.header,
                                whatsappCta: { ...prev.header.whatsappCta, show: next },
                              },
                            }))
                          }
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="border-t border-[var(--ad-line-soft)] pt-5">
                    <p className="ad-micro mb-2.5">Navigation links</p>
                    <div className="space-y-1.5">
                      {config.header.navLinks.map((link, idx) => (
                        <div
                          key={link.id || idx}
                          className="flex flex-wrap items-center gap-2 rounded-[10px] border border-[var(--ad-line-soft)] bg-[var(--ad-void)] p-2"
                        >
                          <Input
                            value={link.label}
                            aria-label={`Link ${idx + 1} label`}
                            onChange={(e) => {
                              const updated = config.header.navLinks.map((l, i) =>
                                i === idx ? { ...l, label: e.target.value } : l
                              );
                              updateHeader("navLinks", updated);
                            }}
                            // Inline width: `.ad-field` sets width:100% unlayered,
                            // which beats Tailwind's layered w-* utilities.
                            style={{ width: 150, flex: "0 0 auto" }}
                          />
                          <Input
                            mono
                            dir="ltr"
                            value={link.href}
                            aria-label={`Link ${idx + 1} destination`}
                            onChange={(e) => {
                              const updated = config.header.navLinks.map((l, i) =>
                                i === idx ? { ...l, href: e.target.value } : l
                              );
                              updateHeader("navLinks", updated);
                            }}
                            style={{ flex: "1 1 160px", minWidth: 0 }}
                          />
                          <Toggle
                            checked={link.visible}
                            label={`Show ${link.label}`}
                            onChange={() => {
                              const updated = config.header.navLinks.map((l, i) =>
                                i === idx ? { ...l, visible: !l.visible } : l
                              );
                              updateHeader("navLinks", updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHead title="Footer" icon={Layout} />
                <div className="space-y-5 p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <LogoField
                      label="Footer logo"
                      value={config.footer.logoUrl}
                      savedValue={savedConfig.footer.logoUrl}
                      onChange={(next) => updateFooter("logoUrl", next)}
                      onUpload={(e) => handleFileUpload(e, (url) => updateFooter("logoUrl", url))}
                      previewHeight="h-8"
                    />
                    <Field label="Copyright line">
                      <Input
                        value={config.footer.copyrightText}
                        onChange={(e) => updateFooter("copyrightText", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Footer description">
                    <TextArea
                      rows={2}
                      value={config.footer.description}
                      onChange={(e) => updateFooter("description", e.target.value)}
                    />
                  </Field>
                </div>
              </Panel>
            </div>
          )}

          {/* ---------------- TAB 4: HERO ---------------- */}
          {activeTab === "hero" && (
            <div key="hero" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Structure"
                title="Hero stage"
                lede="The first thing a visitor reads. Keep the headline short and let the rotating keywords carry the range of work."
              />

              <Panel>
                <PanelHead title="Headline" icon={Sparkles} />
                <div className="space-y-5 p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Badge text" hint="The small pill above the headline">
                      <Input
                        value={config.sections.hero.badgeText}
                        onChange={(e) => updateSection("hero", "badgeText", e.target.value)}
                      />
                    </Field>
                    <Field label="Headline lead">
                      <Input
                        value={config.sections.hero.titleLead}
                        onChange={(e) => updateSection("hero", "titleLead", e.target.value)}
                      />
                    </Field>
                    <Field label="Highlighted words" hint="Rendered in the brand accent colour">
                      <Input
                        value={config.sections.hero.titleHighlight}
                        onChange={(e) => updateSection("hero", "titleHighlight", e.target.value)}
                      />
                    </Field>
                    <Field label="Rotating keywords" hint="Separate with commas">
                      <CommaListInput
                        value={config.sections.hero.fields}
                        onChange={(next) => updateSection("hero", "fields", next)}
                        placeholder="Automotive, schools, places"
                      />
                    </Field>
                  </div>

                  <Field label="Description">
                    <TextArea
                      rows={3}
                      value={config.sections.hero.description}
                      onChange={(e) => updateSection("hero", "description", e.target.value)}
                    />
                  </Field>
                </div>
              </Panel>

              <Panel>
                <PanelHead title="Call-to-action buttons" icon={ExternalLink} />
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <Field label="Primary button">
                    <Input
                      value={config.sections.hero.btnShowroomText}
                      onChange={(e) => updateSection("hero", "btnShowroomText", e.target.value)}
                    />
                  </Field>
                  <Field label="Secondary button">
                    <Input
                      value={config.sections.hero.btnArchiveText}
                      onChange={(e) => updateSection("hero", "btnArchiveText", e.target.value)}
                    />
                  </Field>
                </div>
              </Panel>
            </div>
          )}

          {/* ---------------- TAB 5: PROJECTS ---------------- */}
          {activeTab === "projects" && (
            <div key="projects" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Content"
                title="Project archive"
                lede="Every case study in the portfolio. Open one to edit its story, sector and images."
                action={
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => {
                      const newProj: ProjectConfig = {
                        slug: `project-${Date.now()}`,
                        title: "New Project",
                        arabic: "New Project",
                        sector: "auto",
                        needs: ["campaign", "social"],
                        styles: ["bold", "modern"],
                        images: ["/brand/identity.jpg"],
                        alt: "New project description",
                        problem: "Describe the brand challenge or problem here",
                        solution: "The creative solution delivered by B2B",
                        keys: ["brand", "new"],
                      };
                      setConfig((prev) => ({ ...prev, projects: [newProj, ...prev.projects] }));
                      openProjectEditor(newProj);
                      notify("success", "New project created — ready to edit");
                    }}
                  >
                    Add project
                  </Button>
                }
              />

              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ad-ink-ghost)]" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search by name, sector or keyword…"
                  aria-label="Search projects"
                  className="ad-field ad-field-search"
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <span className="ad-mono text-[10px] text-[var(--ad-ink-ghost)]">
                    {filteredProjects.length}/{config.projects.length}
                  </span>
                  {projectSearch && (
                    <button
                      type="button"
                      onClick={() => setProjectSearch("")}
                      aria-label="Clear search"
                      className="ad-focusable rounded p-0.5 text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No projects match that search"
                  body={`Nothing in the archive matches “${projectSearch}”. Try a different name, sector or keyword.`}
                  action={
                    <Button onClick={() => setProjectSearch("")} icon={X}>
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project, index) => (
                    <article
                      key={project.slug || index}
                      className="group flex flex-col overflow-hidden rounded-[14px] border border-[var(--ad-line)] bg-[var(--ad-panel)]/80 transition hover:border-[var(--ad-line-strong)]"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--ad-void)]">
                        {project.images?.[0] ? (
                          <SmartImage
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            // Two grid rows can sit above the fold on a wide screen.
                            priority={index < 6}
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageOff className="h-5 w-5 text-[var(--ad-ink-ghost)]" />
                          </div>
                        )}
                        <span className="absolute left-2.5 top-2.5">
                          <Tag tone="neutral">{project.sector}</Tag>
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[13px] font-semibold leading-snug text-[var(--ad-ink)]">
                            {project.title}
                          </h3>
                          <span className="shrink-0 text-[12px] text-[var(--ad-ink-faint)]">{project.arabic}</span>
                        </div>
                        <p className="line-clamp-2 text-[11.5px] leading-relaxed text-[var(--ad-ink-faint)]">
                          {project.problem}
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--ad-line-soft)] pt-3">
                          <span className="ad-mono text-[10px] text-[var(--ad-ink-ghost)]">
                            {project.images?.length || 0} image{(project.images?.length || 0) === 1 ? "" : "s"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="secondary"
                              onClick={() => openProjectEditor(project)}
                              className="px-3 py-1.5"
                            >
                              Edit
                            </Button>
                            <button
                              type="button"
                              aria-label={`Delete ${project.title}`}
                              onClick={() => {
                                if (window.confirm(`Delete “${project.title}”? This cannot be undone.`)) {
                                  setConfig((prev) => ({
                                    ...prev,
                                    projects: prev.projects.filter((p) => p.slug !== project.slug),
                                  }));
                                  notify("success", "Project deleted");
                                }
                              }}
                              className="ad-focusable rounded-[8px] p-1.5 text-[var(--ad-ink-ghost)] transition hover:bg-[#f87171]/10 hover:text-[#f87171]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Project editor — portalled to <body>, because an ancestor panel
                  uses backdrop-blur, which makes it the containing block for
                  `position: fixed` and would otherwise trap the overlay. */}
              {isEditingProject && selectedProject && createPortal(
                <div
                  className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md"
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) closeProjectEditor();
                  }}
                >
                  {/* The portal target is <body>, outside the page's font-variable
                      scope, so the type system is re-declared here. */}
                  <div
                    className={`${adminFontVars} ad-root flex min-h-full items-start justify-center p-4`}
                    style={accentVars}
                  >
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-label={`Edit ${selectedProject.title}`}
                      className="ad-rise relative my-8 w-full max-w-2xl overflow-hidden rounded-[16px] border border-[var(--ad-line-strong)] bg-[var(--ad-panel)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-[var(--ad-line)] px-5 py-4">
                        <div className="min-w-0">
                          <p className="ad-micro">Editing project</p>
                          <h3 className="mt-1 truncate text-[15px] font-semibold text-[var(--ad-ink)]">
                            {selectedProject.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Kbd>Esc</Kbd>
                          <button
                            type="button"
                            onClick={closeProjectEditor}
                            aria-label="Close editor"
                            className="ad-focusable rounded-full border border-[var(--ad-line)] p-1.5 text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="ad-scroll max-h-[min(66vh,640px)] space-y-5 overflow-y-auto px-5 py-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Title (English)">
                            <Input
                              value={selectedProject.title}
                              onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                            />
                          </Field>
                          <Field label="Subtitle / Arabic name">
                            <Input
                              value={selectedProject.arabic}
                              onChange={(e) => setSelectedProject({ ...selectedProject, arabic: e.target.value })}
                            />
                          </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Slug" hint="The project's web address segment">
                            <Input
                              mono
                              dir="ltr"
                              value={selectedProject.slug}
                              onChange={(e) => setSelectedProject({ ...selectedProject, slug: e.target.value })}
                            />
                          </Field>
                          <Field label="Sector">
                            <Select
                              value={selectedProject.sector}
                              onChange={(e) => setSelectedProject({ ...selectedProject, sector: e.target.value })}
                            >
                              <option value="auto">Automotive</option>
                              <option value="education">Education</option>
                              <option value="realestate">Real estate</option>
                              <option value="places">Places & hospitality</option>
                            </Select>
                          </Field>
                        </div>

                        <Field label="The problem" hint="What the brand was struggling with">
                          <TextArea
                            rows={2}
                            value={selectedProject.problem}
                            onChange={(e) => setSelectedProject({ ...selectedProject, problem: e.target.value })}
                          />
                        </Field>

                        <Field label="The solution" hint="What the studio delivered">
                          <TextArea
                            rows={2}
                            value={selectedProject.solution}
                            onChange={(e) => setSelectedProject({ ...selectedProject, solution: e.target.value })}
                          />
                        </Field>

                        <div>
                          <div className="mb-2.5 flex items-center justify-between">
                            <p className="ad-micro">Images · {selectedProject.images.length}</p>
                            <label className="ad-focusable inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-[var(--ad-line)] bg-[var(--ad-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ad-ink)] transition hover:border-[var(--ad-line-strong)]">
                              <Upload className="h-3 w-3" />
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (url) => {
                                    setSelectedProject({
                                      ...selectedProject,
                                      images: [...selectedProject.images, url],
                                    });
                                  })
                                }
                              />
                            </label>
                          </div>

                          <div className="space-y-1.5">
                            {selectedProject.images.map((img, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[6px] border border-[var(--ad-line)] bg-[var(--ad-void)]">
                                  <SmartImage
                                    src={img}
                                    alt=""
                                    width={28}
                                    height={28}
                                    className="h-full w-full object-cover"
                                  />
                                </span>
                                <Input
                                  mono
                                  dir="ltr"
                                  value={img}
                                  aria-label={`Image ${i + 1} path`}
                                  onChange={(e) => {
                                    const updated = [...selectedProject.images];
                                    updated[i] = e.target.value;
                                    setSelectedProject({ ...selectedProject, images: updated });
                                  }}
                                />
                                <button
                                  type="button"
                                  aria-label={`Remove image ${i + 1}`}
                                  onClick={() => {
                                    setSelectedProject({
                                      ...selectedProject,
                                      images: selectedProject.images.filter((_, idx) => idx !== i),
                                    });
                                  }}
                                  className="ad-focusable shrink-0 rounded-[6px] p-1.5 text-[var(--ad-ink-ghost)] transition hover:bg-[#f87171]/10 hover:text-[#f87171]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProject({
                                  ...selectedProject,
                                  images: [...selectedProject.images, "/brand/identity.jpg"],
                                });
                              }}
                              className="ad-focusable mt-1 inline-flex items-center gap-1.5 rounded-[6px] px-1 py-1 text-[11.5px] text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
                            >
                              <Plus className="h-3 w-3" />
                              Add image path
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-[var(--ad-line)] bg-[var(--ad-void)]/60 px-5 py-3.5">
                        <Button variant="ghost" onClick={closeProjectEditor}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            const nextSlug = selectedProject.slug.trim();
                            if (!nextSlug) {
                              notify("error", "Slug cannot be empty");
                              return;
                            }
                            // Reject a slug that already belongs to a different project
                            const clashes = config.projects.some(
                              (p) => p.slug !== editingSlug && p.slug === nextSlug
                            );
                            if (clashes) {
                              notify("error", `Slug "${nextSlug}" is already used by another project`);
                              return;
                            }

                            const edited = { ...selectedProject, slug: nextSlug };
                            setConfig((prev) => ({
                              ...prev,
                              // Match on the slug the project had when the modal opened,
                              // so renaming the slug still writes back to the right project.
                              projects: prev.projects.map((p) => (p.slug === editingSlug ? edited : p)),
                            }));
                            notify("success", `Project “${edited.title}” updated`);
                            closeProjectEditor();
                          }}
                        >
                          Apply changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          )}

          {/* ---------------- TAB 6: SERVICES ---------------- */}
          {activeTab === "services" && (
            <div key="services" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Content"
                title="Services & deliverables"
                lede="The packages the studio sells, and exactly what each one includes."
              />

              <div className="ad-stagger grid gap-4 lg:grid-cols-2">
                {config.studioServices.map((service, idx) => (
                  <Panel key={idx}>
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--ad-line-soft)] px-5 py-3">
                      <span className="ad-mono text-[11px]" style={{ color: accent }}>
                        {service.index}
                      </span>
                      <Input
                        value={service.tag}
                        aria-label={`Service ${idx + 1} tag`}
                        onChange={(e) => {
                          setConfig((prev) => ({
                            ...prev,
                            studioServices: prev.studioServices.map((s, i) =>
                              i === idx ? { ...s, tag: e.target.value } : s
                            ),
                          }));
                        }}
                        className="ad-mono text-center text-[10px] uppercase"
                        style={{ width: 130, flex: "0 0 auto" }}
                      />
                    </div>
                    <div className="space-y-4 p-5">
                      <Field label="Service name">
                        <Input
                          value={service.title}
                          onChange={(e) => {
                            setConfig((prev) => ({
                              ...prev,
                              studioServices: prev.studioServices.map((s, i) =>
                                i === idx ? { ...s, title: e.target.value } : s
                              ),
                            }));
                          }}
                        />
                      </Field>
                      <Field label="Description">
                        <TextArea
                          rows={2}
                          value={service.text}
                          onChange={(e) => {
                            setConfig((prev) => ({
                              ...prev,
                              studioServices: prev.studioServices.map((s, i) =>
                                i === idx ? { ...s, text: e.target.value } : s
                              ),
                            }));
                          }}
                        />
                      </Field>
                      <Field label="Deliverables" hint="Separate with commas">
                        <CommaListInput
                          value={service.deliverables}
                          onChange={(next) => {
                            setConfig((prev) => ({
                              ...prev,
                              studioServices: prev.studioServices.map((s, i) =>
                                i === idx ? { ...s, deliverables: next } : s
                              ),
                            }));
                          }}
                        />
                      </Field>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- TAB 7: CLIENTS & REELS ---------------- */}
          {activeTab === "brandsReels" && (
            <div key="brandsReels" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Content"
                title="Clients & reels"
                lede="The partner logos that rotate through the studio carousel."
              />

              <Panel>
                <PanelHead
                  title="Client & partner logos"
                  icon={Film}
                  caption={`${config.marks.length} logos in the carousel`}
                  action={
                    <Button
                      icon={Plus}
                      onClick={() => {
                        const newMark: ClientMarkConfig = {
                          name: "Brand Partner",
                          src: "/brand/mark.png",
                        };
                        setConfig((prev) => ({ ...prev, marks: [...prev.marks, newMark] }));
                      }}
                    >
                      Add logo
                    </Button>
                  }
                />
                <div className="p-5">
                  {config.marks.length === 0 ? (
                    <EmptyState
                      icon={Film}
                      title="No client logos yet"
                      body="Add a partner logo and it will appear in the rotating carousel on the public site."
                    />
                  ) : (
                    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                      {config.marks.map((mark, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-[10px] border border-[var(--ad-line-soft)] bg-[var(--ad-void)] p-2.5"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[var(--ad-line-soft)] bg-[var(--ad-raised)] p-1">
                            <SmartImage
                              src={mark.src}
                              alt={mark.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-contain"
                            />
                          </span>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <Input
                              value={mark.name}
                              aria-label={`Logo ${idx + 1} name`}
                              onChange={(e) => {
                                setConfig((prev) => ({
                                  ...prev,
                                  marks: prev.marks.map((m, i) =>
                                    i === idx ? { ...m, name: e.target.value } : m
                                  ),
                                }));
                              }}
                            />
                            <Input
                              mono
                              dir="ltr"
                              value={mark.src}
                              aria-label={`Logo ${idx + 1} path`}
                              onChange={(e) => {
                                setConfig((prev) => ({
                                  ...prev,
                                  marks: prev.marks.map((m, i) =>
                                    i === idx ? { ...m, src: e.target.value } : m
                                  ),
                                }));
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${mark.name}`}
                            onClick={() => {
                              setConfig((prev) => ({
                                ...prev,
                                marks: prev.marks.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="ad-focusable shrink-0 self-start rounded-[6px] p-1.5 text-[var(--ad-ink-ghost)] transition hover:bg-[#f87171]/10 hover:text-[#f87171]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          )}

          {/* ---------------- TAB 8: ABOUT & CONTACT ---------------- */}
          {activeTab === "agencyAbout" && (
            <div key="agencyAbout" className="ad-rise space-y-7">
              <TabHead
                eyebrow="Content"
                title="Studio & contact"
                lede="Who the studio is, how to reach it, and the reasons a client should choose it."
              />

              <Panel>
                <PanelHead title="Identity" icon={Building} />
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <Field label="Studio name">
                    <Input value={config.agency.name} onChange={(e) => updateAgency("name", e.target.value)} />
                  </Field>
                  <Field label="Formerly known as">
                    <Input value={config.agency.former} onChange={(e) => updateAgency("former", e.target.value)} />
                  </Field>
                </div>
              </Panel>

              <Panel>
                <PanelHead title="Contact" icon={ExternalLink} caption="Links update automatically as you type" />
                <div className="space-y-5 p-5">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="Business email">
                      <Input
                        type="email"
                        mono
                        dir="ltr"
                        value={config.agency.email}
                        onChange={(e) => updateAgency("email", e.target.value)}
                      />
                    </Field>
                    <Field label="Phone">
                      <Input
                        mono
                        dir="ltr"
                        value={config.agency.phone}
                        onChange={(e) => {
                          updateAgency("phone", e.target.value);
                          updateAgency("phoneHref", `tel:${e.target.value.replace(/[^0-9+]/g, "")}`);
                        }}
                      />
                    </Field>
                    <Field label="WhatsApp">
                      <Input
                        mono
                        dir="ltr"
                        value={config.agency.whatsapp}
                        onChange={(e) => {
                          updateAgency("whatsapp", e.target.value);
                          updateAgency("whatsappHref", `https://wa.me/${e.target.value.replace(/[^0-9]/g, "")}`);
                        }}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 border-t border-[var(--ad-line-soft)] pt-5 sm:grid-cols-2">
                    <Field label="Facebook URL">
                      <Input
                        mono
                        dir="ltr"
                        value={config.agency.facebook}
                        onChange={(e) => updateAgency("facebook", e.target.value)}
                      />
                    </Field>
                    <Field label="Instagram URL">
                      <Input
                        mono
                        dir="ltr"
                        value={config.agency.instagram}
                        onChange={(e) => updateAgency("instagram", e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHead title="Vision & mission" icon={Sparkles} />
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <Field label="Vision">
                    <TextArea
                      rows={4}
                      value={config.agency.vision}
                      onChange={(e) => updateAgency("vision", e.target.value)}
                    />
                  </Field>
                  <Field label="Mission">
                    <TextArea
                      rows={4}
                      value={config.agency.mission}
                      onChange={(e) => updateAgency("mission", e.target.value)}
                    />
                  </Field>
                </div>
              </Panel>

              <Panel>
                <PanelHead
                  title="Why choose B2B."
                  icon={CheckCircle2}
                  caption={`${config.whyUs.length} differentiators shown on the About section`}
                />
                <div className="grid gap-2.5 p-5 sm:grid-cols-2">
                  {config.whyUs.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className="ad-mono w-5 shrink-0 text-right text-[10px] text-[var(--ad-ink-ghost)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <Input
                        value={item}
                        aria-label={`Differentiator ${idx + 1}`}
                        onChange={(e) => {
                          setConfig((prev) => ({
                            ...prev,
                            whyUs: prev.whyUs.map((w, i) => (i === idx ? e.target.value : w)),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {/* ---------------- TAB 9: MEDIA ---------------- */}
          {activeTab === "media" && (
            <div key="media" className="ad-rise space-y-7">
              <TabHead
                eyebrow="System"
                title="Media library"
                lede="Upload images and video from your device, then copy the path into any field across the dashboard."
              />

              <label
                className={`ad-focusable flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed px-6 py-14 text-center transition ${
                  uploading
                    ? "border-[var(--ad-accent-line)] bg-[var(--ad-accent-soft)]"
                    : "border-[var(--ad-line-strong)] bg-[var(--ad-panel)]/50 hover:border-[var(--ad-accent-line)] hover:bg-[var(--ad-accent-soft)]"
                }`}
              >
                {uploading ? (
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--ad-accent)]/30 border-t-[var(--ad-accent)]" />
                ) : (
                  <Upload className="h-7 w-7" style={{ color: accent }} />
                )}
                <p className="mt-4 text-[13.5px] font-medium text-[var(--ad-ink)]">
                  {uploading ? "Uploading…" : "Choose a file to upload"}
                </p>
                <p className="ad-mono mt-1.5 text-[10px] uppercase tracking-[0.1em] text-[var(--ad-ink-ghost)]">
                  PNG · JPG · WEBP · SVG · GIF · MP4 · MOV · WEBM
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  disabled={uploading}
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                />
              </label>

              <div>
                <p className="ad-micro mb-3">Uploaded this session · {uploadedFiles.length}</p>
                {uploadedFiles.length === 0 ? (
                  <EmptyState
                    icon={ImageOff}
                    title="Nothing uploaded yet"
                    body="Files you upload in this session appear here with a one-click copy button for their path."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {uploadedFiles.map((file, i) => (
                      <Panel key={i} className="overflow-hidden">
                        <div className="relative aspect-video bg-[var(--ad-void)]">
                          {isVideoUrl(file.url) ? (
                            <video
                              src={file.url}
                              muted
                              playsInline
                              preload="metadata"
                              controls
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <SmartImage
                              src={file.url}
                              alt={file.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="space-y-2.5 p-3">
                          <p className="truncate text-[12px] font-medium text-[var(--ad-ink)]">{file.name}</p>
                          <Button
                            icon={Copy}
                            className="w-full"
                            onClick={() => {
                              navigator.clipboard.writeText(file.url);
                              notify("success", `Copied ${file.url}`);
                            }}
                          >
                            Copy path
                          </Button>
                        </div>
                      </Panel>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- TAB 10: BACKUP ---------------- */}
          {activeTab === "backup" && (
            <div key="backup" className="ad-rise space-y-7">
              <TabHead
                eyebrow="System"
                title="Backup & reset"
                lede="Export everything to a file you can keep, restore from one later, or return the whole portfolio to its original state."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Panel>
                  <PanelHead title="Export" icon={Download} caption="Download the full configuration as JSON" />
                  <div className="space-y-5 p-5">
                    <p className="text-[12.5px] leading-relaxed text-[var(--ad-ink-faint)]">
                      Contains every setting, font, colour, section, project and image path currently
                      on screen — including unsaved edits.
                    </p>
                    <Button
                      icon={Download}
                      onClick={() => {
                        const jsonStr = JSON.stringify(config, null, 2);
                        const blob = new Blob([jsonStr], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `b2b-portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        // Revoking synchronously can cancel the download in some
                        // browsers before it has started reading the blob.
                        setTimeout(() => URL.revokeObjectURL(url), 10_000);
                        notify("success", "Backup file downloaded");
                      }}
                    >
                      Download backup
                    </Button>

                    <div className="border-t border-[var(--ad-line-soft)] pt-5">
                      <p className="ad-micro mb-2">Restore</p>
                      <p className="mb-3.5 text-[12.5px] leading-relaxed text-[var(--ad-ink-faint)]">
                        Load a previously downloaded backup. Nothing is published until you press
                        Save changes.
                      </p>
                      <label className="ad-focusable inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[var(--ad-line)] bg-[var(--ad-raised)] px-3.5 py-2 text-[12px] font-medium text-[var(--ad-ink)] transition hover:border-[var(--ad-line-strong)]">
                        <FileJson className="h-3.5 w-3.5" />
                        Choose backup file
                        <input
                          type="file"
                          accept="application/json,.json"
                          className="hidden"
                          onChange={handleImportBackup}
                        />
                      </label>
                    </div>
                  </div>
                </Panel>

                <Panel className="border-[#f87171]/20">
                  <PanelHead title="Factory reset" icon={RotateCcw} caption="Return everything to the original state" />
                  <div className="space-y-5 p-5">
                    <p className="text-[12.5px] leading-relaxed text-[var(--ad-ink-faint)]">
                      Restores all settings, fonts, colours, sections and projects to the defaults the
                      portfolio shipped with. Export a backup first if you might want today&apos;s
                      version again.
                    </p>
                    <Button variant="danger" icon={RotateCcw} onClick={handleReset} disabled={saving}>
                      Restore defaults
                    </Button>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="ad-toast fixed left-1/2 top-[74px] z-[60] flex max-w-[92vw] items-center gap-2.5 rounded-[10px] border px-4 py-2.5 text-[12.5px] font-medium shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          style={{
            borderColor: statusMessage.type === "success" ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.4)",
            background: statusMessage.type === "success" ? "rgba(5,26,14,0.95)" : "rgba(32,8,10,0.95)",
            color: statusMessage.type === "success" ? "#86efac" : "#fca5a5",
          }}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ShieldCheck,
  Search,
  X,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { SiteConfig, ProjectConfig, ServiceItemConfig, ClientMarkConfig } from "@/types/config";

const BRAND_FONTS = [
  { id: "Playfair Display", name: "Playfair Display (Classic Elegant - Default)", sample: "B2B. Creative Studio" },
  { id: "Cairo", name: "Cairo (Arabic / Premium Bilingual)", sample: "B2B Creative Studio" },
  { id: "Tajawal", name: "Tajawal (Modern Balanced)", sample: "Visual Identity & Exceptional Ads" },
  { id: "Almarai", name: "Almarai (Elegant & Smooth)", sample: "Work That Makes a Difference for Brands" },
  { id: "Outfit", name: "Outfit (Ultra Modern Digital)", sample: "High Impact Modern Studio" },
  { id: "Montserrat", name: "Montserrat (Strong Geometric)", sample: "Bold Geometric Presence" },
  { id: "Syne", name: "Syne (Bold Creative)", sample: "Avant-Garde Studio" },
  { id: "Amiri", name: "Amiri (Classic Arabic Serif)", sample: "Authentic Creativity & Inspiring Content" },
];

const BODY_FONTS = [
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans (Universal Default)", sample: "Clean readable modern body text" },
  { id: "Cairo", name: "Cairo (Excellent for Reading)", sample: "A complete and ideal font for reading body text and paragraphs" },
  { id: "Almarai", name: "Almarai (Smooth & Fluid)", sample: "Effortlessly browse and read services" },
  { id: "Tajawal", name: "Tajawal (Modern & Clear)", sample: "Clear, eye-friendly text on all screens" },
  { id: "Inter", name: "Inter (Ultra Technical Standard)", sample: "Industry standard UI typography" },
  { id: "Roboto", name: "Roboto (Practical & Versatile)", sample: "Practical and highly versatile font" },
];

const COLOR_PRESETS = [
  { name: "B2B Signature Red", hex: "#E50914", bg: "#070709" },
  { name: "Luxury Gold", hex: "#D97706", bg: "#080705" },
  { name: "Cyber Neon Blue", hex: "#2563EB", bg: "#05070e" },
  { name: "Emerald Studio", hex: "#059669", bg: "#040906" },
  { name: "Royal Purple", hex: "#7C3AED", bg: "#07050d" },
  { name: "Crimson Rose", hex: "#E11D48", bg: "#090406" },
];

interface Props {
  initialConfig: SiteConfig;
  userEmail: string;
}

export function AdminDashboardClient({ initialConfig, userEmail }: Props) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<
    "typography" | "sections" | "headerFooter" | "hero" | "projects" | "services" | "brandsReels" | "agencyAbout" | "media" | "backup"
  >("typography");

  // Notifications
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Project search & modal
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  const notify = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleSave = async () => {
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
        notify("success", "All changes saved successfully! The site has been updated instantly.");
      }
    } catch {
      notify("error", "A server error occurred while saving changes");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to restore the original default settings for this portfolio?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.config);
        notify("success", "Original settings have been restored successfully");
      } else {
        notify("error", "Restore operation failed");
      }
    } catch {
      notify("error", "Server error during restore");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(prev.sections[sec] as any),
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

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#070709]/95 backdrop-blur-xl px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo & Client Verification Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" target="_blank" className="transition hover:opacity-90">
              <img src={config.header.logoUrl || "/brand/wordmark.png"} alt="B2B." className="h-9 w-auto" />
            </Link>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white font-brand">Portfolio Dashboard</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-950/60 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  <ShieldCheck className="h-3 w-3 text-red-500" />
                  Verified Client
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono" dir="ltr">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
              <span>Live Preview</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:from-red-500 hover:to-red-600 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>Save All Changes</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 hover:border-red-900/50 hover:bg-red-950/40 hover:text-red-400 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-xs font-bold shadow-2xl backdrop-blur-xl animate-fade-in ${
            statusMessage.type === "success"
              ? "border-green-500/60 bg-green-950/90 text-green-200 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
              : "border-red-500/60 bg-red-950/90 text-red-200 shadow-[0_0_30px_rgba(229,9,20,0.3)]"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-20 flex flex-row lg:flex-col gap-1.5 overflow-x-auto rounded-3xl border border-zinc-800/80 bg-[#0c0c12]/90 p-2.5 backdrop-blur-xl">
            {[
              { id: "typography", label: "Fonts & Theme", icon: Type, badge: "Global" },
              { id: "sections", label: "Sections & Visibility", icon: Layout, badge: "8 sections" },
              { id: "headerFooter", label: "Header & Footer", icon: SlidersHorizontal },
              { id: "hero", label: "Hero Section", icon: Sparkles },
              { id: "projects", label: "Projects & Work", icon: FolderKanban, badge: `${config.projects.length}` },
              { id: "services", label: "Services & Deliverables", icon: Wrench, badge: `${config.studioServices.length}` },
              { id: "brandsReels", label: "Clients & Reels", icon: Film },
              { id: "agencyAbout", label: "About & Contact", icon: Building },
              { id: "media", label: "Media Library", icon: Upload },
              { id: "backup", label: "Backup & Reset", icon: RotateCcw },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex min-w-max items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition cursor-pointer text-left ${
                    active
                      ? "bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] font-bold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${active ? "text-white" : "text-zinc-500"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        active ? "bg-black/30 text-white" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 min-w-0">
          <div className="rounded-3xl border border-zinc-800/80 bg-[#0c0c12]/90 p-5 sm:p-8 backdrop-blur-xl shadow-xl">
            {/* ----------------- TAB 1: TYPOGRAPHY & THEME ----------------- */}
            {activeTab === "typography" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Type className="h-3.5 w-3.5 text-red-500" />
                    <span>Control font types, sizes & overall appearance</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Fonts, Sizes & Global Theme</h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Change the heading font, body font, base size, and heading scale — the entire portfolio updates instantly.
                  </p>
                </div>

                {/* Fonts Pickers */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Brand Font */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
                    <label className="block text-xs font-bold text-zinc-300">
                      Heading & Brand Font
                    </label>
                    <select
                      value={config.typography.brandFont}
                      onChange={(e) => updateTypography("brandFont", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      {BRAND_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    <div className="rounded-xl border border-zinc-900 bg-black/60 p-3 text-center">
                      <p className="text-[10px] text-zinc-500 mb-1">Live heading font preview:</p>
                      <h3
                        className="text-lg font-black text-white"
                        style={{ fontFamily: `"${config.typography.brandFont}", serif` }}
                      >
                        B2B. Work That Holds The Frame
                      </h3>
                      <p
                        className="text-sm font-bold text-red-500 mt-1"
                        style={{ fontFamily: `"${config.typography.brandFont}", serif` }}
                      >
                        Work That Makes a Difference for Brands
                      </p>
                    </div>
                  </div>

                  {/* Body Font */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
                    <label className="block text-xs font-bold text-zinc-300">
                      Body Text Font
                    </label>
                    <select
                      value={config.typography.bodyFont}
                      onChange={(e) => updateTypography("bodyFont", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      {BODY_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    <div className="rounded-xl border border-zinc-900 bg-black/60 p-3 text-center">
                      <p className="text-[10px] text-zinc-500 mb-1">Live body font preview:</p>
                      <p
                        className="text-xs text-zinc-300 leading-relaxed"
                        style={{ fontFamily: `"${config.typography.bodyFont}", sans-serif` }}
                      >
                        B2B Studio — specialists in visual identity, advertising campaigns, and AI-powered solutions for leading projects across the Middle East.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Font Sizes & Scale Sliders */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-300">Base Font Size</span>
                      <span className="font-mono text-red-400 font-bold">{config.typography.baseFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="13"
                      max="22"
                      step="1"
                      value={config.typography.baseFontSize}
                      onChange={(e) => updateTypography("baseFontSize", Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Small (13px)</span>
                      <span>Default (16px)</span>
                      <span>Large (22px)</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-300">Headings Scale</span>
                      <span className="font-mono text-red-400 font-bold">×{config.typography.headingScale}</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.05"
                      value={config.typography.headingScale}
                      onChange={(e) => updateTypography("headingScale", Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Modest (0.8x)</span>
                      <span>Standard (1.0x)</span>
                      <span>Bold (1.4x)</span>
                    </div>
                  </div>
                </div>

                {/* Color Palettes & Custom Colors */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-bold text-zinc-300">Brand Colors & Theme</span>
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-2">Ready-made color presets — one click to apply:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            updateTypography("primaryColor", preset.hex);
                            updateTypography("primaryGlow", `${preset.hex}66`);
                            updateTypography("backgroundColor", preset.bg);
                          }}
                          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-left hover:border-zinc-700 transition cursor-pointer"
                        >
                          <span className="h-4 w-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: preset.hex }} />
                          <span className="text-xs text-zinc-300 font-medium truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Pickers */}
                  <div className="grid gap-4 sm:grid-cols-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1.5">Primary Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.typography.primaryColor}
                          onChange={(e) => updateTypography("primaryColor", e.target.value)}
                          className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={config.typography.primaryColor}
                          onChange={(e) => updateTypography("primaryColor", e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white uppercase font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1.5">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.typography.backgroundColor}
                          onChange={(e) => updateTypography("backgroundColor", e.target.value)}
                          className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={config.typography.backgroundColor}
                          onChange={(e) => updateTypography("backgroundColor", e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white uppercase font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1.5">Primary Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.typography.textColor}
                          onChange={(e) => updateTypography("textColor", e.target.value)}
                          className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={config.typography.textColor}
                          onChange={(e) => updateTypography("textColor", e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white uppercase font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 2: SECTIONS CONTROLLER ----------------- */}
            {activeTab === "sections" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Layout className="h-3.5 w-3.5 text-red-500" />
                    <span>Show, hide & rename site sections</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Full Portfolio Section Control</h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Hide or show any section entirely, and edit the badge, main title, and description for each section.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { key: "hero", label: "1. Hero Stage", desc: "Main headline, logo & animated keywords" },
                    { key: "showroom3d", label: "2. Interactive 3D Showroom", desc: "Display projects in a three-dimensional space" },
                    { key: "portfolio", label: "3. Portfolio Archive & Filter", desc: "Full archive with sector and style categories" },
                    { key: "dataStats", label: "4. Data & KPI Stats", desc: "Years of work, projects delivered & sector ratios" },
                    { key: "services", label: "5. Services & Deliverables", desc: "Four service packages and their deliverables" },
                    { key: "studioBoards", label: "6. Client Logos & House Reel", desc: "Partner logo strip and production & social videos" },
                    { key: "about", label: "7. About B2B. & Why Us", desc: "Vision, mission & 8 studio differentiators" },
                    { key: "contact", label: "8. Contact Form & 15-min Consult", desc: "Direct brief form and cost estimator" },
                  ].map((sec) => {
                    const secData = config.sections[sec.key as keyof SiteConfig["sections"]];
                    return (
                      <div
                        key={sec.key}
                        className={`rounded-2xl border p-5 transition ${
                          secData.visible
                            ? "border-zinc-800 bg-zinc-950/80"
                            : "border-red-950/40 bg-black/40 opacity-70"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white">{sec.label}</h3>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  secData.visible ? "bg-green-950 border border-green-500/40 text-green-400" : "bg-zinc-800 text-zinc-500"
                                }`}
                              >
                                {secData.visible ? "Active" : "Hidden"}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{sec.desc}</p>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={secData.visible}
                              onChange={(e) => updateSection(sec.key as keyof SiteConfig["sections"], "visible", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>

                        {/* Section text details */}
                        <div className="grid gap-3 sm:grid-cols-3 pt-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Section Badge</label>
                            <input
                              type="text"
                              value={secData.badgeText || ""}
                              onChange={(e) => updateSection(sec.key as keyof SiteConfig["sections"], "badgeText", e.target.value)}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Main Title</label>
                            <input
                              type="text"
                              value={"title" in secData ? (secData.title as string) : ""}
                              onChange={(e) => updateSection(sec.key as keyof SiteConfig["sections"], "title", e.target.value)}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Highlighted Word</label>
                            <input
                              type="text"
                              value={"titleHighlight" in secData ? (secData.titleHighlight as string) : ""}
                              onChange={(e) => updateSection(sec.key as keyof SiteConfig["sections"], "titleHighlight", e.target.value)}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------- TAB 3: HEADER & FOOTER ----------------- */}
            {activeTab === "headerFooter" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-red-500" />
                    <span>Full control over header and footer</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Header (Navbar) & Footer Settings</h2>
                </div>

                {/* Header Section */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-5">
                  <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-2">Header & Navigation Bar</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Logo */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Header Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={config.header.logoUrl}
                          onChange={(e) => updateHeader("logoUrl", e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                          dir="ltr"
                        />
                        <label className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-white hover:bg-zinc-700 cursor-pointer flex items-center gap-1">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => updateHeader("logoUrl", url))}
                          />
                        </label>
                      </div>
                      {config.header.logoUrl && (
                        <div className="mt-2 p-2 rounded-lg bg-black border border-zinc-900 inline-block">
                          <img src={config.header.logoUrl} alt="Logo" className="h-8 w-auto" />
                        </div>
                      )}
                    </div>

                    {/* WhatsApp CTA */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">WhatsApp Quick Button in Header</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={config.header.whatsappCta.label}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              header: {
                                ...prev.header,
                                whatsappCta: { ...prev.header.whatsappCta, label: e.target.value },
                              },
                            }))
                          }
                          placeholder="Button text (e.g. WhatsApp)"
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.header.whatsappCta.show}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  whatsappCta: { ...prev.header.whatsappCta, show: e.target.checked },
                                },
                              }))
                            }
                            className="rounded accent-red-600"
                          />
                          <span>Show button</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Nav links */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">Navigation Links</label>
                    <div className="space-y-2">
                      {config.header.navLinks.map((link, idx) => (
                        <div key={link.id || idx} className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-black/60 p-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const updated = [...config.header.navLinks];
                              updated[idx].label = e.target.value;
                              updateHeader("navLinks", updated);
                            }}
                            className="w-36 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              const updated = [...config.header.navLinks];
                              updated[idx].href = e.target.value;
                              updateHeader("navLinks", updated);
                            }}
                            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 font-mono"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.header.navLinks];
                              updated[idx].visible = !updated[idx].visible;
                              updateHeader("navLinks", updated);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              link.visible ? "bg-green-950 text-green-400 border border-green-800" : "bg-zinc-800 text-zinc-500"
                            }`}
                          >
                            {link.visible ? "Active" : "Disabled"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-2">Footer</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Footer Logo URL</label>
                      <input
                        type="text"
                        value={config.footer.logoUrl}
                        onChange={(e) => updateFooter("logoUrl", e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Copyright Text</label>
                      <input
                        type="text"
                        value={config.footer.copyrightText}
                        onChange={(e) => updateFooter("copyrightText", e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Footer Description</label>
                    <textarea
                      rows={2}
                      value={config.footer.description}
                      onChange={(e) => updateFooter("description", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 4: HERO SECTION ----------------- */}
            {activeTab === "hero" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    <span>Customize the first impression for visitors</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Hero Stage</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Top Badge Text</label>
                    <input
                      type="text"
                      value={config.sections.hero.badgeText}
                      onChange={(e) => updateSection("hero", "badgeText", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Title Lead</label>
                    <input
                      type="text"
                      value={config.sections.hero.titleLead}
                      onChange={(e) => updateSection("hero", "titleLead", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Title Highlight (Red Word)</label>
                    <input
                      type="text"
                      value={config.sections.hero.titleHighlight}
                      onChange={(e) => updateSection("hero", "titleHighlight", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Animated Fields (comma-separated)</label>
                    <input
                      type="text"
                      value={config.sections.hero.fields.join(", ")}
                      onChange={(e) =>
                        updateSection(
                          "hero",
                          "fields",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={config.sections.hero.description}
                    onChange={(e) => updateSection("hero", "description", e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white leading-relaxed"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">3D Studio Button Text (Button 1)</label>
                    <input
                      type="text"
                      value={config.sections.hero.btnShowroomText}
                      onChange={(e) => updateSection("hero", "btnShowroomText", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Archive Button Text (Button 2)</label>
                    <input
                      type="text"
                      value={config.sections.hero.btnArchiveText}
                      onChange={(e) => updateSection("hero", "btnArchiveText", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 5: PROJECTS CRUD ----------------- */}
            {activeTab === "projects" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                      <FolderKanban className="h-3.5 w-3.5 text-red-500" />
                      <span>Manage all projects and work</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-brand">
                      Projects Gallery ({config.projects.length} projects)
                    </h2>
                  </div>

                  <button
                    type="button"
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
                      setSelectedProject(newProj);
                      setIsEditingProject(true);
                      notify("success", "New project created — ready to edit");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-red-700 transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by name, sector, or keywords..."
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 pr-10 text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                  />
                  <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                </div>

                {/* Projects List Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {config.projects
                    .filter(
                      (p) =>
                        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                        p.arabic.includes(projectSearch) ||
                        p.sector.toLowerCase().includes(projectSearch.toLowerCase())
                    )
                    .map((project, index) => (
                      <div
                        key={project.slug || index}
                        className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 hover:border-zinc-700 transition flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-900 relative">
                            {project.images?.[0] ? (
                              <img
                                src={project.images[0]}
                                alt={project.title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-zinc-600">
                                No image
                              </div>
                            )}
                            <span className="absolute top-2 left-2 rounded-lg bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                              {project.sector}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white">{project.title}</h4>
                              <span className="text-xs text-red-400 font-medium">{project.arabic}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{project.problem}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <span className="text-[10px] text-zinc-500">{project.images?.length || 0} images</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProject(project);
                                setIsEditingProject(true);
                              }}
                              className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                                  setConfig((prev) => ({
                                    ...prev,
                                    projects: prev.projects.filter((p) => p.slug !== project.slug),
                                  }));
                                  notify("success", "Project deleted");
                                }
                              }}
                              className="rounded-lg bg-zinc-900 p-1.5 text-zinc-500 hover:bg-red-950 hover:text-red-400 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Edit Project Modal */}
                {isEditingProject && selectedProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#0c0c14] p-6 shadow-2xl my-8">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                        <h3 className="text-base font-bold text-white">Edit Project: {selectedProject.title}</h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="rounded-full bg-zinc-900 p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Project Title (English)</label>
                            <input
                              type="text"
                              value={selectedProject.title}
                              onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Project Subtitle / Arabic Name</label>
                            <input
                              type="text"
                              value={selectedProject.arabic}
                              onChange={(e) => setSelectedProject({ ...selectedProject, arabic: e.target.value })}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Slug (URL path)</label>
                            <input
                              type="text"
                              value={selectedProject.slug}
                              onChange={(e) => setSelectedProject({ ...selectedProject, slug: e.target.value })}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white font-mono"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">Sector</label>
                            <select
                              value={selectedProject.sector}
                              onChange={(e) => setSelectedProject({ ...selectedProject, sector: e.target.value })}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                            >
                              <option value="auto">Automotive</option>
                              <option value="education">Education</option>
                              <option value="realestate">Real Estate</option>
                              <option value="places">Places & Hospitality</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">The Problem / Challenge</label>
                          <textarea
                            rows={2}
                            value={selectedProject.problem}
                            onChange={(e) => setSelectedProject({ ...selectedProject, problem: e.target.value })}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">The Solution / Execution</label>
                          <textarea
                            rows={2}
                            value={selectedProject.solution}
                            onChange={(e) => setSelectedProject({ ...selectedProject, solution: e.target.value })}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white"
                          />
                        </div>

                        {/* Project Images */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-[11px] text-zinc-400">Project Images</label>
                            <label className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              <span>Upload new image</span>
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
                                <span className="h-6 w-6 rounded overflow-hidden shrink-0 bg-black border border-zinc-800">
                                  <img src={img} alt="" className="h-full w-full object-cover" />
                                </span>
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const updated = [...selectedProject.images];
                                    updated[i] = e.target.value;
                                    setSelectedProject({ ...selectedProject, images: updated });
                                  }}
                                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 font-mono"
                                  dir="ltr"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject({
                                      ...selectedProject,
                                      images: selectedProject.images.filter((_, idx) => idx !== i),
                                    });
                                  }}
                                  className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
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
                              className="text-[11px] text-zinc-400 hover:text-white transition flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add image URL</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfig((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) => (p.slug === selectedProject.slug ? selectedProject : p)),
                            }));
                            setIsEditingProject(false);
                            notify("success", `Project "${selectedProject.title}" updated`);
                          }}
                          className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- TAB 6: SERVICES ----------------- */}
            {activeTab === "services" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Wrench className="h-3.5 w-3.5 text-red-500" />
                    <span>Manage studio services and deliverables</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">
                    Service Packages ({config.studioServices.length} services)
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {config.studioServices.map((service, idx) => (
                    <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-red-500">{service.index}</span>
                        <input
                          type="text"
                          value={service.tag}
                          onChange={(e) => {
                            const updated = [...config.studioServices];
                            updated[idx].tag = e.target.value;
                            setConfig((prev) => ({ ...prev, studioServices: updated }));
                          }}
                          className="w-24 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400 uppercase text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...config.studioServices];
                            updated[idx].title = e.target.value;
                            setConfig((prev) => ({ ...prev, studioServices: updated }));
                          }}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={service.text}
                          onChange={(e) => {
                            const updated = [...config.studioServices];
                            updated[idx].text = e.target.value;
                            setConfig((prev) => ({ ...prev, studioServices: updated }));
                          }}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-xs text-zinc-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Deliverables (comma-separated)</label>
                        <input
                          type="text"
                          value={service.deliverables.join(", ")}
                          onChange={(e) => {
                            const updated = [...config.studioServices];
                            updated[idx].deliverables = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            setConfig((prev) => ({ ...prev, studioServices: updated }));
                          }}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------- TAB 7: BRANDS & REELS ----------------- */}
            {activeTab === "brandsReels" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Film className="h-3.5 w-3.5 text-red-500" />
                    <span>Client logos and reel videos</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Partner Logos & Studio Reels</h2>
                </div>

                {/* Client Marks */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <h3 className="text-sm font-bold text-white">Client & Partner Logos</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newMark: ClientMarkConfig = {
                          name: "Brand Partner",
                          src: "/brand/mark.png",
                        };
                        setConfig((prev) => ({ ...prev, marks: [...prev.marks, newMark] }));
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs text-red-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add client logo</span>
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {config.marks.map((mark, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 rounded-xl border border-zinc-900 bg-black/60 p-2">
                        <img src={mark.src} alt={mark.name} className="h-8 w-8 object-contain rounded bg-zinc-900 p-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={mark.name}
                            onChange={(e) => {
                              const updated = [...config.marks];
                              updated[idx].name = e.target.value;
                              setConfig((prev) => ({ ...prev, marks: updated }));
                            }}
                            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={mark.src}
                            onChange={(e) => {
                              const updated = [...config.marks];
                              updated[idx].src = e.target.value;
                              setConfig((prev) => ({ ...prev, marks: updated }));
                            }}
                            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 mt-1 font-mono"
                            dir="ltr"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setConfig((prev) => ({
                              ...prev,
                              marks: prev.marks.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 8: AGENCY & ABOUT ----------------- */}
            {activeTab === "agencyAbout" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Building className="h-3.5 w-3.5 text-red-500" />
                    <span>Studio details, vision & contact info</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Agency Details, Vision & Contact</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Agency Name</label>
                    <input
                      type="text"
                      value={config.agency.name}
                      onChange={(e) => updateAgency("name", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Formerly (Previous Name)</label>
                    <input
                      type="text"
                      value={config.agency.former}
                      onChange={(e) => updateAgency("former", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Business Email</label>
                    <input
                      type="email"
                      value={config.agency.email}
                      onChange={(e) => updateAgency("email", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={config.agency.phone}
                      onChange={(e) => {
                        updateAgency("phone", e.target.value);
                        updateAgency("phoneHref", `tel:${e.target.value.replace(/[^0-9+]/g, "")}`);
                      }}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={config.agency.whatsapp}
                      onChange={(e) => {
                        updateAgency("whatsapp", e.target.value);
                        updateAgency("whatsappHref", `https://wa.me/${e.target.value.replace(/[^0-9]/g, "")}`);
                      }}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Social links */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={config.agency.facebook}
                      onChange={(e) => updateAgency("facebook", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={config.agency.instagram}
                      onChange={(e) => updateAgency("instagram", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Agency Vision</label>
                    <textarea
                      rows={3}
                      value={config.agency.vision}
                      onChange={(e) => updateAgency("vision", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Agency Mission</label>
                    <textarea
                      rows={3}
                      value={config.agency.mission}
                      onChange={(e) => updateAgency("mission", e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* Why Us */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-300">Why Choose B2B — 8 Differentiators</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {config.whyUs.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-red-500 font-bold">{idx + 1}</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...config.whyUs];
                            updated[idx] = e.target.value;
                            setConfig((prev) => ({ ...prev, whyUs: updated }));
                          }}
                          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 9: MEDIA & UPLOADS ----------------- */}
            {activeTab === "media" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <Upload className="h-3.5 w-3.5 text-red-500" />
                    <span>Media library and file uploads</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Media Library & Uploads</h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Upload images and videos directly from your device and use the link anywhere in the portfolio.
                  </p>
                </div>

                {/* Uploader Box */}
                <div className="rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center hover:border-red-500/50 transition">
                  <Upload className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white">Choose an image or media file from your device</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">Supports PNG, JPG, WebP, SVG images and MP4 videos</p>
                  <label className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-red-700 cursor-pointer">
                    {uploading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{uploading ? "Uploading..." : "Select & Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Gallery */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">Recently Uploaded ({uploadedFiles.length})</h3>
                  {uploadedFiles.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-6 text-center text-xs text-zinc-500">
                      No files uploaded in this session yet. Upload an image to see it here with a copy link option.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {uploadedFiles.map((file, i) => (
                        <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                          <div className="aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center">
                            <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                          </div>
                          <p className="text-[11px] text-zinc-300 font-medium truncate">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(file.url);
                              notify("success", `Image URL copied: ${file.url}`);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 py-1.5 text-xs text-zinc-300 hover:text-white cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy Image URL</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------- TAB 10: BACKUP & RESET ----------------- */}
            {activeTab === "backup" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs text-red-400 mb-2">
                    <RotateCcw className="h-3.5 w-3.5 text-red-500" />
                    <span>Backup and restore data</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-brand">Backup & Factory Reset</h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Download a backup of all site settings and content, or restore the original default configuration.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Export */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-white">Export Backup (JSON)</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Download a JSON file containing all settings, fonts, projects, and images — restore anytime.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const jsonStr = JSON.stringify(config, null, 2);
                        const blob = new Blob([jsonStr], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `b2b-portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        notify("success", "Backup file downloaded successfully");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white hover:border-zinc-700 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Backup</span>
                    </button>
                  </div>

                  {/* Factory Reset */}
                  <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-red-300">Factory Reset</h3>
                    <p className="text-xs text-red-400/80 leading-relaxed">
                      Restore all settings, fonts, and projects to the original default state.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restore Default Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

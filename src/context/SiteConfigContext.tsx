"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { SiteConfig } from "@/types/config";
import { defaultConfig } from "@/data/default-config";
import Link from "next/link";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";

interface SiteConfigContextType {
  config: SiteConfig;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  isLoading: false,
  isAdminLoggedIn: false,
  refreshConfig: async () => {},
});

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

interface ProviderProps {
  children: React.ReactNode;
  initialConfig?: SiteConfig;
}

export function SiteConfigProvider({ children, initialConfig }: ProviderProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig || defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const refreshConfig = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/site-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error("Error refreshing site config:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if client is logged in
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAdminLoggedIn(true);
        }
      })
      .catch(() => {});

    // Refresh config from API to get any latest edits
    refreshConfig();
  }, []);

  // Compute Google Fonts stylesheet URL
  const googleFontsHref = useMemo(() => {
    const fontsToLoad = new Set<string>();
    const brand = config.typography?.brandFont;
    const body = config.typography?.bodyFont;

    if (brand && !["system-ui", "sans-serif", "serif"].includes(brand)) {
      fontsToLoad.add(brand.trim());
    }
    if (body && !["system-ui", "sans-serif", "serif"].includes(body)) {
      fontsToLoad.add(body.trim());
    }

    // Common fonts we make available
    ["Playfair Display", "Plus Jakarta Sans", "Cairo", "Tajawal", "Almarai", "Outfit", "Montserrat", "Syne"].forEach((f) => {
      fontsToLoad.add(f);
    });

    const families = Array.from(fontsToLoad)
      .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300..900;1,300..900`)
      .join("&");

    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
  }, [config.typography?.brandFont, config.typography?.bodyFont]);

  // Dynamic CSS variables
  const dynamicStyles = useMemo(() => {
    const brandFont = config.typography?.brandFont || "Playfair Display";
    const bodyFont = config.typography?.bodyFont || "Plus Jakarta Sans";
    const primary = config.typography?.primaryColor || "#E50914";
    const bg = config.typography?.backgroundColor || "#070709";
    const text = config.typography?.textColor || "#F3F4F6";
    const baseSize = config.typography?.baseFontSize || 16;
    const headingScale = config.typography?.headingScale || 1.0;

    return `
      :root {
        --font-brand: "${brandFont}", "Playfair Display", serif;
        --font-sans: "${bodyFont}", "Plus Jakarta Sans", system-ui, sans-serif;
        --color-primary: ${primary};
        --color-bg: ${bg};
        --color-text: ${text};
        --base-font-size: ${baseSize}px;
        --heading-scale: ${headingScale};
      }
      body {
        font-family: var(--font-sans);
        background-color: var(--color-bg);
        color: var(--color-text);
        font-size: var(--base-font-size);
      }
      .font-brand {
        font-family: var(--font-brand);
      }
      /* Dynamic primary color accents */
      .text-red-500, .text-red-600 {
        color: var(--color-primary) !important;
      }
      .bg-red-600, .bg-red-700 {
        background-color: var(--color-primary) !important;
      }
      .border-red-500, .border-red-600 {
        border-color: var(--color-primary) !important;
      }
      .shadow-\\[0_0_15px_rgba\\(229\\,9\\,20\\,0\\.4\\)\\] {
        box-shadow: 0 0 20px ${primary}66 !important;
      }
      .shadow-\\[0_0_30px_rgba\\(229\\,9\\,20\\,0\\.6\\)\\] {
        box-shadow: 0 0 35px ${primary}88 !important;
      }
    `;
  }, [config.typography]);

  return (
    <SiteConfigContext.Provider value={{ config, isLoading, isAdminLoggedIn, refreshConfig }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={googleFontsHref} />
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      {children}

      {/* Floating Client Dashboard Quick-Access Badge when logged in */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-6 left-6 z-50">
          <Link
            href="/admin"
            className="group flex items-center gap-2.5 rounded-full border border-red-500/60 bg-black/90 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(229,9,20,0.6)] backdrop-blur-xl transition hover:scale-105 hover:bg-red-950/80"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
            </span>
            <SlidersHorizontal className="h-4 w-4 text-red-500 transition group-hover:rotate-45" />
            <span>لوحة تحكم العميل</span>
            <span className="rounded-full bg-red-600/30 px-1.5 py-0.5 text-[10px] text-red-300">نشط</span>
          </Link>
        </div>
      )}
    </SiteConfigContext.Provider>
  );
}

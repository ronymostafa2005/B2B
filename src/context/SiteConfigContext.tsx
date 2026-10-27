"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { SiteConfig } from "@/types/config";
import { defaultConfig } from "@/data/default-config";
import { hexToRgba, readableOn } from "@/lib/color";

interface SiteConfigContextType {
  config: SiteConfig;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  isLoading: false,
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

  const refreshConfig = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/site-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      // Keep whatever config we already have (the server-rendered one) rather
      // than dropping the whole site back to defaults on a transient failure.
      console.error("Error refreshing site config:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // The server already renders with the saved config, so only fetch on mount
    // when this provider was mounted without one.
    if (!initialConfig) {
      (async () => {
        if (!cancelled) await refreshConfig();
      })();
    }

    // Live updates published by the dashboard, from this tab or any other.
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("b2b_site_sync");
        channel.onmessage = (event) => {
          if (event.data?.type === "CONFIG_UPDATED") {
            refreshConfig();
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported", e);
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "b2b_config_updated_at") {
        refreshConfig();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const brand = config.typography?.primaryColor || "#E50914";
    const bg = config.typography?.backgroundColor || "#070709";
    const text = config.typography?.textColor || "#F3F4F6";
    const baseSize = config.typography?.baseFontSize || 16;
    const headingScale = config.typography?.headingScale || 1.0;

    /* The accent is client-chosen, so every tint is derived from it rather
       than hard-coded. Previously only six exact utility classes were
       overridden, which left ~50 elements stuck red whenever the client
       picked a different brand colour. */
    return `
      :root {
        --font-brand: "${brandFont}", "Playfair Display", serif;
        --font-sans: "${bodyFont}", "Plus Jakarta Sans", system-ui, sans-serif;

        --brand: ${brand};
        --brand-contrast: ${readableOn(brand)};
        --brand-soft: ${hexToRgba(brand, 0.12)};
        --brand-veil: ${hexToRgba(brand, 0.05)};
        --brand-line: ${hexToRgba(brand, 0.38)};
        --brand-edge: ${hexToRgba(brand, 0.6)};
        --brand-glow: ${hexToRgba(brand, 0.35)};

        --bg: ${bg};
        --ink: ${text};

        --base-font-size: ${baseSize}px;
        --heading-scale: ${headingScale};

        /* Legacy aliases, kept so any stragglers still resolve. */
        --color-primary: ${brand};
        --color-bg: ${bg};
        --color-text: ${text};
      }

      body {
        font-family: var(--font-sans);
        background-color: var(--bg);
        color: var(--ink);
        font-size: var(--base-font-size);
      }

      .font-brand {
        font-family: var(--font-brand);
      }
    `;
  }, [config.typography]);

  return (
    <SiteConfigContext.Provider value={{ config, isLoading, refreshConfig }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={googleFontsHref} />
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      {children}
    </SiteConfigContext.Provider>
  );
}

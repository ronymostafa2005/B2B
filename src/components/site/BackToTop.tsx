"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { sound } from "@/lib/sound";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";

/**
 * Floating back-to-top control.
 *
 * This used to live inside the footer, which meant it only became reachable
 * once the visitor had already scrolled to the very bottom — the one place a
 * "back to top" is not needed. It is now pinned to the viewport and fades in
 * after the first screen, so it is available from anywhere down the page.
 */
export function BackToTop() {
  const { config } = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const enabled = config.footer?.showBackToTop !== false;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      // Coalesce to one read per frame; scroll fires far more often than paint.
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight * 0.75);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      // Kept out of the tab order while hidden, so it is not a dead stop for
      // keyboard users at the top of the page.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        sound.playClick();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }}
      className={`fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--bg)]/90 text-[var(--ink-dim)] shadow-[0_8px_28px_-10px_rgba(0,0,0,0.85)] backdrop-blur-md transition duration-300 hover:border-[var(--brand)] hover:text-[var(--brand)] sm:right-8 sm:bottom-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

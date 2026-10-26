"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * The server cannot know the visitor's motion preference, so assume motion is
 * allowed and let the client correct it immediately after hydration.
 */
function getServerSnapshot() {
  return false;
}

/**
 * Reads `prefers-reduced-motion` during render, so components can branch on it
 * without calling setState inside an effect (which causes cascading renders).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

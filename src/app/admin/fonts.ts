import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";

/**
 * Dashboard type system, scoped to /admin so the public site keeps its own
 * pairing (Playfair Display + Plus Jakarta Sans).
 *
 * - Instrument Serif: section titles. Editorial and high-contrast, it carries
 *   the studio's voice without competing with the site's Playfair.
 * - IBM Plex Sans: all interface text. Humanist-technical, and unusually
 *   legible at the 11-13px this control surface lives at.
 * - IBM Plex Mono: machine data only — slugs, hex values, URLs, counts and
 *   the micro-labels. Keeping data in mono makes it scannable at a glance.
 */

export const adminDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-admin-display",
  display: "swap",
});

export const adminSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin-sans",
  display: "swap",
});

export const adminMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-admin-mono",
  display: "swap",
});

export const adminFontVars = `${adminDisplay.variable} ${adminSans.variable} ${adminMono.variable}`;

"use client";

import { ArrowUp } from "lucide-react";
import { agency } from "@/lib/content";
import { sound } from "@/lib/sound";

const links = [
  { href: "#showcase-3d", label: "3D showroom" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#agency-data", label: "Data" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-zinc-900 pb-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-brand text-4xl font-black tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]">
                B2B.
              </span>
              <span className="border-l border-zinc-800 pl-3 text-xs tracking-widest text-zinc-400 uppercase">
                Creative studio
              </span>
            </div>
            <p className="mt-2 max-w-sm text-xs text-zinc-400">{agency.description}</p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-zinc-400">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-red-500">
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => {
              sound.playClick();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-full border border-zinc-800 bg-zinc-900 p-3 text-zinc-300 hover:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} B2B. Formerly {agency.former}. {agency.location}.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${agency.email}`} className="hover:text-red-400">
              {agency.email}
            </a>
            <a href={agency.phoneHref} className="hover:text-red-400">
              {agency.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

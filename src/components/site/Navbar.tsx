"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { agency } from "@/lib/content";
import { sound } from "@/lib/sound";
import { WhatsAppIcon } from "@/components/site/SocialIcons";

const links = [
  { href: "#showcase-3d", label: "3D Spatial" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#agency-data", label: "Data Impact" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  function go(href: string) {
    sound.playClick();
    setOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-zinc-900/80 bg-[#070709]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            go("#top");
          }}
          className="group flex items-center"
        >
          <img
            src="/brand/wordmark.png"
            alt="B2B. Marketing Agency"
            className="h-10 w-auto transition-transform group-hover:scale-105 sm:h-12"
          />
        </a>

        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-300 lg:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                go(item.href);
              }}
              className="hover:text-red-500"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={agency.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hidden items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:bg-red-700 sm:flex"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              sound.playClick();
              setOpen((value) => !value);
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-1 border-b border-zinc-800 bg-[#0a0a0e] px-4 pt-1 pb-5 lg:hidden">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                go(item.href);
              }}
              className="block py-2 text-sm font-medium text-zinc-300 hover:text-red-500"
            >
              {item.label}
            </a>
          ))}
          <a
            href={agency.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              sound.playClick();
              setOpen(false);
            }}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      ) : null}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { agency, chapters } from "@/lib/content";

const links = chapters.filter((chapter) => chapter.id !== "top");

export function SiteChrome() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    menuRef.current?.querySelector("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!onHome) return;
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  function current(id: string) {
    if (pathname.startsWith("/work")) return id === "work";
    return onHome && active === id;
  }

  function scrollToSection(
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    setMenuPath(null);
    if (!onHome || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
  }

  function scrollHome(event: MouseEvent<HTMLAnchorElement>) {
    if (!onHome || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setMenuPath(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  }

  const chapter = chapters.find((item) => item.id === active)?.label ?? "Intro";

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className={`header ${scrolled || !onHome ? "header-solid" : ""}`}>
        <div className="wrap header-bar">
          <Link href="/" className="brand" onClick={scrollHome}>
            <span className="sigil" aria-hidden="true">
              <svg viewBox="0 0 36 36">
                <circle className="sigil-track" cx="18" cy="18" r="12" />
                <circle className="sigil-ring" cx="18" cy="18" r="12" />
                <circle className="sigil-core" cx="18" cy="18" r="3.2" />
              </svg>
            </span>
            <span>
              B2B.
              <small>Identity & campaigns</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                aria-current={current(link.id) ? "true" : undefined}
                onClick={(event) => scrollToSection(event, link.id)}
              >
                {link.label}
              </Link>
            ))}
            <Link className="nav-cta" href="/#contact" onClick={(event) => scrollToSection(event, "contact")}>
              15-min consult
            </Link>
          </nav>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <span className="menu-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>
      <div
        ref={menuRef}
        id="site-menu"
        className={`menu ${open ? "is-open" : ""}`}
        inert={open ? undefined : true}
        aria-hidden={open ? undefined : true}
      >
        <nav aria-label="Menu">
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => scrollToSection(event, link.id)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a className="menu-mail" href={`mailto:${agency.email}`}>
          {agency.email}
        </a>
      </div>
      {onHome ? <p className="rail">{chapter}</p> : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { sectors, type Project } from "@/lib/content";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [index, setIndex] = useState(0);

  // Reset the carousel when a different project is opened. Adjusting state
  // during render avoids rendering the new project at the old image index for
  // one frame, which an effect would do.
  const [shownSlug, setShownSlug] = useState(project?.slug);
  if (project?.slug !== shownSlug) {
    setShownSlug(project?.slug);
    setIndex(0);
  }

  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % project.images.length);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + project.images.length) % project.images.length);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, project]);

  if (!project) return null;
  const sector = sectors.find((item) => item.id === project.sector)?.label;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={project.title}>
      <button type="button" className="absolute inset-0" aria-label="Close case" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-zinc-800 bg-[#0b0b10] sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 rounded-full border border-zinc-700 bg-black/70 p-2 text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid lg:grid-cols-12">
          <div className="relative min-h-[240px] bg-black lg:col-span-7 lg:min-h-[520px]">
            <Image src={project.images[index]} alt={project.alt} fill className="object-contain" sizes="(min-width: 1024px) 60vw, 100vw" />
            {project.images.length > 1 ? (
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                <button
                  type="button"
                  aria-label="Previous frame"
                  onClick={() => setIndex((current) => (current - 1 + project.images.length) % project.images.length)}
                  className="rounded-full bg-black/70 p-2 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="rounded-full bg-black/70 px-3 py-2 text-xs text-white">
                  {index + 1} / {project.images.length}
                </span>
                <button
                  type="button"
                  aria-label="Next frame"
                  onClick={() => setIndex((current) => (current + 1) % project.images.length)}
                  className="rounded-full bg-black/70 p-2 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
          <div className="space-y-4 p-5 sm:p-8 lg:col-span-5">
            <p className="text-xs tracking-widest text-[var(--brand)] uppercase">{sector}</p>
            <h2 className="font-brand text-3xl font-black text-white">{project.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{project.solution}</p>
            <div>
              <p className="text-[11px] tracking-wider text-zinc-500 uppercase">The brief</p>
              <p className="mt-1 text-sm text-zinc-400">{project.problem}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.needs.map((need) => (
                <span key={need} className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 capitalize">
                  {need}
                </span>
              ))}
            </div>
            {project.video ? (
              <video controls playsInline preload="metadata" poster={project.images[0]} className="w-full rounded-xl">
                <source src={project.video} type="video/mp4" />
              </video>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

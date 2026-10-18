"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function PieceGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") {
        setIndex((current) => (current === null ? current : (current + 1) % images.length));
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current === null ? current : (current - 1 + images.length) % images.length));
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, images.length]);

  const current = index === null ? null : images[index];

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((src, imageIndex) => (
          <button
            key={src}
            type="button"
            aria-label={`Open ${alt} ${imageIndex + 1}`}
            onClick={() => setIndex(imageIndex)}
            className="overflow-hidden rounded-xl border border-zinc-800"
          >
            <Image
              src={src}
              alt={`${alt} ${imageIndex + 1}`}
              width={900}
              height={1120}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 50vw, 24vw"
            />
          </button>
        ))}
      </div>

      {current ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={alt}>
          <button type="button" aria-label="Close" className="absolute inset-0" onClick={() => setIndex(null)} />
          <figure className="relative z-10 max-h-[88vh] max-w-5xl">
            <Image src={current} alt={`${alt} ${(index ?? 0) + 1}`} width={1400} height={1750} priority className="max-h-[78vh] w-auto object-contain" />
            <figcaption className="mt-2 text-center text-sm text-zinc-300">
              {(index ?? 0) + 1} / {images.length}
            </figcaption>
          </figure>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {images.length > 1 ? (
              <button type="button" className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white" onClick={() => setIndex(((index ?? 0) - 1 + images.length) % images.length)}>
                Previous
              </button>
            ) : null}
            <button type="button" className="rounded-full bg-red-600 px-4 py-2 text-sm text-white" onClick={() => setIndex(null)}>
              Close
            </button>
            {images.length > 1 ? (
              <button type="button" className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white" onClick={() => setIndex(((index ?? 0) + 1) % images.length)}>
                Next
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects, sectors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "B2B. campaigns and identities for automotive, education, real estate, and occasions.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <p className="text-xs tracking-widest text-red-500 uppercase">Archive</p>
      <h1 className="font-brand mt-2 text-4xl font-black text-white md:text-6xl">Shipped work.</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d11] transition hover:-translate-y-1 hover:border-red-500/60"
          >
            <span className="relative block h-56">
              <Image src={project.images[0]} alt={project.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
            </span>
            <span className="block p-4">
              <span className="text-[11px] tracking-wider text-red-400 uppercase">
                {sectors.find((item) => item.id === project.sector)?.label}
              </span>
              <span className="mt-1 block font-brand text-xl font-bold text-white">{project.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

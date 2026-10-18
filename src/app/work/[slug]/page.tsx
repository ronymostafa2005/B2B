import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PieceGallery } from "@/components/PieceGallery";
import { getNextProject, getProject, projects, sectors } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  return {
    title: project.title,
    description: project.solution,
    openGraph: { images: [project.images[0]] },
  };
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);
  const sector = sectors.find((item) => item.id === project.sector)?.label;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <Link href="/#portfolio" className="text-sm text-zinc-400 hover:text-white">
        All work
      </Link>
      <p className="mt-4 text-xs tracking-widest text-red-500 uppercase">
        {sector} · {project.needs.join(" · ")}
      </p>
      <h1 className="font-brand mt-2 text-4xl font-black text-white md:text-6xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-300">{project.solution}</p>
      <PieceGallery images={project.images} alt={project.alt} />
      {project.video ? (
        <div className="mt-6">
          <video controls playsInline preload="metadata" poster={project.images[0]} className="w-full rounded-2xl">
            <source src={project.video} type="video/mp4" />
          </video>
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <p className="rounded-2xl border border-zinc-800 p-5 text-sm text-zinc-300">
          <span className="mb-2 block text-xs font-bold tracking-wider text-red-500 uppercase">Problem</span>
          {project.problem}
        </p>
        <p className="rounded-2xl border border-zinc-800 p-5 text-sm text-zinc-300">
          <span className="mb-2 block text-xs font-bold tracking-wider text-red-500 uppercase">Solution</span>
          {project.solution}
        </p>
      </div>
      <Link href={`/work/${next.slug}`} className="mt-8 flex items-center justify-between rounded-2xl border border-zinc-800 px-5 py-4 hover:border-red-500">
        <span className="text-xs tracking-widest text-zinc-500 uppercase">Next</span>
        <strong className="font-brand text-xl text-white">{next.title}</strong>
      </Link>
    </article>
  );
}

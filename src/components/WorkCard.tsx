import Image from "next/image";
import Link from "next/link";
import { sectors, type Project } from "@/lib/content";

export function WorkCard({
  project,
  picked = false,
  reason,
}: {
  project: Project;
  picked?: boolean;
  reason?: string;
}) {
  const sector = sectors.find((item) => item.id === project.sector)?.label;
  const alt = project.images[1];

  return (
    <article className={`card ${picked ? "is-picked" : ""}`}>
      <Link href={`/work/${project.slug}`} className="card-media" aria-label={project.title}>
        <Image src={project.images[0]} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 30vw" />
        {alt ? (
          <Image className="card-alt" src={alt} alt="" fill sizes="(max-width: 760px) 100vw, 30vw" />
        ) : null}
        <span className="card-tag">{sector}</span>
      </Link>
      <div className="card-copy">
        <h3>
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="ar">{project.arabic}</p>
        {reason ? <p>{reason}</p> : null}
      </div>
    </article>
  );
}

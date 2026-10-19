"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { About } from "@/components/site/About";
import { ContactSection } from "@/components/site/ContactSection";
import { DataStats } from "@/components/site/DataStats";
import { EstimatorPanel } from "@/components/site/EstimatorPanel";
import { Hero } from "@/components/site/Hero";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { ProjectModal } from "@/components/site/ProjectModal";
import { Services } from "@/components/site/Services";
import { StudioBoards } from "@/components/site/StudioBoards";
import type { Project } from "@/lib/content";

const ThreeShowcase = dynamic(() => import("@/components/site/ThreeShowcase").then((mod) => mod.ThreeShowcase), {
  ssr: false,
  loading: () => <div className="h-[620px] border-y border-zinc-900 bg-[#070709] md:h-[740px]" />,
});

export function HomeStage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const open = useCallback((project: Project) => setSelected(project), []);

  return (
    <>
      <Hero onSelectProject={open} />
      <ThreeShowcase onSelectProject={open} />
      <PortfolioGrid onSelectProject={open} />
      <DataStats />
      <Services />
      <StudioBoards />
      <EstimatorPanel />
      <About />
      <ContactSection />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

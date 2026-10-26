"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { About } from "@/components/site/About";
import { ContactSection } from "@/components/site/ContactSection";
import { DataStats } from "@/components/site/DataStats";
import { Hero } from "@/components/site/Hero";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { ProjectModal } from "@/components/site/ProjectModal";
import { Services } from "@/components/site/Services";
import { FlowRoot } from "@/components/site/Flow";
import { SiteIntro } from "@/components/site/SiteIntro";
import { StudioBoards } from "@/components/site/StudioBoards";
import type { Project } from "@/lib/content";
import { useSiteConfig } from "@/context/SiteConfigContext";

const ThreeShowcase = dynamic(() => import("@/components/site/ThreeShowcase").then((mod) => mod.ThreeShowcase), {
  ssr: false,
  loading: () => <div className="h-[620px] border-y border-zinc-900 bg-[#070709] md:h-[740px]" />,
});

export function HomeStage() {
  const { config } = useSiteConfig();
  const [selected, setSelected] = useState<Project | null>(null);
  const open = useCallback((project: Project) => setSelected(project), []);
  const sections = config.sections;

  return (
    <>
      <SiteIntro />
      <FlowRoot>
        {sections.hero.visible !== false && <Hero />}
        {sections.showroom3d.visible !== false && <ThreeShowcase onSelectProject={open} />}
        {sections.portfolio.visible !== false && <PortfolioGrid onSelectProject={open} />}
        {sections.dataStats.visible !== false && <DataStats />}
        {sections.services.visible !== false && <Services />}
        {sections.studioBoards.visible !== false && <StudioBoards />}
        {sections.about.visible !== false && <About />}
        {sections.contact.visible !== false && <ContactSection />}
      </FlowRoot>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

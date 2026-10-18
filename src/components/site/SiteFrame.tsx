"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <SiteFooter />
    </>
  );
}

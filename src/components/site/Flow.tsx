"use client";

import { useEffect, type ReactNode } from "react";

let introFinished = false;

export function markIntroDone() {
  introFinished = true;
  window.dispatchEvent(new Event("b2b-intro-done"));
}

export function FlowRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | null = null;
    let frame = 0;
    const queue: HTMLElement[] = [];

    function reveal(nodes: HTMLElement[]) {
      nodes.forEach((node, index) => {
        node.style.animationDelay = `${Math.min(index, 7) * 80}ms`;
        node.classList.add("flow-in");
      });
    }

    function flush() {
      const batch = queue.splice(0, queue.length);
      reveal(batch);
    }

    let started = false;

    function arm() {
      if (started) return;
      started = true;
      const nodes = [...document.querySelectorAll<HTMLElement>("[data-flow]")].filter((node) => !node.dataset.flowBound);
      if (reduce) {
        nodes.forEach((node) => {
          node.dataset.flowBound = "1";
          node.classList.add("flow-in");
        });
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          let added = false;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            queue.push(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
            added = true;
          }
          if (!added) return;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(flush);
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );
      nodes.forEach((node) => {
        node.dataset.flowBound = "1";
        node.classList.add("flow-ready");
        observer?.observe(node);
      });
    }

    if (introFinished || !document.querySelector("[data-intro]")) arm();
    window.addEventListener("b2b-intro-done", arm);
    return () => {
      window.removeEventListener("b2b-intro-done", arm);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return children;
}

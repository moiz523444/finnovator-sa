"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate, AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { projects } from "@/data/projects";
import { RollingText, SplitHeading } from "../ui";
import ProjectArt from "./ProjectArt";
import { BottomPill, BRAND, BrandMark, CONTACT_EMAIL, TAGLINE, usePortfolioTheme, ViewToggle } from "./chrome";

const ease = [0.16, 1, 0.3, 1] as const;
const n = projects.length;

/* View lives in the URL hash (#grid) so it survives reloads and back navigation. */
function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}
function useView() {
  const view = useSyncExternalStore(
    subscribeHash,
    () => (window.location.hash === "#grid" ? "grid" : "reel"),
    () => "reel" as const,
  );
  const setView = useCallback((v: "grid" | "reel") => {
    history.replaceState(null, "", v === "grid" ? "#grid" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.scrollTo(0, 0);
  }, []);
  return [view, setView] as const;
}

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function useIsMobile() {
  return useSyncExternalStore(subscribeResize, () => window.innerWidth < 768, () => false);
}

/* Centered loading pill; once full it hands its layoutId to the bottom pill. */
function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    // full intro once per session; a quick flash on return visits (e.g. back from a case study)
    let seen = false;
    try {
      seen = sessionStorage.getItem("al-loaded") === "1";
      sessionStorage.setItem("al-loaded", "1");
    } catch {}
    const c = animate(0, 100, {
      duration: seen ? 0.35 : 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => setTimeout(onDone, seen ? 50 : 250),
    });
    return () => c.stop();
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black" exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <motion.div
        layoutId="al-pill"
        transition={{ duration: 0.9, ease }}
        className="relative flex h-[88px] w-[min(480px,86vw)] items-center overflow-hidden rounded-[20px] bg-[#8a8a8a] p-4"
      >
        <div className="absolute inset-y-0 left-0 bg-[#ababab]" style={{ width: `${pct}%` }} />
        <BrandMark className="relative size-14 text-[20px]" />
        <span className="relative ml-auto text-[16px] text-[#2a2a2a] tabular-nums">{pct}%</span>
      </motion.div>
    </motion.div>
  );
}

function Reel({ ready, onGrid }: { ready: boolean; onGrid: () => void }) {
  const router = useRouter();
  const mobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"full" | "strip">("full");
  const lock = useRef(false);
  // the clip-reveal plays only the first time the full frame appears
  const [revealed, setRevealed] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const project = projects[index];

  // Zoom out to the strip, slide to the next project, then zoom back in.
  const go = useCallback((d: number) => {
    if (lock.current) return;
    lock.current = true;
    setMode("strip");
    setTimeout(() => setIndex((i) => (i + d + n) % n), 520);
    setTimeout(() => setMode("full"), 1250);
    setTimeout(() => (lock.current = false), 1900);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) > 18) go(delta > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [ready, go]);

  // Strip geometry (vw units): small thumbnails either side of a large active card.
  const small = mobile ? 22 : 15;
  const large = mobile ? 72 : 46;
  const gap = mobile ? 3 : 2;
  const pos = (i: number) => {
    const activeLeft = 50 - large / 2;
    if (i === index) return activeLeft;
    if (i < index) return activeLeft - (index - i) * (small + gap);
    return activeLeft + large + gap + (i - index - 1) * (small + gap);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-white"
      data-lenis-prevent
      onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        if (!touch.current || e.pointerType === "mouse") return;
        const dx = e.clientX - touch.current.x;
        const dy = e.clientY - touch.current.y;
        const d = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
        if (Math.abs(d) > 40) go(d > 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <LayoutGroup>
        {mode === "full" ? (
          <motion.div
            key="full"
            layoutId={`frame-${project.slug}`}
            initial={revealed ? false : { clipPath: "inset(30% 25% 30% 25% round 14px)", opacity: 0 }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 14px)", opacity: 1 } : undefined}
            onAnimationComplete={() => ready && setRevealed(true)}
            transition={{ duration: 1, ease }}
            style={{ borderRadius: 14 }}
            className="absolute inset-2 overflow-hidden"
          >
            <Link href={`/portfolio/${project.slug}`} aria-label={`View ${project.title} case study`} data-cursor="View" className="absolute inset-0">
              <ProjectArt project={project} sizes="100vw" priority />
              <span className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </Link>
          </motion.div>
        ) : (
          projects.map((p, i) => {
            const w = i === index ? large : small;
            return (
              <motion.div
                key={p.slug}
                layoutId={`frame-${p.slug}`}
                layout
                initial={i === index ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease }}
                style={{
                  left: `${pos(i)}vw`,
                  width: `${w}vw`,
                  top: `calc(50% - ${(w * 10) / 32}vw)`,
                  borderRadius: 10,
                }}
                className="absolute aspect-[16/10] overflow-hidden"
              >
                <ProjectArt project={p} sizes="50vw" />
              </motion.div>
            );
          })
        )}
      </LayoutGroup>

      {/* overlay chrome (only over the full frame) */}
      <AnimatePresence>
        {ready && mode === "full" && (
          <motion.div
            key={`overlay-${index}`}
            className="pointer-events-none absolute inset-2 z-10 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="flex items-start justify-between p-4 text-[13px] sm:p-5">
              <Link href="/portfolio" className="pointer-events-auto font-medium">
                {BRAND}
              </Link>
              <span className="hidden text-right whitespace-nowrap sm:block">{TAGLINE}</span>
            </div>

            <div className="absolute top-1/2 left-4 max-w-[min(560px,80vw)] -translate-y-1/2 sm:left-5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease }}
                className="mb-3 text-[13px] text-white/75"
              >
                {project.industry} — {project.year}
              </motion.p>
              <SplitHeading
                as="h1"
                play
                delay={0.4}
                text={project.title}
                className="text-[clamp(34px,4.2vw,64px)] leading-[1.02] font-medium tracking-[-0.045em]"
              />
            </div>

            <div className="absolute bottom-4 left-4 rounded-[8px] bg-white/20 px-2.5 py-1.5 text-[13px] font-medium tabular-nums backdrop-blur-md sm:bottom-5 sm:left-5">
              {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* progress dots, right edge */}
      {ready && (
        <div className="absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 flex-col gap-2 md:flex">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              aria-label={`Show ${p.title}`}
              onClick={() => i !== index && go(i - index)}
              className="group grid size-4 cursor-pointer place-items-center"
            >
              <span className={`block rounded-full transition-all duration-500 ${i === index ? "h-4 w-1.5 bg-white" : "size-1.5 bg-white/50 group-hover:bg-white"}`} />
            </button>
          ))}
        </div>
      )}

      {ready && (
        <BottomPill
          thumb={<ProjectArt project={project} variant={project.art} sizes="40px" />}
          label="View Case Study"
          href={`/portfolio/${project.slug}`}
          menu={[
            { label: "Grid view", onClick: onGrid },
            { label: "Next project", onClick: () => go(1) },
            { label: "Finnovator site", href: "/" },
            { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
          ]}
        />
      )}
      <span className="sr-only" aria-live="polite">
        {project.title}
      </span>
      {/* Enter key opens the active case study */}
      <KeyOpen onOpen={() => router.push(`/portfolio/${project.slug}`)} active={ready && mode === "full"} />
    </div>
  );
}

function KeyOpen({ onOpen, active }: { onOpen: () => void; active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === document.body) onOpen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen, active]);
  return null;
}

function GridCard({ index }: { index: number }) {
  const p = projects[index];
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.1, ease }}
    >
      <Link href={`/portfolio/${p.slug}`} data-cursor="View" className="group block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[10px] bg-black/5">
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]">
            <ProjectArt project={p} />
          </div>
          <span className="absolute top-3 left-3 rounded-full bg-white/70 px-2.5 py-1 text-[12px] text-[#111] opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
            {p.industry}
          </span>
        </div>
        <div className="mt-4 grid gap-1 px-1 pb-6 sm:grid-cols-[1fr_1.2fr] sm:gap-6">
          <h3 className="text-[18px] font-medium tracking-[-0.03em] text-[#111]">
            <RollingText text={p.title} />
          </h3>
          <p className="text-[15px] leading-[1.45] text-black/55">{p.summary}</p>
        </div>
      </Link>
    </motion.li>
  );
}

function Grid({ onReel }: { onReel: () => void }) {
  return (
    <div className="min-h-screen bg-white px-2 pt-[150px] pb-40 text-[#111] sm:pt-[180px]">
      <div className="px-2 pb-14 sm:pb-16">
        <p className="mb-6 text-[13px] text-black/45">
          {BRAND} — Selected work ({projects.length})
        </p>
        <SplitHeading
          as="h1"
          text="Landing pages that launch|brands and *grow* businesses."
          className="max-w-[900px] text-[clamp(36px,4.6vw,64px)] leading-[1.05] font-normal tracking-[-0.045em]"
        />
      </div>
      <ul className="grid gap-x-2 sm:grid-cols-2">
        {projects.map((p, i) => (
          <GridCard key={p.slug} index={i} />
        ))}
      </ul>
      <BottomPill
        thumb={<BrandMark className="size-10 text-[15px]" />}
        label="Start a project"
        href={`mailto:${CONTACT_EMAIL}`}
        menu={[
          { label: "Reel view", onClick: onReel },
          { label: "Finnovator site", href: "/" },
          { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
        ]}
      />
    </div>
  );
}

export default function PortfolioView() {
  usePortfolioTheme();
  const [view, setView] = useView();
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);

  return (
    <div data-theme="light" className="bg-white">
      <AnimatePresence>{!loaded && <Loader key="loader" onDone={done} />}</AnimatePresence>

      {view === "reel" ? (
        <Reel ready={loaded} onGrid={() => setView("grid")} />
      ) : (
        loaded && <Grid onReel={() => setView("reel")} />
      )}

      <AnimatePresence mode="wait">
        {loaded &&
          (view === "reel" ? (
            // reel: switch sits bottom-right, level with the pill
            <motion.div
              key="toggle-reel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className="fixed right-4 bottom-[22px] z-[65] hidden sm:right-5 sm:bottom-[30px] md:block"
            >
              <ViewToggle view={view} onChange={setView} tone="dark" />
            </motion.div>
          ) : (
            // grid: glassy top bar so the brand and switch never sit on top of content
            <motion.header
              key="bar-grid"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="fixed inset-x-0 top-0 z-[65] flex items-center justify-between border-b border-black/[0.06] bg-white/70 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 sm:px-5"
            >
              <Link href="/portfolio" className="text-[13px] font-medium text-[#111]">
                {BRAND}
              </Link>
              <ViewToggle view={view} onChange={setView} />
            </motion.header>
          ))}
      </AnimatePresence>
    </div>
  );
}

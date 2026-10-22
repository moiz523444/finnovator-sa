"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useSpring } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/* True once the preloader has lifted (html[data-intro="done"]). */
function subscribeIntro(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
  return () => mo.disconnect();
}

export function useIntroReady() {
  return useSyncExternalStore(
    subscribeIntro,
    () => document.documentElement.dataset.intro === "done",
    () => false,
  );
}

/* Letters roll up on hover (stagger driven by --i, see globals.css). */
export function RollingText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {text.split("").map((char, i) => (
          <span key={i} className="roll-char" style={{ "--i": i } as React.CSSProperties}>
            <span>{char === " " ? " " : char}</span>
            <span>{char === " " ? " " : char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/* Pulls its child toward the cursor while hovered. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });
  return (
    <motion.div
      style={{ x, y }}
      className={`inline-flex ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

type ButtonProps = {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export function PillButton({ href, children, variant = "primary", size = "md", className = "", onClick }: ButtonProps) {
  const sizes = size === "lg" ? "h-[50px] px-7 text-[15px]" : "h-[44px] px-6 text-[14px]";
  const variants =
    variant === "primary"
      ? "btn-shine bg-inverse text-on-inverse shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_1px_2px_rgb(0_0_0/0.2)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_14px_40px_-12px_var(--fn-accent)]"
      : "border border-line-strong bg-fg/[0.04] text-fg backdrop-blur-md hover:-translate-y-0.5 hover:border-fg/25";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[border-color,box-shadow,transform] duration-500 ease-out-expo active:translate-y-0 active:scale-[0.97] ${sizes} ${variants} ${className}`}
    >
      {variant === "secondary" && (
        // soft fill that rises from the bottom on hover
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-full origin-bottom scale-y-0 rounded-full bg-fg/[0.09] transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
        />
      )}
      <RollingText text={children} />
    </Link>
  );
}

/* Fade + lift + un-blur when the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Comp>
  );
}

/*
 * Heading whose words rise out of a mask, one after another.
 * Markup inside `text`:  |  line break,  *word*  serif italic accent,  ~word~  muted.
 */
export function SplitHeading({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  play,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  /** When provided, animation is driven by this flag instead of scrolling into view. */
  play?: boolean;
}) {
  const plain = text.replace(/[*~]/g, "").replace(/\|/g, " ");
  const MotionTag = motion[Tag];
  // The heading itself is observed (its words start clipped out of view, so they can't be).
  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } }
      : { animate: play ? "show" : "hidden" };
  let n = 0;
  return (
    <MotionTag className={className} initial="hidden" {...trigger}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {text.split("|").map((line, li) => (
          <span key={li} className="block">
            {line
              .trim()
              .split(" ")
              .map((raw, wi) => {
                const accent = raw.includes("*");
                const muted = raw.includes("~");
                const word = raw.replace(/[*~]/g, "");
                const i = n++;
                return (
                  <React.Fragment key={wi}>
                  {wi > 0 && " "}
                  <span className="inline-block overflow-hidden pr-[0.06em] pb-[0.14em] -mb-[0.14em] align-bottom">
                    <motion.span
                      className={`inline-block origin-bottom-left ${accent ? "accent-serif" : ""} ${muted ? "text-subtle" : ""}`}
                      variants={{
                        hidden: { y: "115%", rotate: 4 },
                        show: { y: "0%", rotate: 0, transition: { duration: 1.1, delay: delay + i * 0.06, ease } },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  </React.Fragment>
                );
              })}
          </span>
        ))}
      </span>
    </MotionTag>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[-0.01em] text-subtle">
      <span className="tabular-nums text-fg">{index}</span>
      <motion.span
        className="h-px w-6 origin-left bg-line-strong"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
      />
      <span>{children}</span>
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 ${className}`}>{children}</div>;
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`group/logo inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 28 28" className="h-6 w-6 transition-transform duration-700 ease-out-expo group-hover/logo:rotate-[-8deg]" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="currentColor" />
        <path d="M9 20V8h10" stroke="var(--fn-bg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M9 14h7" stroke="var(--fn-bg)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="20" cy="19.5" r="2.2" fill="var(--fn-accent)" />
      </svg>
      <span className="text-[19px] font-medium tracking-[-0.04em]">finnovator</span>
    </span>
  );
}

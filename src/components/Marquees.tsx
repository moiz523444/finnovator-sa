"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Container } from "./ui";

// PLACEHOLDER partner names — swap for real client/partner logos (SVG) when available.
const partners = [
  { name: "Lumen Bank", shape: "circle" },
  { name: "Sahra Capital", shape: "square" },
  { name: "Qafila Retail", shape: "diamond" },
  { name: "Waha Telecom", shape: "circle" },
  { name: "Noor Logistics", shape: "square" },
  { name: "Falcon Insure", shape: "diamond" },
  { name: "Dune Ventures", shape: "circle" },
];

function Mark({ shape }: { shape: string }) {
  if (shape === "circle") return <span className="size-5 rounded-full border-[5px] border-current" />;
  if (shape === "square") return <span className="size-4.5 rounded-[5px] bg-current" />;
  return <span className="size-4 rotate-45 rounded-[3px] bg-current" />;
}

export function PartnersMarquee() {
  return (
    <section aria-label="Trusted by" className="py-14 sm:py-20">
      <Container>
        <p className="mb-8 text-center text-[13px] text-subtle">Trusted by banks, merchants and fintech teams across the Kingdom</p>
      </Container>
      <div className="marquee mask-x flex overflow-hidden">
        <div className="marquee-track flex w-max shrink-0" data-pause="true" style={{ "--marquee-duration": "45s" } as React.CSSProperties}>
          {[0, 1].map((copy) => (
            <span key={copy} aria-hidden={copy === 1} className="flex">
              {partners.map((p) => (
                <span
                  key={p.name}
                  className="mx-6 flex items-center gap-2.5 text-[20px] font-medium tracking-[-0.03em] whitespace-nowrap text-subtle opacity-70 transition-[color,opacity] duration-300 hover:text-fg hover:opacity-100 sm:mx-10"
                >
                  <Mark shape={p.shape} />
                  {p.name}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/* Marquee that speeds up and reverses with scroll velocity. */
function VelocityRow({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 2.5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * Math.abs(move) * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="mask-x flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="flex w-max shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} aria-hidden={i > 0} className="flex">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const tickerItems = ["Digital Payments", "Embedded Lending", "Open Banking APIs", "Fraud & Compliance", "Treasury Automation"];

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[0.42em] shrink-0 text-accent">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Ticker() {
  return (
    <section aria-label="Capabilities" className="relative overflow-hidden border-y border-line bg-surface/40 py-7 sm:py-9">
      <VelocityRow baseVelocity={-1.6}>
        {tickerItems.map((t) => (
          <span
            key={t}
            className="flex items-center gap-[clamp(28px,3.4vw,56px)] pr-[clamp(28px,3.4vw,56px)] text-[clamp(30px,4.2vw,60px)] leading-[1.15] font-medium tracking-[-0.045em] text-fg-strong"
          >
            <span className="transition-colors duration-300 hover:text-fg">{t}</span>
            <Spark />
          </span>
        ))}
      </VelocityRow>
    </section>
  );
}

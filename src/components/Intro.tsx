"use client";

import React, { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Container, Magnetic, PillButton, Reveal, SectionLabel, SplitHeading } from "./ui";

// *word* renders in the serif accent face.
const statement =
  "Finnovator builds the *rails* modern finance runs on. We combine payments, lending and open banking into one secure platform, so banks and businesses can launch faster, stay compliant and grow with *confidence.*";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  const accent = children.includes("*");
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${accent ? "accent-serif text-accent" : ""}`}>
      {children.replace(/\*/g, "")}
    </motion.span>
  );
}

/* Circular text badge that spins with scroll. */
function SpinBadge() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const text = "SECURE • COMPLIANT • REAL-TIME • ";
  return (
    <div className="relative grid size-[120px] place-items-center">
      <motion.svg style={{ rotate }} viewBox="0 0 100 100" className="absolute inset-0 text-subtle">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="9" letterSpacing="2.4" fill="currentColor">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </motion.svg>
      <span className="grid size-11 place-items-center rounded-full bg-inverse text-on-inverse">✦</span>
    </div>
  );
}

export default function Intro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");

  return (
    <section id="about" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <SectionLabel index="01">About us</SectionLabel>
            </Reveal>
            <Reveal delay={0.1} className="hidden lg:block">
              <SpinBadge />
            </Reveal>
          </div>
          <div>
            <SplitHeading
              text="Built for *trust.* Designed for *speed.*"
              className="mb-8 text-[clamp(18px,1.6vw,22px)] font-medium tracking-[-0.02em] text-muted"
            />
            <p ref={ref} className="text-[clamp(28px,3.6vw,52px)] leading-[1.12] font-medium tracking-[-0.04em] text-fg">
              {words.map((w, i) => {
                const start = i / words.length;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                    {w}
                  </Word>
                );
              })}
            </p>
            <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <PillButton href="#approach">About us</PillButton>
              </Magnetic>
              <Magnetic>
                <PillButton href="#works" variant="secondary">
                  See the platform
                </PillButton>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

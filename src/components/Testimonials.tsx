"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Reveal, SectionLabel, SplitHeading } from "./ui";

// PLACEHOLDER stats and quotes — replace with real, verifiable numbers and client testimonials.
const stats = [
  { value: 120, suffix: "+", label: "Businesses onboarded" },
  { value: 99.99, suffix: "%", label: "Platform uptime", decimals: 2 },
  { value: 40, suffix: "+", label: "Integrations live" },
];

const quotes = [
  {
    quote: "Placeholder testimonial. Replace with a real quote from a client about how Finnovator helped them launch payments faster.",
    name: "Client Name",
    role: "Head of Payments, Company",
  },
  {
    quote: "Placeholder testimonial. Replace with a real quote about the lending product, onboarding experience or support team.",
    name: "Client Name",
    role: "CFO, Company",
  },
  {
    quote: "Placeholder testimonial. Replace with a real quote about the open banking APIs, developer experience or reliability.",
    name: "Client Name",
    role: "CTO, Company",
  },
];

const AUTOPLAY_MS = 7000;

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => c.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => (i + d + quotes.length) % quotes.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const q = quotes[index];
  const initials = q.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <section id="testimonials" className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* soft glow behind the glass card */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1100px]">
        <span className="top-[30%] left-[12%] h-[300px] w-[420px] bg-[#1d5fff]/30" style={{ animation: "aurora-a 18s ease-in-out infinite" }} />
        <span className="right-[10%] bottom-[15%] h-[280px] w-[380px] bg-[#7a3cff]/20" style={{ animation: "aurora-b 22s ease-in-out infinite" }} />
      </div>

      <Container>
        <div className="mb-14 text-center">
          <Reveal>
            <SectionLabel index="06">Testimonials</SectionLabel>
          </Reveal>
          <SplitHeading
            text="Trusted by teams|who *move* money"
            className="mx-auto max-w-[820px] text-[clamp(34px,4.4vw,64px)] leading-[1.02] font-medium tracking-[-0.05em] text-fg"
          />
        </div>

        <Reveal>
          <div
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            className="spotlight shine-border relative mx-auto max-w-[1000px] rounded-[28px] border border-line bg-surface/40 p-7 backdrop-blur-xl sm:p-12"
          >
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[220px_1fr]">
              {/* stats */}
              <div className="grid grid-cols-3 gap-4 border-b border-line pb-8 md:flex md:flex-col md:gap-7 md:border-r md:border-b-0 md:pr-8 md:pb-0">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-[clamp(28px,3.4vw,42px)] leading-none font-medium tracking-[-0.05em] text-fg">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                    </div>
                    <div className="mt-1.5 text-[12px] text-muted sm:text-[13px]">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* quote carousel */}
              <div className="flex min-w-0 flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[13px] tracking-wider text-muted tabular-nums">
                    {String(index + 1).padStart(2, "0")} / {String(quotes.length).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] tracking-[0.2em] text-[#f5b544]" aria-label="5 out of 5 stars">
                    ★★★★★
                  </span>
                </div>

                <div className="relative min-h-[230px] sm:min-h-[200px]">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.figure
                      key={index}
                      initial={{ opacity: 0, x: dir * 30, filter: "blur(6px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: dir * -30, filter: "blur(6px)" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span aria-hidden="true" className="accent-serif block h-8 text-[72px] leading-[0.9] text-accent">
                        &ldquo;
                      </span>
                      <blockquote className="text-[clamp(18px,2vw,23px)] leading-[1.55] text-fg">{q.quote}</blockquote>
                      <figcaption className="mt-8 flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-full border border-accent/40 bg-accent-soft text-[13px] font-medium text-accent">
                          {initials}
                        </span>
                        <span>
                          <span className="block text-[15px] font-medium text-fg">{q.name}</span>
                          <span className="block text-[13px] text-muted">{q.role}</span>
                        </span>
                      </figcaption>
                    </motion.figure>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  {/* progress dots; the active one fills over the autoplay interval */}
                  <div className="flex gap-1.5">
                    {quotes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDir(i > index ? 1 : -1);
                          setIndex(i);
                        }}
                        aria-label={`Show testimonial ${i + 1}`}
                        className="relative h-1 w-8 cursor-pointer overflow-hidden rounded-full bg-fg/15"
                      >
                        {i === index && (
                          <motion.span
                            key={`${index}-${paused}`}
                            className="absolute inset-y-0 left-0 rounded-full bg-fg"
                            initial={{ width: paused ? "100%" : "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {[
                      { d: -1, Icon: ArrowLeft, label: "Previous testimonial" },
                      { d: 1, Icon: ArrowRight, label: "Next testimonial" },
                    ].map(({ d, Icon, label }) => (
                      <button
                        key={label}
                        onClick={() => go(d)}
                        aria-label={label}
                        className="grid size-10 cursor-pointer place-items-center rounded-full border border-line-strong text-fg transition-all duration-300 hover:bg-inverse hover:text-on-inverse active:scale-95"
                      >
                        <Icon className="size-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

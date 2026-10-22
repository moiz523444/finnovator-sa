"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, BadgeCheck, Check, CreditCard, Fingerprint, TrendingUp, Wallet } from "lucide-react";
import { Container, Magnetic, PillButton, SplitHeading, useIntroReady } from "./ui";

const ease = [0.16, 1, 0.3, 1] as const;

const chartPoints = [38, 44, 40, 52, 49, 61, 57, 66, 63, 74, 70, 82, 79, 90];

function chartPath(w: number, h: number) {
  const step = w / (chartPoints.length - 1);
  return chartPoints
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`)
    .join(" ");
}

const transactions = [
  { name: "Merchant payout", meta: "Riyadh · POS", amount: "+12,480.00", in: true },
  { name: "Supplier invoice", meta: "Jeddah · SADAD", amount: "-3,215.50", in: false },
  { name: "Card settlement", meta: "Mada · Batch 0412", amount: "+8,904.25", in: true },
];

/* Press & hold to approve: fills a ring, then shows a confirmation. */
function HoldToPay() {
  const progress = useMotionValue(0);
  const [done, setDone] = useState(false);
  const ctrl = useRef<ReturnType<typeof animate> | null>(null);
  const dash = useTransform(progress, [0, 1], [113, 0]);
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);

  const start = () => {
    if (done) return;
    ctrl.current?.stop();
    ctrl.current = animate(progress, 1, {
      duration: 1.2,
      ease: "linear",
      onComplete: () => {
        setDone(true);
        setTimeout(() => {
          setDone(false);
          progress.set(0);
        }, 2200);
      },
    });
  };
  const cancel = () => {
    if (done) return;
    ctrl.current?.stop();
    ctrl.current = animate(progress, 0, { duration: 0.4, ease: "easeOut" });
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && start()}
      onKeyUp={cancel}
      data-cursor="Hold"
      className="group relative flex w-full cursor-pointer touch-none items-center gap-3 overflow-hidden rounded-2xl border border-line-strong bg-surface-3 p-3 text-left transition-colors select-none hover:border-fg/30"
    >
      <motion.span style={{ width: fill }} className="absolute inset-y-0 left-0 bg-accent-soft" />
      <span className="relative grid size-10 shrink-0 place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--fn-border-strong)" strokeWidth="2" />
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke={done ? "var(--fn-positive)" : "var(--fn-accent)"}
            strokeWidth="2"
            strokeDasharray="113"
            style={{ strokeDashoffset: dash }}
            strokeLinecap="round"
          />
        </svg>
        {done ? <Check className="size-4 text-positive" /> : <Fingerprint className="size-4 text-fg" />}
      </span>
      <span className="relative flex flex-col">
        <span className="text-[13px] font-medium text-fg">{done ? "Payment approved" : "Press & hold to approve"}</span>
        <span className="text-[11px] text-subtle">{done ? "Settled instantly · Ref FN-20419" : "SAR 3,215.50 to Al-Noor Supplies"}</span>
      </span>
    </button>
  );
}

function Balance({ ready }: { ready: boolean }) {
  const value = useMotionValue(0);
  const [text, setText] = useState("0.00");

  useEffect(() => {
    if (!ready) return;
    const c = animate(value, 1284592.4, { duration: 2.4, delay: 0.9, ease });
    const unsub = value.on("change", (v) =>
      setText(v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
    );
    return () => {
      c.stop();
      unsub();
    };
  }, [value, ready]);

  return (
    <div className="text-[clamp(26px,3.6vw,40px)] font-medium tracking-[-0.04em] text-fg tabular-nums">
      <span className="mr-1.5 text-[0.55em] text-subtle">SAR</span>
      {text}
    </div>
  );
}

function FloatingChip({
  children,
  className,
  delay,
  ready,
  breathe,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  ready: boolean;
  breathe: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 1, delay, ease }}
      className={`absolute z-20 hidden lg:block ${className}`}
    >
      <div
        className="breathe flex items-center gap-3 rounded-2xl border border-line-strong bg-surface/80 px-4 py-3 shadow-2xl backdrop-blur-xl"
        style={{ "--breathe-duration": breathe } as React.CSSProperties}
      >
        {children}
      </div>
    </motion.div>
  );
}

function DashboardMock({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  // subtle cursor tilt
  const mx = useSpring(0, { stiffness: 120, damping: 20 });
  const my = useSpring(0, { stiffness: 120, damping: 20 });
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    my.set(((e.clientY - r.top) / r.height - 0.5) * -6);
  };

  const W = 520;
  const H = 150;
  const path = chartPath(W, H);

  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-[1080px] [perspective:1400px] sm:mt-20">
      <FloatingChip ready={ready} delay={1.5} breathe="6s" className="-top-16 left-[3%]">
        <span className="grid size-9 place-items-center rounded-full bg-positive/15 text-positive">
          <BadgeCheck className="size-4.5" />
        </span>
        <span className="text-left">
          <span className="block text-[13px] font-medium text-fg">KYC verified</span>
          <span className="block text-[11px] text-subtle">in 38 seconds</span>
        </span>
      </FloatingChip>
      <FloatingChip ready={ready} delay={1.7} breathe="7.5s" className="-top-16 right-[3%]">
        <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
          <TrendingUp className="size-4.5" />
        </span>
        <span className="text-left">
          <span className="block text-[13px] font-medium text-fg tabular-nums">+SAR 8,904.25</span>
          <span className="block text-[11px] text-subtle">Settled · just now</span>
        </span>
      </FloatingChip>

      <motion.div
        style={{ rotateX, scale }}
        initial={{ opacity: 0, y: 80 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.4, delay: 0.55, ease }}
      >
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          style={{ rotateY: mx, rotateX: my }}
          className="shine-border relative rounded-[22px] border border-line-strong bg-surface/90 p-2.5 text-left shadow-[0_40px_120px_-40px_rgba(47,140,255,0.45)] backdrop-blur-xl sm:p-3"
          data-shine="on"
        >
          {/* window bar */}
          <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-fg/15" />
              <span className="size-2.5 rounded-full bg-fg/15" />
              <span className="size-2.5 rounded-full bg-fg/15" />
            </div>
            <div className="truncate rounded-full border border-line bg-surface-2 px-3 py-1 text-[11px] text-subtle">
              app.finnovator.sa/treasury
            </div>
            <div className="hidden items-center gap-1.5 text-[11px] text-subtle sm:flex">
              <span className="relative flex size-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-positive" />
                <span className="relative size-2 rounded-full bg-positive" />
              </span>
              Live
            </div>
          </div>

          <div className="grid gap-2.5 sm:gap-3 md:grid-cols-[1.6fr_1fr]">
            {/* balance + chart */}
            <div className="spotlight relative overflow-hidden rounded-2xl border border-line bg-bg p-4 sm:p-6">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-subtle">Total liquidity</span>
                  <span className="rounded-full bg-positive/15 px-2 py-0.5 text-[11px] font-medium text-positive">+18.4%</span>
                </div>
                <Balance ready={ready} />
                <div className="mt-4 sm:mt-6">
                  <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--fn-accent)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--fn-accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={`${path} L${W},${H} L0,${H} Z`}
                      fill="url(#hero-area)"
                      initial={{ opacity: 0 }}
                      animate={ready ? { opacity: 1 } : undefined}
                      transition={{ duration: 1.2, delay: 1.6 }}
                    />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="var(--fn-accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={ready ? { pathLength: 1 } : undefined}
                      transition={{ duration: 2, delay: 1, ease }}
                    />
                  </svg>
                  <div className="mt-2 flex justify-between text-[10px] text-subtle">
                    {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* side column */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <div className="group/card relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-accent/90 to-[#0b2a66] p-4 text-white">
                <div className="flex items-center justify-between text-[11px] opacity-80">
                  <span>Corporate card</span>
                  <CreditCard className="size-4" />
                </div>
                <div className="mt-6 font-mono text-[14px] tracking-[0.18em]">•••• 4021</div>
                <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
                  <span>Placeholder Co.</span>
                  <span>09/29</span>
                </div>
                <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-white/15 blur-2xl" />
                {/* card sheen */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.35)_50%,transparent_65%)] transition-transform duration-[1.2s] ease-out-expo group-hover/card:translate-x-full" />
              </div>

              <div className="rounded-2xl border border-line bg-bg p-3">
                <div className="mb-2 flex items-center justify-between px-1 text-[11px] text-subtle">
                  <span>Recent activity</span>
                  <Wallet className="size-3.5" />
                </div>
                <ul className="flex flex-col">
                  {transactions.map((t, i) => (
                    <motion.li
                      key={t.name}
                      initial={{ opacity: 0, x: 12 }}
                      animate={ready ? { opacity: 1, x: 0 } : undefined}
                      transition={{ delay: 1.4 + i * 0.12, duration: 0.6, ease }}
                      className="flex items-center gap-2.5 rounded-xl px-1 py-2 transition-colors hover:bg-surface-2"
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full ${
                          t.in ? "bg-positive/15 text-positive" : "bg-fg/10 text-fg"
                        }`}
                      >
                        {t.in ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium text-fg">{t.name}</span>
                        <span className="block truncate text-[10px] text-subtle">{t.meta}</span>
                      </span>
                      <span className={`text-[12px] font-medium tabular-nums ${t.in ? "text-positive" : "text-fg"}`}>{t.amount}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <HoldToPay />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Aurora({ ready }: { ready: boolean }) {
  // the glow drifts gently with the cursor
  const px = useSpring(0, { stiffness: 40, damping: 20 });
  const py = useSpring(0, { stiffness: 40, damping: 20 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 60);
      py.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 2.4, ease }}
      style={{ x: px, y: py }}
      className="aurora pointer-events-none absolute inset-x-0 top-[-180px] -z-10 mx-auto h-[720px] max-w-[1200px]"
    >
      <span className="top-[10%] left-[18%] h-[380px] w-[480px] bg-[#1d5fff]/45" style={{ animation: "aurora-a 16s ease-in-out infinite" }} />
      <span className="top-[18%] right-[14%] h-[340px] w-[420px] bg-[#7a3cff]/30" style={{ animation: "aurora-b 19s ease-in-out infinite" }} />
      <span className="top-[34%] left-[38%] h-[300px] w-[380px] bg-[#00c2ff]/25" style={{ animation: "aurora-c 22s ease-in-out infinite" }} />
    </motion.div>
  );
}

export default function Hero() {
  const ready = useIntroReady();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={sectionRef} id="top" className="relative isolate overflow-hidden pt-[clamp(120px,17vh,190px)] pb-16 text-center sm:pb-24">
      <Aurora ready={ready} />
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" />

      <Container>
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 py-1.5 pr-3.5 pl-1.5 text-[12px] font-medium tracking-[-0.01em] text-muted backdrop-blur"
          >
            <span className="rounded-full bg-inverse px-2 py-0.5 text-[11px] text-on-inverse">New</span>
            Payments &bull; Lending &bull; Open Banking
          </motion.div>

          <SplitHeading
            as="h1"
            play={ready}
            delay={0.12}
            text="Finance, *Engineered*|~for~ ~What's~ ~Next~"
            className="mx-auto max-w-[1100px] text-[clamp(44px,8.4vw,124px)] leading-[0.98] font-medium tracking-[-0.055em] text-fg"
          />

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mx-auto mt-7 max-w-[560px] text-[clamp(16px,1.6vw,19px)] leading-[1.55] text-muted"
          >
            Payment, lending and treasury infrastructure for banks, merchants and fintechs. Fast to launch, secure by default, built for Saudi Arabia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.68, ease }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic>
              <PillButton href="#contact" size="lg">Book a demo</PillButton>
            </Magnetic>
            <Magnetic>
              <PillButton href="#works" size="lg" variant="secondary">Explore platform</PillButton>
            </Magnetic>
          </motion.div>
        </motion.div>

        <DashboardMock ready={ready} />
      </Container>
    </section>
  );
}

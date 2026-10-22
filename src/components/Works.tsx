"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Banknote, Link2, ShieldCheck } from "lucide-react";
import { Container, PillButton, Reveal, SectionLabel, SplitHeading } from "./ui";

/* Flowing sine lines + drifting particles, drawn behind the section title. */
function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      t += 0.012;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--fn-accent").trim() || "#2f8cff";
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      for (let i = 0; i < 14; i++) {
        const baseY = h * 0.28 + i * (h * 0.034);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const y = baseY + Math.sin(x * 0.0055 + t + i * 0.35) * 26 + Math.sin(x * 0.0021 - t * 0.6) * 18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 0.08 + (i / 14) * 0.22;
        ctx.strokeStyle = accent;
        ctx.stroke();
      }

      ctx.fillStyle = accent;
      for (const p of particles) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        const pulse = Math.sin(t * 2 + p.phase) * 0.4 + 0.8;
        ctx.globalAlpha = 0.5 * pulse;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    if (reduce) {
      t = 1;
      draw();
      cancelAnimationFrame(raf);
    } else draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

type Product = {
  name: string;
  tag: string;
  desc: string;
  icon: React.ElementType;
  stat: string;
  statLabel: string;
  tone: string;
};

const products: Product[] = [
  {
    name: "Finnovator Pay",
    tag: "Payments",
    desc: "Accept Mada, cards, wallets and instant transfers through one checkout and one settlement report.",
    icon: Banknote,
    stat: "<300ms",
    statLabel: "Authorisation time",
    tone: "from-[#2f8cff] via-[#1746a8] to-[#050b1c]",
  },
  {
    name: "Finnovator Lend",
    tag: "Lending",
    desc: "Embedded BNPL and SME credit with automated decisioning, collections and Shariah-compliant products.",
    icon: BadgeCheck,
    stat: "90 sec",
    statLabel: "Credit decision",
    tone: "from-[#2fd28a] via-[#0f6b4a] to-[#03140d]",
  },
  {
    name: "Finnovator Connect",
    tag: "Open Banking",
    desc: "Secure account information and payment initiation APIs, with consent flows your users can trust.",
    icon: Link2,
    stat: "1 API",
    statLabel: "Every bank account",
    tone: "from-[#a77bff] via-[#4b2a99] to-[#0d0620]",
  },
  {
    name: "Finnovator Shield",
    tag: "Risk & Compliance",
    desc: "Real-time fraud scoring, KYC/KYB and AML monitoring, built to support local regulatory requirements.",
    icon: ShieldCheck,
    stat: "24/7",
    statLabel: "Transaction monitoring",
    tone: "from-[#ff8a3d] via-[#99421a] to-[#1c0a03]",
  },
];

function ProductCard({ p, index }: { p: Product; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const tileY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const Icon = p.icon;

  return (
    <Reveal delay={(index % 2) * 0.12} className={index % 2 === 1 ? "md:mt-28" : ""}>
      <Link ref={ref} href="#contact" data-cursor="Explore" className="group relative block">
        <motion.div
          initial={{ clipPath: "inset(12% 12% 12% 12% round 22px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="shine-border spotlight relative aspect-[4/3.2] rounded-[22px] border border-line bg-surface"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[22px]">
          <motion.div
            style={{ y: bgY }}
            className={`absolute -inset-[10%] bg-gradient-to-br ${p.tone} transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]`}
          />
          <div className="dot-grid absolute inset-0 opacity-40 mix-blend-overlay" />
          {/* mock UI tile */}
          <motion.div
            style={{ y: tileY }}
            className="absolute inset-x-[10%] top-[16%] bottom-[16%] flex flex-col justify-between rounded-2xl border border-white/15 bg-black/25 p-5 text-white backdrop-blur-md transition-[scale] duration-[1.2s] ease-out-expo group-hover:scale-[1.03] sm:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-white/15">
                <Icon className="size-5" />
              </span>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px]">{p.tag}</span>
            </div>
            <div>
              <div className="text-[clamp(32px,4.4vw,56px)] leading-none font-medium tracking-[-0.05em]">{p.stat}</div>
              <div className="mt-1.5 text-[13px] text-white/70">{p.statLabel}</div>
            </div>
          </motion.div>
          </div>
        </motion.div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="text-[clamp(22px,2vw,28px)] font-medium tracking-[-0.035em] text-fg">{p.name}</h3>
            <p className="mt-2 max-w-[440px] text-[15px] leading-[1.55] text-muted">{p.desc}</p>
          </div>
          <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-inverse group-hover:text-on-inverse">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Works() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="works" className="relative">
      {/* title stage with flowing canvas */}
      <div ref={ref} className="relative flex min-h-[78vh] items-center justify-center overflow-hidden py-24">
        <FlowCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--fn-bg)_78%)]" />
        <motion.div style={{ y: titleY }} className="relative px-4 text-center">
          <SectionLabel index="02">Our platform</SectionLabel>
          <SplitHeading
            text="One *platform.*|~Every~ ~money~ ~flow.~"
            className="text-[clamp(48px,9vw,140px)] leading-[1.02] font-medium tracking-[-0.06em] text-fg"
          />
        </motion.div>
      </div>

      <Container className="relative pb-24 sm:pb-32">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} index={i} />
          ))}
        </div>
        <Reveal className="mt-16 flex justify-center">
          <PillButton href="#contact" variant="secondary">
            Talk to our team
          </PillButton>
        </Reveal>
      </Container>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ArtVariant, Project } from "@/data/projects";
import { Magnetic, RollingText, SplitHeading } from "../ui";
import ProjectArt from "./ProjectArt";
import { BottomPill, BRAND, BrandMark, CONTACT_EMAIL, usePortfolioTheme } from "./chrome";

const ease = [0.16, 1, 0.3, 1] as const;

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.8, ease, onUpdate: (v) => setDisplay(v.toFixed(decimals)) });
    return () => c.stop();
  }, [inView, value, decimals]);
  return (
    <span ref={ref} className="tabular-nums">
      {Number(display).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* Rounded media frame whose content scales down slightly as it scrolls through view. */
function Frame({ project, variant, image, className = "" }: { project: Project; variant?: ArtVariant; image?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[10px] bg-black/5 ${className}`}>
      <motion.div style={{ scale }} className="absolute inset-0">
        {image ? (
          <Image src={image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <ProjectArt project={project} variant={variant} />
        )}
      </motion.div>
    </div>
  );
}

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  usePortfolioTheme();
  const g = project.gallery ?? [];
  const otherVariants = (["browser", "phones", "laptop", "poster"] as ArtVariant[]).filter((v) => v !== project.art);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Industry", value: project.industry },
    { label: "Services", value: project.services.join(", ") },
  ];

  return (
    <div data-theme="light" className="min-h-screen bg-white px-2 pb-40 text-[#111]">
      {/* top bar */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="flex items-center justify-between px-2 py-4 text-[13px] sm:py-5"
      >
        <Link href="/portfolio#grid" className="group inline-flex items-center gap-2 rounded-full bg-black/[0.05] py-2 pr-4 pl-3 transition-colors hover:bg-black/[0.09]">
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <RollingText text="All work" />
        </Link>
        <Link href="/portfolio" className="font-medium">
          {BRAND}
        </Link>
        <Link href={`/portfolio/${next.slug}`} className="group hidden items-center gap-1.5 text-black/60 transition-colors hover:text-black sm:inline-flex">
          <RollingText text="Next project" />
          <ArrowUpRight className="size-4" />
        </Link>
      </motion.header>

      {/* hero */}
      <section className="px-2 pt-[12vh] pb-12 sm:pt-[16vh] sm:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mb-5 text-[13px] text-black/45"
        >
          Case study — {project.industry}
        </motion.p>
        <SplitHeading
          as="h1"
          play
          delay={0.15}
          text={project.title}
          className="text-[clamp(48px,8vw,128px)] leading-[0.95] font-normal tracking-[-0.055em]"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease }}
          className="mt-8 max-w-[620px] text-[clamp(18px,1.8vw,24px)] leading-[1.4] tracking-[-0.02em] text-black/60"
        >
          {project.summary}
        </motion.p>
      </section>

      {/* meta row */}
      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mx-2 grid grid-cols-2 border-t border-black/10 md:grid-cols-4"
      >
        {meta.map((m, i) => (
          <div key={m.label} className={`py-5 pr-4 ${i % 2 === 1 ? "pl-4 md:pl-0" : ""} ${i > 1 ? "border-t border-black/10 md:border-t-0" : ""}`}>
            <dt className="text-[12px] text-black/40">{m.label}</dt>
            <dd className="mt-1.5 text-[15px] leading-[1.4]">{m.value}</dd>
          </div>
        ))}
      </motion.dl>

      {/* cover */}
      <motion.div
        initial={{ clipPath: "inset(8% 6% 0% 6% round 10px)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 10px)", opacity: 1 }}
        transition={{ duration: 1.3, delay: 0.5, ease }}
        className="mt-6"
      >
        <Frame project={project} image={project.cover} className="aspect-[4/3] sm:aspect-[16/9]" />
      </motion.div>

      {/* overview */}
      <section className="grid gap-10 px-2 py-24 sm:py-32 md:grid-cols-[1fr_1.4fr]">
        <Rise>
          <h2 className="text-[13px] text-black/45">Overview</h2>
        </Rise>
        <Rise delay={0.05}>
          <p className="text-[clamp(22px,2.4vw,34px)] leading-[1.3] tracking-[-0.03em]">{project.overview}</p>
        </Rise>
      </section>

      {/* gallery pair */}
      <div className="grid gap-2 md:grid-cols-2">
        <Rise>
          <Frame project={project} variant={otherVariants[0]} image={g[0]} className="aspect-[4/5]" />
        </Rise>
        <Rise delay={0.1}>
          <Frame project={project} variant={otherVariants[1]} image={g[1]} className="aspect-[4/5]" />
        </Rise>
      </div>

      {/* challenge / solution */}
      <section className="grid gap-12 px-2 py-24 sm:py-32 md:grid-cols-2 md:gap-20">
        {[
          { label: "The challenge", text: project.challenge },
          { label: "Our solution", text: project.solution },
        ].map((b, i) => (
          <Rise key={b.label} delay={i * 0.1}>
            <h2 className="mb-5 flex items-center gap-3 text-[13px] text-black/45">
              <span className="tabular-nums text-black">0{i + 1}</span>
              <span className="h-px w-6 bg-black/20" />
              {b.label}
            </h2>
            <p className="text-[clamp(18px,1.6vw,22px)] leading-[1.5] tracking-[-0.015em] text-black/75">{b.text}</p>
          </Rise>
        ))}
      </section>

      {/* wide frame */}
      <Rise>
        <Frame project={project} variant={otherVariants[2]} image={g[2]} className="aspect-[4/3] sm:aspect-[21/9]" />
      </Rise>

      {/* results */}
      <section className="px-2 py-24 sm:py-32">
        <Rise>
          <h2 className="mb-10 text-[13px] text-black/45">Results</h2>
        </Rise>
        <div className="grid border-t border-black/10 sm:grid-cols-3">
          {project.results.map((r, i) => (
            <Rise
              key={r.label}
              delay={i * 0.08}
              className={`py-8 sm:px-6 sm:first:pl-0 ${i > 0 ? "border-t border-black/10 sm:border-t-0 sm:border-l" : ""}`}
            >
              <div className="text-[clamp(44px,5.4vw,80px)] leading-none font-normal tracking-[-0.055em]">
                <Counter value={r.value} suffix={r.suffix} decimals={r.decimals} />
              </div>
              <div className="mt-3 text-[14px] text-black/55">{r.label}</div>
            </Rise>
          ))}
        </div>
        {project.liveUrl && (
          <Rise className="mt-12">
            <Magnetic>
              <Link
                href={project.liveUrl}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#111] px-6 text-[14px] text-white transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
              >
                <RollingText text="Visit live site" />
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </Rise>
        )}
      </section>

      {/* next project */}
      <Link href={`/portfolio/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden rounded-[10px]">
        <div className="relative aspect-[4/3] sm:aspect-[21/9]">
          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.05]">
            <ProjectArt project={next} sizes="100vw" />
          </div>
          <span className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white sm:p-8">
            <p className="mb-3 text-[13px] text-white/70">Next project</p>
            <p className="text-[clamp(36px,5.6vw,88px)] leading-[0.95] tracking-[-0.05em]">
              <RollingText text={next.title} />
            </p>
          </div>
          <span className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-white text-[#111] transition-transform duration-500 ease-out-expo group-hover:rotate-45 sm:top-8 sm:right-8">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </Link>

      <BottomPill
        thumb={<BrandMark className="size-10 text-[15px]" />}
        label="Start a project like this"
        href={`mailto:${CONTACT_EMAIL}`}
        menu={[
          { label: "All work", href: "/portfolio#grid" },
          { label: "Reel view", href: "/portfolio" },
          { label: "Next project", href: `/portfolio/${next.slug}` },
          { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
        ]}
      />
    </div>
  );
}

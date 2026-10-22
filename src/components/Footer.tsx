"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUp, Check, Copy, Mail } from "lucide-react";
import { Container, Magnetic, PillButton, RollingText, SplitHeading } from "./ui";

const EMAIL = "hello@finnovator.sa"; // PLACEHOLDER

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21h-4V9Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// PLACEHOLDER profile URLs
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedInIcon },
  { label: "X / Twitter", href: "https://x.com", Icon: XIcon },
  { label: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { label: "Email us", href: `mailto:${EMAIL}`, Icon: () => <Mail className="size-4" /> },
];

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Payments", href: "#works" },
      { label: "Lending", href: "#works" },
      { label: "Open Banking", href: "#works" },
      { label: "Risk & Compliance", href: "#works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Approach", href: "#approach" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

/* Sticky only when the whole footer fits in the viewport — otherwise its top would be unreachable. */
function useFitsViewport(ref: React.RefObject<HTMLElement | null>) {
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.offsetHeight <= window.innerHeight);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [ref]);
  return fits;
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const fits = useFitsViewport(ref);
  const [copied, setCopied] = useState(false);

  // gentle parallax for the giant mark as the footer is revealed
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);
  const markScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <footer
      ref={ref}
      id="contact"
      className={`isolate z-0 overflow-hidden bg-bg pt-20 sm:pt-24 ${fits ? "sticky bottom-0" : "relative"}`}
    >
      {/* glow + giant mark that sit behind the glass panel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute inset-x-0 bottom-0 mx-auto h-[70%] max-w-[1200px]">
          <span className="bottom-[10%] left-[10%] h-[320px] w-[460px] bg-[#1d5fff]/40" style={{ animation: "aurora-a 18s ease-in-out infinite" }} />
          <span className="right-[8%] bottom-[0%] h-[300px] w-[420px] bg-[#7a3cff]/25" style={{ animation: "aurora-b 21s ease-in-out infinite" }} />
        </div>
        <motion.div
          style={{ y: markY, scale: markScale }}
          className="absolute inset-x-0 bottom-[-2vw] flex origin-bottom justify-center"
        >
          <span className="bg-gradient-to-b from-fg/50 via-fg/15 to-transparent bg-clip-text text-[17vw] leading-[0.85] font-medium tracking-[-0.075em] text-transparent">
            finnovator
          </span>
        </motion.div>
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <Container className="text-center">
          <SplitHeading
            text="Let's build the|*future* of finance."
            className="mx-auto text-[clamp(40px,5vw,72px)] leading-[1] font-medium tracking-[-0.06em] text-fg"
          />
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <PillButton href="#works" variant="secondary">
                See the platform
              </PillButton>
            </Magnetic>
            <Magnetic>
              <PillButton href={`mailto:${EMAIL}`}>Book a demo</PillButton>
            </Magnetic>
          </div>
          <button
            onClick={copyEmail}
            className="group mx-auto mt-6 inline-flex cursor-pointer items-center gap-2 text-[14px] text-muted transition-colors hover:text-fg"
          >
            {EMAIL}
            <span className="grid size-6 place-items-center rounded-full border border-line-strong">
              {copied ? <Check className="size-3 text-positive" /> : <Copy className="size-3" />}
            </span>
            <span aria-live="polite" className="w-12 text-left text-[12px] text-positive">
              {copied ? "Copied" : ""}
            </span>
          </button>
        </Container>

        {/* glass panel */}
        <Container className="mt-16 sm:mt-24">
          <div className="relative backdrop-blur-[20px]" style={{ background: "var(--fn-veil)" }}>
            <div aria-hidden="true" className="pointer-events-none absolute top-0 -right-[100vw] -left-[100vw] border-t border-line" />
            <div className="border-x border-line">
              <ul className="grid grid-cols-2 md:grid-cols-4">
                {socials.map(({ label, href, Icon }, i) => (
                  <li
                    key={label}
                    className={`border-b border-line md:border-b-0 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "md:border-l" : ""}`}
                  >
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      className="group relative isolate flex h-[54px] items-center gap-2.5 overflow-hidden px-4 text-[13px] text-fg-strong transition-colors hover:text-fg md:h-[64px] md:px-6 md:text-[14px]"
                    >
                      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-fg/[0.06] transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
                      <Icon />
                      <RollingText text={label} />
                      <ArrowRight className="ml-auto size-4 text-subtle transition-transform duration-300 ease-brand group-hover:translate-x-1 group-hover:text-fg" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 border-t border-line md:grid-cols-4">
                <div className="col-span-2 border-b border-line px-4 py-6 md:col-span-1 md:border-b-0 md:px-6 md:pt-10 md:pb-9">
                  <Link href="#top" aria-label="Back to top" className="text-fg">
                    <span className="text-[19px] font-medium tracking-[-0.04em]">finnovator</span>
                  </Link>
                  <p className="mt-3 max-w-[240px] text-[13px] leading-[1.6] text-muted">
                    Payments, lending and open banking infrastructure. Riyadh, Saudi Arabia.
                  </p>
                </div>
                {columns.map((col, i) => (
                  <div
                    key={col.title}
                    className={`px-4 py-6 md:border-l md:border-line md:px-6 md:pt-10 md:pb-9 ${
                      i === 1 ? "border-l border-line" : ""
                    } ${i === 2 ? "col-span-2 border-t border-line md:col-span-1 md:border-t-0" : ""}`}
                  >
                    <h3 className="text-[13px] text-subtle">{col.title}</h3>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} className="group inline-block py-1 text-[14px] text-fg-strong transition-colors hover:text-fg">
                            <RollingText text={l.label} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-t border-line px-4 py-5 text-[12px] text-subtle sm:flex-row sm:items-center md:px-6">
                <p>© 2026 Finnovator. All rights reserved.</p>
                <Link href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-fg">
                  Back to top
                  <span className="grid size-7 place-items-center rounded-full border border-line-strong transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                    <ArrowUp className="size-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </motion.div>
    </footer>
  );
}

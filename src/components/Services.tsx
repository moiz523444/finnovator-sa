"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { ArrowUpRight, Globe, Smartphone, Store, Terminal } from "lucide-react";
import { Container, PillButton, Reveal, SectionLabel, SplitHeading } from "./ui";

const services = [
  { title: "Payment Gateway & Acquiring", desc: "Online, in-app and in-store acceptance with smart routing and next-day settlement." },
  { title: "Digital Wallets & Cards", desc: "Issue branded prepaid, debit and virtual cards with full spend controls." },
  { title: "Buy Now, Pay Later", desc: "Split payments at checkout with instant approvals and merchant-funded plans." },
  { title: "SME & Consumer Lending", desc: "Origination, scoring and servicing on one configurable lending core." },
  { title: "Open Banking APIs", desc: "Account data and payment initiation through a single, consented API." },
  { title: "KYC, KYB & AML", desc: "Digital onboarding, identity checks and ongoing screening in minutes." },
  { title: "Fraud Prevention", desc: "Machine-learning risk scores on every transaction, tuned to your business." },
  { title: "Treasury & Reconciliation", desc: "Automated matching across banks, PSPs and ERPs with one source of truth." },
  { title: "Core Banking Integration", desc: "Connect legacy cores to modern channels without a rip-and-replace." },
  { title: "Managed Support & SLAs", desc: "24/7 monitoring, incident response and a dedicated success team." },
];

function ServiceRow({
  s,
  i,
  open,
  onToggle,
  onHover,
}: {
  s: (typeof services)[number];
  i: number;
  open: boolean;
  onToggle: () => void;
  onHover: () => void;
}) {
  return (
    <li className="border-b border-line" onPointerEnter={onHover}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group relative flex w-full cursor-pointer items-center gap-5 overflow-hidden py-5 text-left sm:py-6"
      >
        {/* fill sweep on hover */}
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
        <span className="relative w-8 text-[13px] text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
        <span
          className={`relative flex-1 text-[clamp(20px,2.3vw,32px)] font-medium tracking-[-0.035em] transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 ${
            open ? "text-fg" : "text-fg-strong group-hover:text-fg"
          }`}
        >
          {s.title}
        </span>
        <span
          className={`relative mr-2 grid size-9 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-out-expo group-hover:bg-inverse group-hover:text-on-inverse ${
            open ? "rotate-90 bg-inverse text-on-inverse" : "text-fg"
          }`}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[560px] pb-6 pl-[52px] text-[15px] leading-[1.6] text-muted">{s.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

const channels = [
  { icon: Globe, label: "Web" },
  { icon: Smartphone, label: "Mobile" },
  { icon: Store, label: "Point of sale" },
  { icon: Terminal, label: "API" },
];

const previewTones = [
  "from-[#2f8cff] to-[#0b1f4d]",
  "from-[#2fd28a] to-[#06331f]",
  "from-[#a77bff] to-[#22104d]",
  "from-[#ff8a3d] to-[#4a1a05]",
  "from-[#00c2ff] to-[#04263a]",
];

export default function Services() {
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const px = useSpring(0, { stiffness: 260, damping: 26 });
  const py = useSpring(0, { stiffness: 260, damping: 26 });

  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionLabel index="03">Solutions</SectionLabel>
            </Reveal>
            <SplitHeading
              text="Elevate every|*money* moment."
              className="text-[clamp(38px,5.2vw,76px)] leading-[1] font-medium tracking-[-0.05em] text-fg"
            />
            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <PillButton href="#contact">View all solutions</PillButton>
              <PillButton href="#contact" variant="secondary">
                Start a project
              </PillButton>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div
              className="relative"
              onPointerEnter={(e) => {
                // start the preview under the cursor instead of flying in from the corner
                const r = e.currentTarget.getBoundingClientRect();
                px.jump(e.clientX - r.left);
                py.jump(e.clientY - r.top);
              }}
              onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                px.set(e.clientX - r.left);
                py.set(e.clientY - r.top);
              }}
              onPointerLeave={() => setHovered(null)}
            >
              <ul className="border-t border-line">
                {services.map((s, i) => (
                  <ServiceRow
                    key={s.title}
                    s={s}
                    i={i}
                    open={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                    onHover={() => setHovered(i)}
                  />
                ))}
              </ul>

              {/* floating preview that trails the cursor */}
              <motion.div
                aria-hidden="true"
                style={{ x: px, y: py }}
                className="pointer-events-none absolute top-0 left-0 z-20 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
              >
                <AnimatePresence>
                  {hovered !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                      animate={{ opacity: 1, scale: 1, rotate: -3 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="ml-6 -mt-24 w-[250px] overflow-hidden rounded-2xl border border-line-strong bg-surface-2 shadow-2xl"
                    >
                      <div className={`relative h-[110px] bg-gradient-to-br ${previewTones[hovered % previewTones.length]}`}>
                        <div className="dot-grid absolute inset-0 opacity-50 mix-blend-overlay" />
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={hovered}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-3 left-4 text-[44px] leading-none font-medium tracking-[-0.05em] text-white"
                          >
                            {String(hovered + 1).padStart(2, "0")}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <p className="p-4 text-[13px] leading-[1.5] text-muted">{services[hovered].desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* channel flexibility band */}
        <Reveal className="spotlight shine-border mt-24 grid items-center gap-10 rounded-[26px] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-[clamp(26px,3vw,40px)] leading-[1.05] font-medium tracking-[-0.04em] text-fg">
              Any channel. <span className="accent-serif">One ledger.</span>
            </h3>
            <p className="mt-3 max-w-[520px] text-[15px] leading-[1.6] text-muted">
              Whatever your customers use, every transaction lands in the same real-time ledger: reconciled, reported and audit-ready.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {channels.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-bg px-5 py-5 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong"
              >
                <Icon className="size-5 text-muted transition-colors group-hover:text-accent" />
                <span className="text-[13px] font-medium whitespace-nowrap text-fg">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

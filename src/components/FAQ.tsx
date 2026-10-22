"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container, PillButton, Reveal, SectionLabel, SplitHeading } from "./ui";

const faqs = [
  {
    q: "How do I get started with Finnovator?",
    a: "Book a demo through the contact form. We'll set up a short discovery call, give you sandbox access the same week and agree a launch plan together.",
  },
  {
    q: "Is Finnovator licensed and regulated?",
    a: "Placeholder answer. Describe your licensing status, the regulators you work with and the standards you are certified against.",
  },
  {
    q: "How long does integration take?",
    a: "Most merchants go live with hosted checkout in days. Full API integrations for lending or open banking typically take 4 to 8 weeks, depending on scope.",
  },
  {
    q: "Which payment methods do you support?",
    a: "Placeholder answer. List the local and international payment methods, wallets and instant transfer schemes you support.",
  },
  {
    q: "How is my customers' data protected?",
    a: "Data is encrypted in transit and at rest, access is strictly role-based and every action is logged. Describe your hosting and data residency here.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. Every plan includes ongoing support, and Growth and Enterprise customers get a dedicated success manager plus 24/7 incident response.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel index="07">FAQs</SectionLabel>
            <SplitHeading
              text="Frequently asked *questions*"
              className="text-[clamp(38px,5.2vw,76px)] leading-[1] font-medium tracking-[-0.05em] text-fg"
            />
            <p className="mt-5 max-w-[380px] text-[15px] leading-[1.6] text-muted">Can&apos;t find what you need? Our team usually replies within one business day.</p>
            <div className="mt-8">
              <PillButton href="#contact" variant="secondary">
                Ask a question
              </PillButton>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="border-t border-line">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q} className="border-b border-line">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full cursor-pointer items-center gap-5 py-6 text-left"
                    >
                      <span className="w-6 text-[13px] text-subtle tabular-nums">{i + 1}.</span>
                      <span
                        className={`flex-1 text-[clamp(17px,1.6vw,21px)] font-medium tracking-[-0.025em] transition-colors duration-300 ${
                          isOpen ? "text-fg" : "text-fg-strong group-hover:text-fg"
                        }`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo ${
                          isOpen
                            ? "rotate-45 border-transparent bg-inverse text-on-inverse"
                            : "border-line-strong text-fg group-hover:border-fg/40"
                        }`}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[620px] pr-12 pb-7 pl-11 text-[15px] leading-[1.65] text-muted">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

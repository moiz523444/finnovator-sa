"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Container, PillButton, Reveal, SectionLabel, SplitHeading } from "./ui";

type Currency = "USD" | "SAR";

// PLACEHOLDER pricing — replace with real plans.
const tiers = [
  {
    name: "Starter",
    usd: 499,
    sar: 1875,
    period: "/month",
    desc: "For merchants taking their first digital payments, with everything needed to go live fast.",
    features: ["Hosted checkout & payment links", "Mada, cards and wallets", "Next-day settlement", "Standard fraud rules"],
    details: "Includes sandbox access, email support and up to 5,000 transactions per month before volume pricing applies.",
  },
  {
    name: "Growth",
    usd: 1499,
    sar: 5625,
    period: "/month",
    popular: true,
    desc: "For scaling businesses that need lending, open banking and smarter risk in one place.",
    features: ["Everything in Starter", "BNPL & embedded credit", "Open banking data APIs", "ML fraud scoring", "Priority support"],
    details: "Includes a dedicated onboarding manager, custom webhooks and reconciliation exports to your ERP.",
  },
  {
    name: "Enterprise",
    usd: null,
    sar: null,
    period: "",
    desc: "For banks and large platforms that need custom deployment, SLAs and regulatory alignment.",
    features: ["Private cloud or on-premise", "Core banking integration", "Custom compliance workflows", "24/7 SLA & named team"],
    details: "Scoped together in a discovery workshop. Pricing reflects volume, deployment model and integrations.",
  },
];

function Price({ value, currency }: { value: number | null; currency: Currency }) {
  if (value === null) return <span>Custom</span>;
  const symbol = currency === "USD" ? "$" : "SAR ";
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={currency}
        initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        <span className="mr-1 text-[0.5em] text-subtle">{symbol}</span>
        {value.toLocaleString("en-US")}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionLabel index="04">Pricing</SectionLabel>
            <SplitHeading
              text="Simple, *upfront* pricing"
              className="text-[clamp(38px,5.2vw,76px)] leading-[1] font-medium tracking-[-0.05em] text-fg"
            />
            <p className="mt-4 max-w-[520px] text-[16px] leading-[1.6] text-muted">
              Starting points in{" "}
              <button
                onClick={() => setCurrency("USD")}
                className={`cursor-pointer underline-offset-4 transition-colors ${currency === "USD" ? "text-fg underline" : "hover:text-fg"}`}
              >
                US dollars
              </button>{" "}
              or{" "}
              <button
                onClick={() => setCurrency("SAR")}
                className={`cursor-pointer underline-offset-4 transition-colors ${currency === "SAR" ? "text-fg underline" : "hover:text-fg"}`}
              >
                Saudi riyals
              </button>
              , stated up front. Every rollout is confirmed on its actual scope before work begins.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div role="radiogroup" aria-label="Currency" className="relative inline-flex rounded-full border border-line-strong bg-surface p-1">
              {(["USD", "SAR"] as const).map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={currency === c}
                  onClick={() => setCurrency(c)}
                  className={`relative z-10 cursor-pointer rounded-full px-5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    currency === c ? "text-on-inverse" : "text-muted hover:text-fg"
                  }`}
                >
                  {currency === c && (
                    <motion.span
                      layoutId="currency-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-inverse"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((t, i) => {
            const value = currency === "USD" ? t.usd : t.sar;
            const isOpen = openDetails === t.name;
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  data-shine={t.popular ? "on" : undefined}
                  className={`spotlight shine-border group relative flex h-full flex-col rounded-[24px] border p-6 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1.5 sm:p-8 ${
                    t.popular ? "border-accent/50 bg-surface-2" : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  {t.popular && (
                    <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(120%_60%_at_50%_0%,var(--fn-accent-soft),transparent)]" />
                  )}
                  <div className="relative flex items-center justify-between">
                    <h3 className="text-[20px] font-medium tracking-[-0.03em] text-fg">{t.name}</h3>
                    {t.popular && (
                      <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white">Most popular</span>
                    )}
                  </div>
                  <div className="relative mt-8 flex items-end gap-1 overflow-hidden">
                    <span className="text-[13px] text-subtle">{value === null ? "" : "from"}</span>
                    <span className="text-[clamp(40px,4vw,54px)] leading-none font-medium tracking-[-0.05em] text-fg tabular-nums">
                      <Price value={value} currency={currency} />
                    </span>
                    <span className="mb-1 text-[13px] text-subtle">{t.period}</span>
                  </div>
                  <p className="relative mt-5 text-[14px] leading-[1.6] text-muted">{t.desc}</p>

                  <ul className="relative mt-6 flex flex-col gap-3 border-t border-line pt-6">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[14px] text-fg-strong">
                        <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-fg/10">
                          <Check className="size-3 text-fg" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto pt-8">
                    <div className="flex gap-2">
                      <PillButton href="#contact" variant={t.popular ? "primary" : "secondary"} className="flex-1">
                        {t.usd === null ? "Contact sales" : "Get started"}
                      </PillButton>
                      <button
                        onClick={() => setOpenDetails(isOpen ? null : t.name)}
                        aria-expanded={isOpen}
                        className="inline-flex h-[44px] cursor-pointer items-center gap-1.5 rounded-full border border-line-strong px-4 text-[14px] font-medium text-fg transition-colors hover:bg-surface-3"
                      >
                        Details
                        <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden text-[13px] leading-[1.6] text-muted"
                        >
                          <span className="block pt-4">{t.details}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

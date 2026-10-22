"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Container, Reveal, SectionLabel, SplitHeading } from "./ui";

const ease = [0.16, 1, 0.3, 1] as const;

function Card({ title, desc, children, className = "", delay = 0 }: { title: string; desc: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="spotlight shine-border group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong">
        <div className="relative min-h-[220px] flex-1 overflow-hidden border-b border-line bg-bg">
          <div className="dot-grid absolute inset-0 opacity-50" />
          <div className="relative h-full">{children}</div>
        </div>
        <div className="p-6 sm:p-7">
          <h3 className="text-[21px] font-medium tracking-[-0.03em] text-fg">{title}</h3>
          <p className="mt-2 text-[14px] leading-[1.6] text-muted">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

function ChecklistVisual() {
  const items = ["Business goals mapped", "Regulatory scope defined", "Data flows documented", "Launch plan signed off"];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-6">
      {items.map((it, i) => (
        <motion.div
          key={it}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease }}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 400, damping: 18 }}
            className="grid size-5 place-items-center rounded-full bg-positive text-black"
          >
            <Check className="size-3" strokeWidth={3} />
          </motion.span>
          <span className="text-[13px] text-fg">{it}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CodeVisual() {
  const lines = [
    ["const", " payment = ", "await", " fn.payments.create({"],
    ["", "  amount: ", "", "3215_50,"],
    ["", "  currency: ", "", "'SAR',"],
    ["", "  method: ", "", "'mada',"],
    ["", "});", "", ""],
  ];
  return (
    <div className="flex h-full items-center p-6">
      <div className="w-full rounded-xl border border-line bg-surface p-4 font-mono text-[12px] leading-[1.9] shadow-2xl transition-transform duration-700 ease-out-expo group-hover:-rotate-1 group-hover:scale-[1.02]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="whitespace-pre text-muted"
          >
            <span className="text-accent">{l[0]}</span>
            <span className="text-fg">{l[1]}</span>
            <span className="text-accent">{l[2]}</span>
            <span className="text-positive">{l[3]}</span>
          </motion.div>
        ))}
        <div className="mt-2 flex items-center gap-2 border-t border-line pt-2 text-[11px] text-positive">
          <span className="size-1.5 rounded-full bg-positive" /> 201 Created · 182ms
        </div>
      </div>
    </div>
  );
}

function ShieldVisual() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="relative grid size-36 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-accent/40"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-dashed border-line-strong"
        />
        <span className="relative grid size-16 place-items-center rounded-2xl bg-inverse text-on-inverse shadow-[0_0_60px_var(--fn-accent-soft)] transition-transform duration-500 ease-out-expo group-hover:scale-110">
          <Lock className="size-6" />
        </span>
      </div>
    </div>
  );
}

const ledgerSeed = [
  { id: "TX-8841", party: "Al-Noor Supplies", amount: "-3,215.50", status: "Settled" },
  { id: "TX-8840", party: "Mada POS · Batch 41", amount: "+8,904.25", status: "Settled" },
  { id: "TX-8839", party: "Payroll run · Oct", amount: "-142,300.00", status: "Scheduled" },
];
const incoming = [
  { party: "Online checkout", amount: "+649.00" },
  { party: "BNPL instalment", amount: "+212.75" },
  { party: "Wallet top-up", amount: "+1,000.00" },
  { party: "Refund · Order 5521", amount: "-89.00" },
];

function LedgerVisual() {
  const [rows, setRows] = useState(ledgerSeed);
  useEffect(() => {
    let n = 8842;
    let k = 0;
    const t = setInterval(() => {
      const next = incoming[k++ % incoming.length];
      setRows((r) => [{ id: `TX-${n++}`, party: next.party, amount: next.amount, status: "Live" }, ...r].slice(0, 4));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid grid-cols-[80px_1fr_auto] gap-3 border-b border-line px-4 py-2.5 text-[11px] text-subtle sm:grid-cols-[90px_1fr_110px_80px]">
          <span>ID</span>
          <span>Counterparty</span>
          <span className="text-right">Amount</span>
          <span className="hidden text-right sm:block">Status</span>
        </div>
        <ul>
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease }}
                className="relative overflow-hidden"
              >
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.6, delay: 0.3 }}
                  className="absolute inset-0 bg-accent-soft"
                />
                <div className="relative grid grid-cols-[80px_1fr_auto] items-center gap-3 border-b border-line px-4 py-2.5 text-[12px] sm:grid-cols-[90px_1fr_110px_80px]">
                  <span className="font-mono text-subtle">{r.id}</span>
                  <span className="truncate text-fg">{r.party}</span>
                  <span className={`text-right tabular-nums ${r.amount.startsWith("+") ? "text-positive" : "text-fg"}`}>{r.amount}</span>
                  <span className="hidden text-right sm:block">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        r.status === "Live" ? "bg-accent-soft text-accent" : "bg-fg/10 text-muted"
                      }`}
                    >
                      {r.status}
                    </span>
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function UptimeVisual() {
  const bars = Array.from({ length: 30 }, (_, i) => (i === 17 ? 0.7 : 0.88 + ((i * 37) % 10) / 100));
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[34px] leading-none font-medium tracking-[-0.05em] text-fg">99.99%</div>
          <div className="mt-1 text-[12px] text-subtle">Platform uptime · 30 days</div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-positive">
          <span className="relative flex size-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-positive" />
            <span className="relative size-2 rounded-full bg-positive" />
          </span>
          Operational
        </span>
      </div>
      <div className="flex h-16 items-end gap-[3px]">
        {bars.map((b, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025, duration: 0.6, ease }}
            style={{ height: `${b * 100}%` }}
            className={`flex-1 origin-bottom rounded-[2px] transition-opacity duration-300 hover:opacity-60 ${i === 17 ? "bg-[#f5b544]" : "bg-positive/80"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Approach() {
  return (
    <section id="approach" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionLabel index="05">Our approach</SectionLabel>
        </Reveal>
        <SplitHeading
          text="Built *right,*|~from~ ~day~ ~one.~"
          className="mb-14 max-w-[760px] text-[clamp(38px,5.2vw,76px)] leading-[1] font-medium tracking-[-0.05em] text-fg"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Discovery First"
            desc="We start with your goals, your customers and your regulatory scope, so the foundation is right before a line of code ships."
          >
            <ChecklistVisual />
          </Card>
          <Card
            delay={0.08}
            title="API-First Architecture"
            desc="Clean, documented APIs and SDKs your developers will enjoy, with a full sandbox from the first day."
          >
            <CodeVisual />
          </Card>
          <Card
            delay={0.16}
            title="Bank-Grade Security"
            desc="Encryption everywhere, strict access controls and continuous monitoring, designed around industry security standards."
            className="md:col-span-2 lg:col-span-1"
          >
            <ShieldVisual />
          </Card>
          <Card
            title="Real-Time Ledger"
            desc="Every payment, loan and fee posts to one double-entry ledger the moment it happens. No end-of-day surprises."
            className="md:col-span-2"
          >
            <LedgerVisual />
          </Card>
          <Card
            delay={0.08}
            title="Seamless Launch & Scale"
            desc="Go live with a dedicated team, then scale on infrastructure built for peak-season volumes."
            className="md:col-span-2 lg:col-span-1"
          >
            <UptimeVisual />
          </Card>
        </div>
      </Container>
    </section>
  );
}

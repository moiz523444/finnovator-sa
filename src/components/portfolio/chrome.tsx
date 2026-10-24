"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "../ui";

export const BRAND = "Alif Landing Solutions";
export const TAGLINE = "Landing pages that convert, designed and built.";
export const CONTACT_EMAIL = "hello@aliflanding.com"; // PLACEHOLDER

const ease = [0.16, 1, 0.3, 1] as const;

/* The portfolio is always shown in the light theme; restores the visitor's theme on leave. */
export function usePortfolioTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "light");
    return () => {
      if (prev) root.setAttribute("data-theme", prev);
      else root.removeAttribute("data-theme");
    };
  }, []);
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[10px] bg-[#1a1a1a] font-medium tracking-[-0.04em] text-white ${className}`}>
      AL
    </span>
  );
}

type MenuLink = { label: string; href?: string; onClick?: () => void; external?: boolean };

/*
 * Floating glass pill at the bottom of every portfolio screen:
 * [thumb] label ........ [menu]. The menu opens upward inside the same pill.
 */
export function BottomPill({
  thumb,
  label,
  href,
  menu,
}: {
  thumb: React.ReactNode;
  label: string;
  href: string;
  menu: MenuLink[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:bottom-6">
      <motion.div
        layoutId="al-pill"
        transition={{ duration: 0.9, ease }}
        className="w-full max-w-[344px] overflow-hidden rounded-[18px] bg-white/55 p-2 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.35),inset_0_0_0_1px_rgb(255_255_255/0.5)] backdrop-blur-2xl backdrop-saturate-150"
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              aria-label="Portfolio menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden"
            >
              <ul className="flex flex-col gap-0.5 px-1 pt-1 pb-2">
                {menu.map((m, i) => {
                  const inner = (
                    <>
                      <span className="w-6 text-[12px] text-black/40 tabular-nums">0{i + 1}</span>
                      <RollingText text={m.label} className="text-[22px] font-medium tracking-[-0.04em]" />
                      <ArrowUpRight className="ml-auto size-4 text-black/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black" />
                    </>
                  );
                  const cls =
                    "group flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[#111] transition-colors hover:bg-black/[0.05]";
                  return (
                    <motion.li
                      key={m.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease }}
                    >
                      {m.href ? (
                        <Link
                          href={m.href}
                          target={m.external ? "_blank" : undefined}
                          rel={m.external ? "noreferrer" : undefined}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            setOpen(false);
                            m.onClick?.();
                          }}
                          className={cls}
                        >
                          {inner}
                        </button>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <Link href={href} className="group flex min-w-0 flex-1 items-center gap-3" data-cursor="Open">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-[10px]">{thumb}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="truncate text-[14px] text-[#1a1a1a]"
              >
                <RollingText text={label} />
              </motion.span>
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px] bg-white transition-colors hover:bg-white/70"
          >
            <span className="relative block h-[8px] w-[18px]">
              <span className={`absolute left-0 block h-[1.5px] w-full bg-[#111] transition-all duration-300 ${open ? "top-[3px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 block h-[1.5px] w-full bg-[#111] transition-all duration-300 ${open ? "top-[3px] -rotate-45" : "top-[7px]"}`} />
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* "Grid view | Reel view" segmented switch. */
export function ViewToggle({ view, onChange, tone = "light" }: { view: "grid" | "reel"; onChange: (v: "grid" | "reel") => void; tone?: "light" | "dark" }) {
  return (
    <div
      role="tablist"
      aria-label="Portfolio view"
      className={`flex rounded-full p-1 backdrop-blur-xl ${tone === "light" ? "bg-black/[0.05]" : "bg-white/15"}`}
    >
      {(["grid", "reel"] as const).map((v) => (
        <button
          key={v}
          role="tab"
          aria-selected={view === v}
          onClick={() => onChange(v)}
          className={`relative isolate cursor-pointer rounded-full px-4 py-2 text-[13px] transition-colors duration-300 ${
            view === v ? "text-[#111]" : tone === "light" ? "text-black/40 hover:text-black/70" : "text-white/70 hover:text-white"
          }`}
        >
          {view === v && (
            <motion.span
              layoutId="view-toggle"
              className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.12)]"
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
            />
          )}
          <span className="relative">{v === "grid" ? "Grid view" : "Reel view"}</span>
        </button>
      ))}
    </div>
  );
}

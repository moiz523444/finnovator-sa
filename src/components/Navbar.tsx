"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Logo, Magnetic, PillButton, RollingText, useIntroReady } from "./ui";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Solutions", href: "#services" },
  { label: "Platform", href: "#works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Approach", href: "#approach" },
  { label: "FAQs", href: "#faqs" },
];

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

function ThemeSwitch() {
  const isLight = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.getAttribute("data-theme") === "light",
    () => false,
  );

  const toggle = () => {
    const next = !isLight;
    if (next) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("fn-theme", next ? "light" : "dark");
    } catch {}
  };

  return (
    <button
      role="switch"
      aria-checked={isLight}
      aria-label="Switch to light theme"
      onClick={toggle}
      className="relative h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full border border-line-strong bg-surface-3 transition-colors duration-300"
    >
      <span
        className={`absolute top-[3px] left-[3px] grid size-[18px] place-items-center rounded-full bg-inverse transition-transform duration-500 ease-out-expo ${
          isLight ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Navbar() {
  const ready = useIntroReady();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // Always visible; past 24px it condenses into a floating glass bar.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const glass = scrolled || open;

  return (
    <>
      <motion.header
        initial={{ y: "-100%", opacity: 0 }}
        animate={ready ? { y: "0%", opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[200] px-3 transition-[padding] duration-700 ease-out-expo sm:px-4 ${
          glass ? "pt-3" : "pt-0"
        }`}
      >
        <div
          className={`relative mx-auto overflow-hidden border transition-[max-width,background-color,border-color,box-shadow,border-radius,padding] duration-700 ease-out-expo ${
            glass
              ? "max-w-[1240px] rounded-[22px] border-fg/10 bg-[var(--fn-glass)] py-2.5 shadow-[var(--fn-glass-shadow)] backdrop-blur-2xl backdrop-saturate-150"
              : "max-w-[1400px] rounded-none border-transparent bg-transparent py-4"
          }`}
        >
          {/* top sheen line on the glass */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fg/30 to-transparent transition-opacity duration-700 ${
              glass ? "opacity-100" : "opacity-0"
            }`}
          />
        <div className="mx-auto grid grid-cols-[auto_1fr] items-center gap-5 px-3 sm:px-4 md:px-5 min-[981px]:grid-cols-[1fr_auto_1fr]">
          <Link href="#top" aria-label="Finnovator home" className="justify-self-start text-fg transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            onPointerLeave={() => setHoverLink(null)}
            className={`hidden items-center rounded-full border p-1 transition-colors duration-700 min-[981px]:flex ${
              glass ? "border-transparent bg-transparent" : "border-line bg-surface/60 backdrop-blur-md"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onPointerEnter={() => setHoverLink(link.label)}
                className="group relative isolate rounded-full px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.01em] text-muted transition-colors duration-300 hover:text-fg"
              >
                {hoverLink === link.label && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 -z-10 rounded-full bg-fg/[0.08] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <RollingText text={link.label} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-self-end min-[981px]:gap-3.5">
            <ThemeSwitch />
            <Magnetic strength={0.25} className="max-[420px]:hidden">
              <PillButton href="#contact" className="!h-[38px] !px-4 !text-[13px]">
                Let&apos;s Connect
              </PillButton>
            </Magnetic>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-[38px] shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong min-[981px]:hidden"
            >
              <span className="relative block h-[10px] w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full bg-fg transition-all duration-300 ${
                    open ? "top-[4px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full bg-fg transition-all duration-300 ${
                    open ? "top-[4px] -rotate-45" : "top-[8px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className={`absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-gradient-to-r from-accent/0 via-accent to-fg transition-opacity duration-500 ${
              glass ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
            className="fixed inset-0 z-[190] flex flex-col justify-between bg-bg px-4 pt-28 pb-10 sm:px-6 min-[981px]:hidden"
          >
            <nav className="flex flex-col">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="text-[12px] tabular-nums text-subtle">0{idx + 1}</span>
                    <span className="text-[30px] font-medium tracking-[-0.03em] text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <PillButton href="#contact" size="lg" className="w-full" onClick={() => setOpen(false)}>
                Let&apos;s Connect
              </PillButton>
              <p className="text-center text-[13px] text-subtle">hello@finnovator.sa</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;
const word = "finnovator";

/* First-visit intro: counter to 100, wordmark rises, then the curtain lifts. */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "done") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off sync with the boot script's decision
      setVisible(false);
      return;
    }
    const c = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setTimeout(() => setVisible(false), 250);
      },
    });
    return () => c.stop();
  }, []);

  const finish = () => {
    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem("fn-intro", "1");
    } catch {}
  };

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="preloader fixed inset-0 z-[500] flex flex-col justify-between bg-[#050505] p-5 text-white sm:p-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="flex items-center justify-between text-[12px] text-white/50">
            <span>Payments · Lending · Open Banking</span>
            <span>Riyadh, KSA</span>
          </div>

          <div className="flex justify-center overflow-hidden">
            <div className="flex text-[clamp(56px,14vw,200px)] leading-[0.9] font-medium tracking-[-0.07em]">
              {word.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 15 }}
                className="ml-[0.06em] inline-block size-[0.16em] self-end rounded-full bg-[#2f8cff]"
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 overflow-hidden bg-white/10">
              <div className="h-full origin-left bg-white" style={{ transform: `scaleX(${count / 100})` }} />
            </div>
            <span className="w-[3ch] text-right text-[clamp(40px,7vw,96px)] leading-none font-medium tracking-[-0.06em] tabular-nums">
              {count}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/*
 * Page-wide effects:
 *  - feeds --mx/--my to the hovered .spotlight card
 *  - custom cursor ring that grows on links and shows a label over [data-cursor]
 *  - film grain overlay
 */
export default function Effects() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a media query once on mount
    setEnabled(fine && !reduce);

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest<HTMLElement>(".spotlight");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
      setHovering(!!target?.closest("a, button, [role='switch'], [role='radio']"));
    };
    const onLeave = () => setShown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  // Over buttons/links the ring melts away so it never covers their text; the element's own hover takes over.
  const size = label ? 92 : hovering ? 8 : 30;

  return (
    <>
      <div aria-hidden="true" className="grain" />
      {enabled && (
        <>
          {/* trailing ring */}
          <motion.div
            aria-hidden="true"
            style={{ x: rx, y: ry }}
            className="pointer-events-none fixed top-0 left-0 z-[400]"
          >
            <motion.div
              animate={{ width: size, height: size, opacity: shown && !(hovering && !label) ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
                label ? "bg-inverse text-on-inverse" : "border border-fg/40"
              }`}
            >
              <AnimatePresence>
                {label && (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="text-[13px] font-medium"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          {/* precise dot */}
          <motion.div
            aria-hidden="true"
            style={{ x, y }}
            className="pointer-events-none fixed top-0 left-0 z-[401]"
          >
            <motion.div
              animate={{ scale: label || hovering ? 0 : 1, opacity: shown ? 1 : 0 }}
              className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
            />
          </motion.div>
        </>
      )}
    </>
  );
}

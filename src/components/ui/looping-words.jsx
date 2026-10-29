// src/components/ui/looping-words.jsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

export function LoopingWords({
  words = ["Create!", "Connect!", "Collaborate!", "Innovate!", "Engineer!"],
  className = "",
}) {
  const controls = useAnimationControls();
  const wordsRef = useRef([]);
  const [selectorWidth, setSelectorWidth] = useState(0);
  const activeWordIndexRef = useRef(1);

  // Duplicate the words array to create a seamless infinite vertical loop
  const duplicatedWords = [...words, ...words, ...words];
  const totalOriginal = words.length;

  const updateWidth = useCallback((index) => {
    const el = wordsRef.current[index];
    if (el) {
      setSelectorWidth(el.offsetWidth + 16);
    }
  }, []);

  // Measure initial width after fonts load and keep responsive on window resize
  useEffect(() => {
    const handleMeasure = () => updateWidth(activeWordIndexRef.current);

    handleMeasure();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleMeasure);
    }

    window.addEventListener("resize", handleMeasure);
    return () => window.removeEventListener("resize", handleMeasure);
  }, [updateWidth]);

  useEffect(() => {
    let index = 0;
    let isMounted = true;

    const interval = setInterval(async () => {
      if (!isMounted) return;
      index++;
      const targetMiddleIndex = index + 1;
      activeWordIndexRef.current = targetMiddleIndex;
      updateWidth(targetMiddleIndex);

      await controls.start({
        y: `-${(index * 100) / duplicatedWords.length}%`,
        transition: { duration: 1.15, ease: [0.175, 0.885, 0.32, 1.15] },
      });

      // Seamlessly snap back to the start of the first set once a full cycle completes
      if (index >= totalOriginal && isMounted) {
        index = 0;
        activeWordIndexRef.current = 1;
        controls.set({ y: "0%" });
        updateWidth(1);
      }
    }, 2200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [controls, totalOriginal, duplicatedWords.length, updateWidth]);

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="relative h-[2.7em] px-4 sm:px-6 text-[11vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] leading-[0.9] font-bold tracking-tight whitespace-nowrap overflow-hidden select-none">
        {/* Scrolling list of words */}
        <motion.ul
          className="flex flex-col items-center m-0 p-0 list-none will-change-transform"
          animate={controls}
          initial={{ y: "0%" }}
        >
          {duplicatedWords.map((word, i) => (
            <li
              key={i}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="h-[0.9em] flex items-center justify-center text-foreground tracking-tight font-sans"
            >
              <p className="m-0 leading-[0.9]">{word}</p>
            </li>
          ))}
        </motion.ul>

        {/* Top & Bottom Fade Gradients (Uses var(--background) directly for oklch compatibility) */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--background) 4%, transparent 36%, transparent 64%, var(--background) 96%)",
          }}
        />

        {/* Dynamic Corner Selector Brackets */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[0.92em] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          animate={{ width: selectorWidth || "auto" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-[0.14em] h-[0.14em] border-t-[0.04em] border-l-[0.04em] border-blue-500 shadow-[-2px_-2px_8px_rgba(59,130,246,0.4)]" />
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-[0.14em] h-[0.14em] border-t-[0.04em] border-r-[0.04em] border-blue-500 shadow-[2px_-2px_8px_rgba(59,130,246,0.4)]" />
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-[0.14em] h-[0.14em] border-b-[0.04em] border-l-[0.04em] border-blue-500 shadow-[-2px_2px_8px_rgba(59,130,246,0.4)]" />
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-[0.14em] h-[0.14em] border-b-[0.04em] border-r-[0.04em] border-blue-500 shadow-[2px_2px_8px_rgba(59,130,246,0.4)]" />
        </motion.div>
      </div>
    </div>
  );
}

export default LoopingWords;

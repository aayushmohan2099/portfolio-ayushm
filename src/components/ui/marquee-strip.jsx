// src/components/ui/marquee-strip.jsx
"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Pure mathematical modular wrap (eliminates external @motionone/utils dependency)
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function TextScrollMarquee({
  children,
  items = [],
  baseVelocity = 1.2,
  className = "",
  stripClassName = "",
  scrollDependent = true,
  delay = 0,
  direction = "left",
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2.5], {
    clamp: false,
  });

  // Seamless modular wrap from -50% to 0% across duplicated tracks
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef(direction === "left" ? -1 : 1);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasStarted.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    directionFactor.current = direction === "left" ? -1 : 1;
  }, [direction]);

  useAnimationFrame((t, delta) => {
    if (!hasStarted.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = 1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = -1;
      }
    }

    moveBy += directionFactor.current * Math.abs(moveBy) * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Render either structured items array or plain children string
  const renderTrackContent = () => {
    if (items && items.length > 0) {
      return items.map((item, idx) => (
        <span
          key={idx}
          className={cn(
            "inline-flex items-center gap-8 sm:gap-12 md:gap-16 text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight font-sans leading-none py-1",
            className,
          )}
        >
          <span>{item}</span>
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500/80 shrink-0" />
        </span>
      ));
    }

    return (
      <span
        className={cn(
          "block text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight font-sans leading-none py-1",
          className,
        )}
      >
        {children}
      </span>
    );
  };

  return (
    // Inverted Theme Strip: White BG + Black Text in Dark Theme | Black BG + White Text in Light Theme
    <div
      className={cn(
        "relative w-full overflow-hidden whitespace-nowrap flex flex-nowrap py-4 sm:py-5 md:py-6 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-y border-border/40 shadow-lg select-none z-20",
        stripClassName,
      )}
    >
      <motion.div
        className="flex whitespace-nowrap items-center gap-8 sm:gap-12 md:gap-16 flex-nowrap will-change-transform"
        style={{ x }}
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-8 sm:gap-12 md:gap-16 shrink-0"
          >
            {renderTrackContent()}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

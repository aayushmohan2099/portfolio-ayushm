// src/components/ui/scroll-timeline.jsx
import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Individual Timeline Item sub-component (keeps React Hooks rules 100% valid)
const TimelineNodeItem = ({
  event,
  index,
  isActive,
  cardAlignment,
  cardVariant,
  parallaxIntensity,
  smoothProgress,
}) => {
  const isAlternating = cardAlignment === "alternating";
  const isEven = index % 2 === 0;

  // Subtle parallax drift linked to smooth scroll
  const yOffset = useTransform(
    smoothProgress,
    [0, 1],
    [parallaxIntensity * 60, -parallaxIntensity * 60],
  );

  // Determine desktop side placement
  const desktopSideClass =
    cardAlignment === "right"
      ? "lg:ml-[calc(50%+3rem)] lg:w-[calc(50%-3rem)]"
      : cardAlignment === "left"
        ? "lg:mr-[calc(50%+3rem)] lg:w-[calc(50%-3rem)] lg:text-right"
        : isEven
          ? "lg:ml-[calc(50%+3rem)] lg:w-[calc(50%-3rem)]"
          : "lg:mr-[calc(50%+3rem)] lg:w-[calc(50%-3rem)] lg:text-right";

  // Slide direction based on side
  const initialX =
    cardAlignment === "right"
      ? 40
      : cardAlignment === "left"
        ? -40
        : isEven
          ? 40
          : -40;

  const variantStyles = {
    editorial: "bg-transparent border-transparent p-0",
    glass: cn(
      "p-6 sm:p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500",
      isActive
        ? "bg-card/40 dark:bg-white/[0.03] border-blue-500/30 shadow-[0_8px_32px_rgba(59,130,246,0.08)]"
        : "bg-card/20 dark:bg-white/[0.01] border-border/40 opacity-75",
    ),
  };

  return (
    <div className="relative flex items-start lg:items-center mb-16 sm:mb-24 last:mb-0">
      {/* --- TIMELINE AXIS NODE (Left on Mobile, Center on Desktop) --- */}
      <div className="absolute left-4 sm:left-6 lg:left-1/2 top-2 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-30 flex items-center justify-center">
        {/* Outer pulsing halo when active */}
        <motion.div
          initial={false}
          animate={
            isActive
              ? {
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 0.8, 0.4],
                }
              : { scale: 0.8, opacity: 0 }
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-7 h-7 rounded-full bg-blue-500/25 blur-[2px]"
        />

        {/* Core circular node matching reference[cite: 3] */}
        <motion.div
          initial={false}
          animate={{
            scale: isActive ? 1.1 : 0.9,
            borderColor: isActive
              ? "rgb(59, 130, 246)"
              : "rgba(150, 150, 150, 0.35)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center shadow-sm"
        >
          <motion.span
            initial={false}
            animate={{
              scale: isActive ? 1 : 0,
              opacity: isActive ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,1)]"
          />
        </motion.div>
      </div>

      {/* --- DESKTOP OPPOSITE-SIDE WATERMARK NUMBER (For Alternating Mode) --- */}
      {isAlternating && (
        <div
          className={cn(
            "hidden lg:flex absolute top-1/2 -translate-y-1/2 pointer-events-none select-none items-center gap-3",
            isEven
              ? "right-[calc(50%+3rem)] justify-end"
              : "left-[calc(50%+3rem)] justify-start",
          )}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: isActive ? 0.16 : 0.06, scale: 1 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-7xl xl:text-8xl font-bold font-mono tracking-tighter text-foreground"
          >
            {event.year}
          </motion.span>
        </div>
      )}

      {/* --- CONTENT BLOCK --- */}
      <motion.div
        style={parallaxIntensity > 0 ? { y: yOffset } : undefined}
        initial={{
          opacity: 0,
          y: 28,
          x: 0,
          filter: "blur(8px)",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          x: 0,
          filter: "blur(0px)",
        }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "relative z-20 w-full pl-12 sm:pl-16 lg:pl-0",
          desktopSideClass,
        )}
      >
        {/* Inner Boot Wrapper */}
        <motion.div
          initial={{ x: initialX * 0.4 }}
          whileInView={{ x: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(variantStyles[cardVariant] || variantStyles.editorial)}
        >
          {/* Booting Status Header / Step Number[cite: 3] */}
          <div
            className={cn(
              "flex items-center gap-2.5 mb-2.5 font-mono text-xs sm:text-sm tracking-widest uppercase",
              cardAlignment === "left" || (isAlternating && !isEven)
                ? "lg:justify-end"
                : "justify-start",
            )}
          >
            <span
              className={cn(
                "font-semibold transition-colors duration-300",
                isActive ? "text-blue-400" : "text-muted-foreground",
              )}
            >
              {event.year}
            </span>

            {event.tag && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs px-2 py-0.5 rounded-full border transition-all duration-500",
                    isActive
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                      : "border-border/50 bg-muted/30 text-muted-foreground",
                  )}
                >
                  {event.tag}
                </span>
              </>
            )}
          </div>

          {/* Milestone Title[cite: 3] */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground font-sans mb-3 sm:mb-4 leading-snug">
            {event.title}
          </h3>

          {/* Optional Subtitle */}
          {event.subtitle && (
            <p className="text-xs sm:text-sm font-mono text-blue-400/90 mb-3 tracking-wide">
              {event.subtitle}
            </p>
          )}

          {/* Narrative Paragraph[cite: 3] */}
          <p className="text-sm sm:text-base md:text-[1.05rem] text-muted-foreground font-sans leading-[1.8] tracking-normal">
            {event.description}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ScrollTimeline = ({
  events = [],
  eyebrow = "SCROLL",
  title = "MY JOURNEY",
  subtitle = "",
  cardAlignment = "alternating", // "alternating" | "right" | "left"
  cardVariant = "glass", // "editorial" | "glass"
  progressIndicator = true,
  parallaxIntensity = 0.08,
  progressLineWidth = 2,
  className = "",
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start 75%", "end 65%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Modern Framer Motion v12 event listener
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const clamped = Math.max(0, Math.min(0.999, v));
    const newIndex = Math.floor(clamped * events.length);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative w-full overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* --- SECTION HEADER WITH BOOTING REVEAL[cite: 3] --- */}
      <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
        {/* {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-8 sm:mb-10"
          >
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-muted-foreground/80 mb-3">
              {eyebrow}
            </span>
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-8 bg-gradient-to-b from-blue-400 to-transparent"
            />
          </motion.div>
        )} */}

        {/* Booting Terminal Eyebrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/20 backdrop-blur-sm mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-muted-foreground">
            SYS.LOG // PERSONAL_ORIGIN_ARCHIVE
          </span>
        </motion.div>

        {/* Main Title[cite: 3] */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-foreground font-sans"
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-sans"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* --- TIMELINE TRACK & ITEMS --- */}
      <div className="relative max-w-5xl mx-auto">
        {/* Static Unfilled Background Track Line[cite: 3] */}
        <div
          style={{ width: `${progressLineWidth}px` }}
          className="absolute left-4 sm:left-6 lg:left-1/2 top-0 bottom-0 -translate-x-1/2 bg-border/50 dark:bg-white/10 z-10 rounded-full"
        />

        {/* Animated Glowing Progress Line + Comet Head */}
        {progressIndicator && (
          <>
            <motion.div
              className="absolute left-4 sm:left-6 lg:left-1/2 top-0 -translate-x-1/2 z-10 rounded-full"
              style={{
                height: progressHeight,
                width: `${progressLineWidth}px`,
                background:
                  "linear-gradient(to bottom, rgba(56,189,248,0.2), #38bdf8, #3b82f6, #818cf8)",
                boxShadow:
                  "0 0 12px rgba(59,130,246,0.6), 0 0 24px rgba(56,189,248,0.3)",
              }}
            />

            {/* Traveling Comet Head */}
            <motion.div
              className="absolute left-4 sm:left-6 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{ top: progressHeight }}
            >
              <motion.div
                animate={{ scale: [1, 1.35, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.8) 40%, rgba(59,130,246,0) 75%)",
                  boxShadow:
                    "0 0 14px 4px rgba(56,189,248,0.7), 0 0 28px 8px rgba(59,130,246,0.4)",
                }}
              />
            </motion.div>
          </>
        )}

        {/* Timeline Events List */}
        <div className="relative z-20 pt-2 pb-8">
          {events.map((event, index) => (
            <TimelineNodeItem
              key={event.id || index}
              event={event}
              index={index}
              isActive={index <= activeIndex}
              cardAlignment={cardAlignment}
              cardVariant={cardVariant}
              parallaxIntensity={parallaxIntensity}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollTimeline;

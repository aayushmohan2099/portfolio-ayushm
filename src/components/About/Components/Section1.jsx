// src/components/About/Components/Section1.jsx
import React from "react";
import { motion } from "framer-motion";
import Text3DFlip from "@/components/ui/text-3d-flip";
import dpImage from "@/assets/dp.jpg";

// Floating tag badge with directional pointer arrow
const FloatingBubble = ({
  text,
  bgClass,
  textClass,
  positionClass,
  arrowClass,
  arrowColorClass,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay, type: "spring", bounce: 0.4 },
        y: { repeat: Infinity, duration: 3.8, delay, ease: "easeInOut" },
      }}
      className={`absolute z-20 pointer-events-auto ${positionClass}`}
    >
      <div
        className={`relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold tracking-tight shadow-[0_8px_24px_rgba(0,0,0,0.25)] whitespace-nowrap font-sans transition-transform duration-300 hover:scale-105 ${bgClass} ${textClass}`}
      >
        {text}
        <svg
          className={`absolute w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ${arrowColorClass} ${arrowClass}`}
          viewBox="0 0 10 10"
        >
          <path d="M0,0 L10,0 L5,10 Z" />
        </svg>
      </div>
    </motion.div>
  );
};

export default function Section1() {
  return (
    <section className="relative w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-20 pt-4 md:pt-10 overflow-hidden">
      {/* --- TOP: Eyebrow, 3D Flip Heading & Subtext --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-5xl mx-auto"
      >
        {/* Eyebrow Indicator[cite: 2] */}
        <div className="inline-flex items-center gap-2.5 mb-5 sm:mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium text-muted-foreground font-mono">
            About Me
          </span>
        </div>

        {/* Bold 3D Flip Main Heading[cite: 2] */}
        <Text3DFlip
          as="h1"
          rotateDirection="top"
          staggerDuration={0.025}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-sans leading-[1.1] px-2"
          textClassName="text-foreground"
        >
          Hey! Thanks for stopping by
        </Text3DFlip>

        {/* Lighter Unbolded Subtitle[cite: 2] */}
        <div className="mt-5 sm:mt-6 space-y-1.5 text-sm sm:text-base md:text-xl font-normal text-muted-foreground font-sans tracking-normal max-w-2xl px-2">
          <p>Engineering Fluid Interfaces & Scalable Architectures</p>
          <p>Turning Complex Ideas Into High-Impact Digital Systems</p>
        </div>
      </motion.div>

      {/* --- BOTTOM: Interactive DP Ring & Floating Tags[cite: 2] --- */}
      <div className="relative mt-16 sm:mt-24 md:mt-28 w-full max-w-[320px] sm:max-w-[460px] md:max-w-[560px] h-[260px] sm:h-[300px] flex items-center justify-center">
        {/* Soft radial spotlight behind avatar */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Avatar Circle with Glowing Blue Ring[cite: 2] */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.35 }}
          whileHover={{ scale: 1.03 }}
          className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-1.5 bg-gradient-to-tr from-blue-500 via-sky-400 to-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.35)] z-10"
        >
          <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-white bg-muted">
            <img
              src={dpImage}
              alt="Ayush M"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Top-Left Tag[cite: 2] */}
        <FloatingBubble
          text="Full-Stack Architect"
          bgClass="bg-[#FACC15]"
          textClass="text-neutral-950"
          arrowColorClass="text-[#FACC15]"
          positionClass="top-4 left-0 sm:top-5 sm:left-4 md:top-5 md:left-10"
          arrowClass="-bottom-4 right-1 -rotate-45"
          delay={0.3}
        />

        {/* Top-Right Tag[cite: 2] */}
        <FloatingBubble
          text="UI/UX Engineer"
          bgClass="bg-[#C084FC]"
          textClass="text-neutral-950"
          arrowColorClass="text-[#C084FC]"
          positionClass="top-12 right-2 sm:top-6 sm:right-2 md:top-6 md:right-20"
          arrowClass="-bottom-4 left-3 rotate-45"
          delay={0.45}
        />

        {/* Center-Bottom Greeting Pill[cite: 2] */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.6,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute bottom-12 sm:bottom-9 md:bottom-9 -translate-x-1/2 z-20"
        >
          <div className="px-4 py-1 sm:px-5 sm:py-1.5 rounded-full bg-[#38BDF8] text-neutral-950 font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(56,189,248,0.5)] whitespace-nowrap">
            Hi! 🙌
          </div>
        </motion.div>

        {/* Bottom-Left Tag[cite: 2] */}
        <FloatingBubble
          text="API Specialist"
          bgClass="bg-[#F472B6]"
          textClass="text-neutral-950"
          arrowColorClass="text-[#F472B6]"
          positionClass="-bottom-1 left-0 sm:-bottom-4 sm:left-2 md:-bottom-4 md:left-20"
          arrowClass="-top-4 right-4 rotate-[195deg]"
          delay={0.75}
        />

        {/* Bottom-Right Tag[cite: 2] */}
        <FloatingBubble
          text="Systems Designer"
          bgClass="bg-[#60A5FA]"
          textClass="text-neutral-950"
          arrowColorClass="text-[#60A5FA]"
          positionClass="bottom-1 right-0 sm:-bottom-4 sm:right-2 md:-bottom-8 md:right-28"
          arrowClass="-top-4 left-4 -rotate-[210deg]"
          delay={0.9}
        />
      </div>
    </section>
  );
}

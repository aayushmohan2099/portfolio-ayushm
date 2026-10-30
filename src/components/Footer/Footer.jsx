// src\components\Footer\Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { LoopingWords } from "@/components/ui/looping-words";

const MENU_LINKS = [
  {
    label: "Home",
    path: "/home",
    variant: "curtain",
    overlayText: "RETURNING HOME",
  },
  {
    label: "About",
    path: "/about",
    variant: "overlay",
    overlayText: "LET ME SHOW YOU MY JOURNEY!",
  },
  {
    label: "Experience",
    path: "/experience",
    variant: "overlay",
    overlayText: "LET ME SHOW YOU MY WORK!",
  },
  {
    label: "Contact",
    path: "/contact-me",
    variant: "draw",
    overlayText: "CONNECTING...",
  },
];

const CONNECT_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayushms/",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:ayush.msrivastava@gmail.com",
    external: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/aayushmohan2099",
    external: true,
  },
];

// Boarding animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const Footer = () => {
  const handleRouteClick = (item) => {
    window.dispatchEvent(
      new CustomEvent("app-navigate", {
        detail: {
          path: item.path,
          variant: item.variant,
          changeTheme: 0,
          overlayText: item.overlayText,
        },
      }),
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-background text-foreground font-sans overflow-hidden pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 select-none touch-auto z-20">
      {/* Subtle Ambient Corner Glow matching the reference image[cite: 5] */}
      <div className="pointer-events-none absolute top-1/4 -right-32 w-[420px] h-[420px] rounded-full bg-foreground/[0.04] dark:bg-white/[0.04] blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
        className="max-w-6xl mx-auto flex flex-col items-center"
      >
        {/* --- TOP HERO: "Let's" + Looping Words ("Connect!", "Collaborate!", etc.)[cite: 5] --- */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col items-center justify-center text-center mb-14 sm:mb-20"
        >
          {/* Index 1 ("Connect!") sits in the active center bracket first, followed by "Collaborate!" */}
          <LoopingWords
            words={[
              "Let's Create!",
              "Let's Connect!",
              "Let's Collaborate!",
              "Let's Innovate!",
              "Let's Engineer!",
            ]}
          />
        </motion.div>

        {/* --- ANIMATED TOP DIVIDER LINE[cite: 5] --- */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[1px] bg-border origin-center mb-12 sm:mb-16"
        />

        {/* --- MIDDLE 3-COLUMN NAVIGATION & CONTACT GRID[cite: 5] --- */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-8 lg:gap-6 mb-14 sm:mb-20 text-left">
          {/* Column 1: MENU[cite: 5] */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 flex flex-col space-y-4"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Menu
            </span>
            <ul className="flex flex-col space-y-2.5 m-0 p-0 list-none">
              {MENU_LINKS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleRouteClick(item)}
                    className="text-sm sm:text-base font-normal text-foreground/85 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: CONNECT[cite: 5] */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 flex flex-col space-y-4"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Connect
            </span>
            <ul className="flex flex-col space-y-2.5 m-0 p-0 list-none">
              {CONNECT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1 text-sm sm:text-base font-normal text-foreground/85 hover:text-blue-400 transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    {link.external && (
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: SAY HELLO[cite: 5] */}
          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 lg:col-span-6 flex flex-col space-y-4"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Say Hello
            </span>

            <a
              href="mailto:ayush.msrivastava@gmail.com"
              className="text-lg sm:text-2xl md:text-[1.75rem] font-bold tracking-tight text-foreground hover:text-blue-400 transition-colors duration-300 break-all sm:break-normal w-fit"
            >
              ayush.msrivastava@gmail.com
            </a>

            {/* Availability Status Indicator[cite: 5] */}
            <div className="inline-flex items-center gap-2.5 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                Available for work — Lucknow, IN
              </span>
            </div>
          </motion.div>
        </div>

        {/* --- ANIMATED BOTTOM DIVIDER LINE[cite: 5] --- */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-20px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[1px] bg-border origin-center mb-6"
        />

        {/* --- BOTTOM COPYRIGHT & BACK TO TOP BAR[cite: 5] --- */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
        >
          <p className="m-0 text-center sm:text-left">
            ©{new Date().getFullYear()} Ayush M Srivastava — All rights reserved
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;

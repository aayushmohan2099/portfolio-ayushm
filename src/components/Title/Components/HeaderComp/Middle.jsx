// src/components/Title/HeaderComp/Middle.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightSign from "@/assets/sign_w.png";
import DarkSign from "@/assets/sign_b.png";
import { useTheme } from "next-themes";

// ==========================================
// CONFIGURATION: HEADER NAVIGATION SECTIONS
// Add, remove, or modify your navigation links here.
// ==========================================
const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
// ==========================================

const Middle = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const currentLogo = currentTheme === "dark" ? LightSign : DarkSign;

  return (
    <div className="relative h-full w-full flex items-center justify-center px-2 md:px-4 overflow-visible">
      {/* 
        The Floating Nav Pill 
        Note: overflow is visible so the logo can break out of the top/bottom bounds 
      */}
      <div className="relative flex h-16 w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/80 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-3xl dark:border-white/10 dark:bg-black/60 dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)]">
        {/* --- LEFT AREA: Status Indicator & Logo --- */}
        <div className="flex items-center gap-6">
          {/* Status Indicator (Hidden on mobile to save space) */}
          <div className="hidden lg:flex items-center gap-2 pl-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </span>
            <span className="text-xs font-medium text-green-500/90 whitespace-nowrap tracking-wide">
              Available for work
            </span>
          </div>

          <div className="relative flex h-full items-center z-20">
            <img
              src={currentLogo}
              alt="Ayush Signature"
              className="
                h-20
                w-auto
                object-contain
                select-none
                pointer-events-none
                brightness-110
                "
              draggable={false}
            />

            {/* Spacer */}
            <div className="hidden md:block w-16" />
          </div>
        </div>

        {/* --- CENTER AREA: Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-1 relative z-10">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`relative px-4 py-4 text-sm font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative z-10">{section.label}</span>

              {/* Fluid Active Indicator Line & Glow */}
              {activeSection === section.id && (
                <>
                  <motion.div
                    layoutId="active-nav-line"
                    className="absolute bottom-1 left-1/4 right-1/4 h-[2px] rounded-t-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 -z-10 rounded-full bg-blue-500/10 blur-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                </>
              )}
            </button>
          ))}
        </nav>

        {/* --- RIGHT AREA: Call to Action & Mobile Toggle --- */}
        <div className="flex items-center gap-3">
          {/* Let's Connect Button */}
          <button
            className="group relative inline-flex w-fit shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-foreground transition-all duration-300 hover:border-blue-500/60 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/ayushms/",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <span className="relative z-10">Let's Connect</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 text-blue-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
            {/* Hover shine sweep effect */}
            <div className="absolute inset-0 -z-10 -translate-x-[100%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]"></div>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="flex md:hidden flex-col justify-center gap-1.5 p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`h-0.5 w-5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-20 left-4 right-4 z-50 flex flex-col gap-2 rounded-2xl border border-border/50 bg-background/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {NAV_SECTIONS.map((section) => (
              <button
                key={`mobile-${section.id}`}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {section.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Middle;

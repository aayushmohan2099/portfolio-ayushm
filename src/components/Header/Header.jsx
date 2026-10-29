// src/components/Header/Header.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Left from "./HeaderComp/Left";
import Middle from "./HeaderComp/Middle";
import Right from "./HeaderComp/Right";
import HeaderBlob from "@/components/ui/header-blob";
import { NeonFont } from "@/components/ui/oc/NeonFont";
import dpImage from "@/assets/dp.jpg";

const Header = ({ shouldStartMusic, isContracted = false, onExpand }) => {
  return (
    <div className="relative z-50 min-h-[60px] w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 sm:gap-2 md:grid-cols-[1fr_auto_1fr] md:gap-0 overflow-visible pointer-events-auto">
      {/* --- LEFT SECTION: Music Player --- */}
      <div className="flex items-center justify-start shrink-0">
        <Left shouldStartMusic={shouldStartMusic} />
      </div>

      {/* --- CENTER SECTION: Contracts to Pill / Expands to Full Navbar --- */}
      <div className="flex min-w-0 w-full items-center justify-center overflow-visible mx-0 md:mx-auto md:w-auto">
        <AnimatePresence mode="wait">
          {isContracted ? (
            /* Contracted Pill Layout */
            <motion.div
              key="contracted-header-pill"
              layoutId="header-middle-bar"
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 26,
                mass: 0.8,
              }}
              onClick={onExpand}
              className="group relative flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-6 rounded-full border border-border/50 bg-background/80 px-3 sm:px-5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-3xl dark:border-white/10 dark:bg-black/60 dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)] cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] transition-all duration-300 select-none"
            >
              {/* Profile Photo & Green Indicator */}
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="relative group/dp w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border/50 overflow-visible shrink-0 shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
                    <img
                      src={dpImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover/dp:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 flex h-3 w-3 sm:h-3.5 sm:w-3.5 translate-x-[15%] translate-y-[15%]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-green-500 border-[2px] border-background shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  </span>
                </div>

                {/* Neon Logo */}
                <div className="flex items-center shrink-0">
                  <NeonFont text="ayushmohan" fontSize="1.45rem" blur="16px" />
                </div>
              </div>

              {/* Glowing Rotating Sphere Animation on Rightmost Side */}
              <div className="flex items-center shrink-0 pl-1 sm:pl-2">
                <HeaderBlob size={32} />
              </div>
            </motion.div>
          ) : (
            /* Full Navigation Header */
            <motion.div
              key="expanded-header-bar"
              layoutId="header-middle-bar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 26,
                mass: 0.8,
              }}
              className="w-full flex items-center justify-center"
            >
              <Middle />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- RIGHT SECTION: Date/Time & Theme Toggler --- */}
      <div className="flex items-center justify-end shrink-0">
        <Right />
      </div>
    </div>
  );
};

export default Header;

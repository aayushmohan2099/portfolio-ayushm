// src/components/Title/MainPanel.jsx
import React, { useState, useEffect } from "react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { useTheme } from "next-themes";
import { motion } from "framer-motion"; // Added framer-motion

// Import the center logos based on your project structure
import logoWhite from "@/assets/mid/mid_logo_w.png";
import logoBlack from "@/assets/mid/mid_logo_b.png";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "django",
  "react",
  "flutter",
  "android",
  "html5",
  "python",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "django",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "python",
  "androidstudio",
  "react",
  "figma",
];

// EASY CONFIGURATION: Adjust icon sizes layer by layer here.
const ICON_SIZES = {
  layer1: 34, // Inner ring
  layer2: 50, // Middle-inner ring
  layer3: 67, // Middle-outer ring
  layer4: 70, // Outer ring
};

const MainPanel = ({ animDelay = 0.5 }) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // FIX 1: Fixed URL mapping structure to pull native vector icons without 404 response errors
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}`);

  // Segmenting the 30 active icons into 4 concentric layers to prevent collision paths
  const layer1 = images.slice(0, 5); // 5 icons (Inner ring)
  const layer2 = images.slice(5, 12); // 7 icons (Middle-inner ring)
  const layer3 = images.slice(12, 21); // 9 icons (Middle-outer ring)
  const layer4 = images.slice(21, 30); // 9 icons (Outer ring)

  // Wait until mounted to render theme-dependent UI to avoid SSR hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the exact current theme (handling the "system" default edge case)
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const currentLogo = currentTheme === "dark" ? logoWhite : logoBlack;

  return (
    <div className="relative h-full min-h-[700px] w-full flex items-center justify-center overflow-visible">
      {/* FIX 2: Bulletproof Orbit Keyframe Engine Injection */}
      <style>{`
        .animate-orbit {
            animation: orbit calc(var(--duration) * 1s) linear infinite;
            will-change: transform; /* Added GPU acceleration for more fluid animation */
        }
        @keyframes orbit {
            0% {
                transform: rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg));
            }
            100% {
                transform: rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg));
            }
        }
      `}</style>

      {/* Center Theme-Aware Logo - Mounts First */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            delay: animDelay,
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
          }}
          className="absolute z-10 flex items-center justify-center pointer-events-none"
        >
          <img
            src={currentLogo}
            alt="Core Framework Logo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-contain transition-opacity duration-300"
            draggable={false}
          />
        </motion.div>
      )}

      {/* Layer 1: Inner Orbit Configuration - Mounts Second */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: animDelay + 0.2,
          duration: 0.8,
          type: "spring",
          bounce: 0.3,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <OrbitingCircles
          radius={150}
          duration={25}
          iconSize={ICON_SIZES.layer1}
        >
          {layer1.map((url, idx) => (
            <img
              key={`layer1-${idx}`}
              src={url}
              alt="tech-icon"
              className="object-contain"
              style={{
                width: `${ICON_SIZES.layer1}px`,
                height: `${ICON_SIZES.layer1}px`,
              }}
              draggable={false}
            />
          ))}
        </OrbitingCircles>
      </motion.div>

      {/* Layer 2: Middle-Inner Orbit Configuration (Counter-Clockwise) - Mounts Third */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: animDelay + 0.4,
          duration: 0.8,
          type: "spring",
          bounce: 0.3,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <OrbitingCircles
          radius={210}
          duration={30}
          reverse
          iconSize={ICON_SIZES.layer2}
        >
          {layer2.map((url, idx) => (
            <img
              key={`layer2-${idx}`}
              src={url}
              alt="tech-icon"
              className="object-contain"
              style={{
                width: `${ICON_SIZES.layer2}px`,
                height: `${ICON_SIZES.layer2}px`,
              }}
              draggable={false}
            />
          ))}
        </OrbitingCircles>
      </motion.div>

      {/* Layer 3: Middle-Outer Orbit Configuration - Mounts Fourth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: animDelay + 0.6,
          duration: 0.8,
          type: "spring",
          bounce: 0.3,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <OrbitingCircles
          radius={350}
          duration={40}
          iconSize={ICON_SIZES.layer3}
        >
          {layer3.map((url, idx) => (
            <img
              key={`layer3-${idx}`}
              src={url}
              alt="tech-icon"
              className="object-contain"
              style={{
                width: `${ICON_SIZES.layer3}px`,
                height: `${ICON_SIZES.layer3}px`,
              }}
              draggable={false}
            />
          ))}
        </OrbitingCircles>
      </motion.div>

      {/* Layer 4: Outer Orbit Configuration (Counter-Clockwise) - Mounts Fifth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: animDelay + 0.8,
          duration: 0.8,
          type: "spring",
          bounce: 0.3,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <OrbitingCircles
          radius={540}
          duration={50}
          reverse
          iconSize={ICON_SIZES.layer4}
        >
          {layer4.map((url, idx) => (
            <img
              key={`layer4-${idx}`}
              src={url}
              alt="tech-icon"
              className="object-contain"
              style={{
                width: `${ICON_SIZES.layer4}px`,
                height: `${ICON_SIZES.layer4}px`,
              }}
              draggable={false}
            />
          ))}
        </OrbitingCircles>
      </motion.div>
    </div>
  );
};

export default MainPanel;

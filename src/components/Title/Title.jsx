// src/components/Title.jsx
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

import Header from "./Components/Header";
import LeftPanel from "./Components/LeftPanel";
import MainPanel from "./Components/MainPanel";
import RightPanel from "./Components/RightPanel";
import Footer from "./Components/Footer";

// ==========================================
// CONFIGURATION: TEXT ANIMATION DELAYS
// Adjust these values (in seconds) to control
// exactly when the left and right texts appear.
// ==========================================
const LEFT_TEXT_DELAY = 1.0;
const RIGHT_TEXT_DELAY = 1.5;
// ==========================================

const Title = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    // Changed to min-h-screen for mobile scrolling, keeping overflow-hidden on desktop
    <div className="title-bg-anim relative w-full min-h-screen md:h-screen overflow-x-hidden md:overflow-hidden">
      {/* Blur layer */}
      <div className="absolute inset-0 z-[2] backdrop-blur-[1px] pointer-events-none" />

      <section
        ref={ref}
        className="relative z-10 min-h-screen md:h-screen w-full p-4 md:p-6 pointer-events-none"
      >
        {/* Switched from strict grid to a responsive flex-col that snaps to grid on medium screens */}
        <div className="h-full w-full flex flex-col md:grid md:grid-cols-[1fr_3fr_1fr] md:grid-rows-[60px_1fr_60px] gap-2 pointer-events-auto">
          {/* Header (1) */}
          <div className="w-full md:col-span-3 order-1 md:order-none z-50">
            <Header />
          </div>

          {/* Left (2) */}
          <div className="w-full order-2 md:order-none z-30 pt-8 md:pt-0">
            <LeftPanel
              textY={textY}
              opacity={opacity}
              scale={scale}
              animDelay={LEFT_TEXT_DELAY}
            />
          </div>

          {/* Main (3) - Scaled down on mobile to prevent massive overflow, placed below text */}
          <div className="w-full order-4 md:order-none z-10 flex items-center justify-center -my-24 md:my-0 scale-[0.6] sm:scale-75 md:scale-100 origin-top md:origin-center">
            <MainPanel />
          </div>

          {/* Right (4) - Reordered on mobile to appear right after the Left text */}
          <div className="w-full order-3 md:order-none z-30 pb-4 md:pb-0 text-right md:text-left">
            <RightPanel
              textY={textY}
              opacity={opacity}
              scale={scale}
              animDelay={RIGHT_TEXT_DELAY}
            />
          </div>

          {/* Footer (5) */}
          <div className="w-full md:col-span-3 order-5 md:order-none mt-auto md:mt-0">
            <Footer />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Title;

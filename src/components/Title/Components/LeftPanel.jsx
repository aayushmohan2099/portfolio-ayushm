// src/components/Title/LeftPanel.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";

const LeftPanel = ({ textY, opacity, scale, animDelay = 0 }) => {
  const [startAnimation, setStartAnimation] = useState(false);

  // Waits for the delay configured in Title.jsx before triggering the animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, animDelay * 1000); // Converts seconds to milliseconds

    return () => clearTimeout(timer);
  }, [animDelay]);

  return (
    <motion.div
      style={{ y: textY, opacity, scale }}
      className="h-full flex flex-col justify-center px-8"
    >
      <div className="relative">
        {/* Invisible placeholder guarantees the layout doesn't shift or collapse while waiting for the delay */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-sans opacity-0 pointer-events-none select-none">
          I turn complex ideas
        </h1>

        {/* The actual animated text overlays the placeholder exactly when the delay finishes */}
        {startAnimation && (
          <div className="absolute top-0 left-0 w-full h-full">
            <TextAnimate
              animation="blurIn"
              as="h1"
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-sans"
            >
              I turn complex ideas
            </TextAnimate>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeftPanel;

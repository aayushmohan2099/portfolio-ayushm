// src/components/ui/oc/ScrollBlurTransition.jsx
import React from "react";
import { motion } from "framer-motion";

export function ScrollBlurTransition({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      // 1. Initial State: Hidden, pushed down 60px (parallax feel), blurred, and slightly shrunk
      initial={{ opacity: 0, y: 60, filter: "blur(12px)", scale: 0.96 }}
      // 2. In-View State: Fully opaque, resets position/scale, completely sharp
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      // 3. Viewport Config: Triggers when the element is 10% into the screen.
      // 'once: false' means it will replay the animation if you scroll up and down.
      viewport={{ once: false, margin: "-10%" }}
      // 4. Physics: Uses a gentle spring for a smooth, premium easing curve
      transition={{
        duration: 0.8,
        delay: delay,
        type: "spring",
        bounce: 0.3,
      }}
      // 5. Performance: Hardware acceleration on the specific animated properties
      className={`will-change-[opacity,transform,filter] ${className}`}
    >
      {children}
    </motion.div>
  );
}

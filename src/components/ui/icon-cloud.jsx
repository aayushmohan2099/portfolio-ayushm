"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Helper to extract a clean technology name from the SimpleIcons URL
const formatName = (url) => {
  if (!url) return "Tech";
  const parts = url.split("/");
  let slug = parts[parts.length - 1] || parts[parts.length - 2];
  if (!slug) return "Technology";

  const map = {
    nodedotjs: "Node.js",
    nextdotjs: "Next.js",
    amazonaws: "AWS",
    postgresql: "PostgreSQL",
    html5: "HTML5",
    css3: "CSS3",
    visualstudiocode: "VS Code",
    typescript: "TypeScript",
    javascript: "JavaScript",
    react: "React",
    docker: "Docker",
    github: "GitHub",
  };

  if (map[slug]) return map[slug];
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

export function IconCloud({ icons, images }) {
  const [isExploded, setIsExploded] = useState(false);

  const orbControls = useAnimation();
  const iconControls = useAnimation();

  const iconRefs = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  // Framer Motion values for scene rotation
  const sceneRotX = useMotionValue(0);
  const sceneRotY = useMotionValue(0);

  // Inverse rotation for the icons so they always face the camera (Billboarding)
  const negRotX = useTransform(sceneRotX, (v) => -v);
  const negRotY = useTransform(sceneRotY, (v) => -v);

  // Generate 3D Spherical Coordinates for the Galaxy
  const parsedIcons = useMemo(() => {
    const items = icons ?? images ?? [];
    const count = items.length;
    const baseRadius = 200;

    return items.map((item, i) => {
      // Fibonacci sphere distribution
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      // Add slight randomness to radius for a "galaxy" cluster feel rather than a perfect shell
      const r = baseRadius + (Math.random() - 0.5) * 60;

      return {
        id: i,
        url: item,
        name: formatName(item),
        x: r * Math.cos(theta) * Math.sin(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi),
        randomDelay: Math.random() * 2, // Desynchronize floating
      };
    });
  }, [icons, images]);

  // Orchestrate the Explosion Sequence
  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      // 1. Orb appears and pulses
      await orbControls.start({
        scale: [0, 1.1, 1],
        opacity: [0, 1, 1],
        transition: { duration: 0.6, times: [0, 0.6, 1], ease: "easeOut" },
      });

      if (!isMounted) return;

      // 2. Compress (Storing energy)
      await orbControls.start({
        scale: 0.82,
        boxShadow: "0px 0px 40px 10px rgba(0, 220, 255, 0.8)",
        transition: { duration: 0.2, ease: "easeInOut" },
      });

      if (!isMounted) return;

      // 3. Explode (Release energy)
      setIsExploded(true);
      orbControls.start({
        scale: 4,
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 0.5, ease: "easeOut" },
      });

      // 4. Icons shoot outward with magnetic spring physics
      iconControls.start((i) => ({
        x: parsedIcons[i].x,
        y: parsedIcons[i].y,
        z: parsedIcons[i].z,
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 16,
          mass: 0.8,
          delay: Math.random() * 0.15, // Staggered release
        },
      }));
    };

    sequence();
    return () => {
      isMounted = false;
    };
  }, [orbControls, iconControls, parsedIcons]);

  // Handle continuous rotation, mouse tilt, and 3D depth calculations
  useEffect(() => {
    if (!isExploded) return;

    const animateRenderLoop = (time) => {
      const t = time / 1000;

      // Base slow orbit
      const orbitSpeed = 0.05;
      const orbitY = t * orbitSpeed;
      const orbitX = Math.sin(t * orbitSpeed * 0.5) * 0.15;

      // Mouse influence (max tilt ~15 degrees)
      const targetTiltX = mousePos.current.y * 0.26;
      const targetTiltY = mousePos.current.x * 0.26;

      // Smooth interpolation for heavy floating feel
      currentTilt.current.x += (targetTiltX - currentTilt.current.x) * 0.04;
      currentTilt.current.y += (targetTiltY - currentTilt.current.y) * 0.04;

      const finalRotX = orbitX - currentTilt.current.x;
      const finalRotY = orbitY + currentTilt.current.y;

      // Apply to framer motion values
      sceneRotX.set(finalRotX);
      sceneRotY.set(finalRotY);

      // --- Custom CSS 3D Fog & Depth Calculation ---
      const cosX = Math.cos(finalRotX);
      const sinX = Math.sin(finalRotX);
      const cosY = Math.cos(finalRotY);
      const sinY = Math.sin(finalRotY);

      iconRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = parsedIcons[i];

        // Calculate World Z position to determine depth
        const z1 = item.x * sinY + item.z * cosY;
        const worldZ = item.y * sinX + z1 * cosX;

        // Normalize depth: -250 (far) to +250 (close) -> 0.0 to 1.0
        const depth = (worldZ + 250) / 500;
        const clampedDepth = Math.max(0, Math.min(1, depth));

        // Adjust opacity, blur, and brightness based on distance
        const opacity = 0.15 + clampedDepth * 0.85;
        const blur = (1 - clampedDepth) * 3.5;
        const brightness = 0.5 + clampedDepth * 0.8;

        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`;
      });

      requestRef.current = requestAnimationFrame(animateRenderLoop);
    };

    requestRef.current = requestAnimationFrame(animateRenderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isExploded, parsedIcons, sceneRotX, sceneRotY]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mousePos.current = { x, y };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: 0, y: 0 };
  };

  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-xl bg-[#050505]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      {/* Background Styling: Futuristic Grid and Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* Internal CSS for the subtle localized floating of icons */}
      <style>{`
        @keyframes float-icon {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-4px) rotate(1.5deg); }
          66% { transform: translateY(2px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-icon {
          animation: float-icon 4s ease-in-out infinite alternate;
        }
      `}</style>

      {/* The Central Glowing Orb */}
      {!isExploded && (
        <motion.div
          animate={orbControls}
          initial={{ scale: 0, opacity: 0 }}
          className="absolute z-10 w-12 h-12 rounded-full bg-blue-400"
          style={{
            boxShadow:
              "0px 0px 30px 4px rgba(59, 130, 246, 0.6), inset 0px 0px 10px 2px rgba(255, 255, 255, 0.8)",
          }}
        />
      )}

      {/* 3D Scene Container */}
      <motion.div
        className="relative flex items-center justify-center z-20 pointer-events-auto"
        style={{
          rotateX: sceneRotX,
          rotateY: sceneRotY,
          transformStyle: "preserve-3d",
        }}
      >
        {parsedIcons.map((icon, i) => (
          // Positions the icon in 3D Space (Explosion controls this)
          <motion.div
            key={icon.id}
            custom={i}
            initial={{ x: 0, y: 0, z: 0, scale: 0, opacity: 0 }}
            animate={iconControls}
            className="absolute flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Reverses the scene rotation so the icon faces the camera (Billboarding) */}
            <motion.div
              ref={(el) => (iconRefs.current[i] = el)}
              style={{
                rotateX: negRotX,
                rotateY: negRotY,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
              }}
            >
              {/* Applies the subtle asynchronous CSS floating animation */}
              <div
                className="animate-float-icon"
                style={{ animationDelay: `-${icon.randomDelay}s` }}
              >
                {/* The Interactive Icon Node */}
                <motion.div
                  className="relative flex items-center justify-center group cursor-pointer"
                  whileHover={{
                    scale: 1.28,
                    transition: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg whitespace-nowrap">
                    {icon.name}
                  </div>

                  {/* Icon Image */}
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:bg-white/10 transition-all duration-300">
                    <img
                      src={icon.url}
                      alt={icon.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-300"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

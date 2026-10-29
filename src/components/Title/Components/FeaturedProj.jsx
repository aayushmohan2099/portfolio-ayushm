// src/components/Title/Components/FeaturedProj.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ThreeDBendCarousel, {
  CarouselMedia,
} from "@/components/ui/3d-bend-carousel";

// Projects
import upsrlmThumb from "../../../assets/proj/upsrlm/thumb.png";
import pr_vid from "../../../assets/proj/upsrlm/pr_vid.mp4";
import tjs_vid from "../../../assets/proj/tjs/tjs_vid.mp4";
import abhrms_vid from "../../../assets/proj/abhrms/abhrms_vid.mp4";
import eatpur_vid from "../../../assets/proj/eatpur/eatpur_vid.mp4";

import tjsThumb from "../../../assets/proj/tjs/thumb.png";
import eatpurThumb from "../../../assets/proj/eatpur/thumb.png";
import abhrmsThumb from "../../../assets/proj/abhrms/thumb.png";

// ==========================================
// FEATURED PROJECTS METADATA (Sourced from CV)
// ==========================================
const PROJECTS = [
  {
    id: 1,
    title: "PRAGATI SETU - UPSRLM",
    tagline: "State-Scale Rural Governance & MIS Ecosystem",
    badge: "01",
    link: "https://upsrlmtms.upsdc.gov.in/",
    // Placeholder image: replace with your project screenshot, GIF, or video
    media: upsrlmThumb,
    video: pr_vid,
    thumbnail: upsrlmThumb,
    oneLiner:
      "Architected the foundational BMS & TMS ecosystem consolidating multi-tier rural beneficiary records with biometric verification across Uttar Pradesh.",
    metrics: "6.5L+ Cadres Managed",
  },
  {
    id: 2,
    title: "AB Enterprises HRMS",
    tagline: "Enterprise Human Resource Management Suite",
    badge: "02",
    link: "https://ab-hrms.in/",
    // Placeholder image: replace with your project screenshot, GIF, or video
    media: abhrmsThumb,
    thumbnail: abhrmsThumb,
    video: abhrms_vid,
    oneLiner:
      "Engineered automated enterprise workforce management featuring multi-role access hierarchies, payroll normalization, and compliance pipelines.",
    metrics: "End-to-End Automation",
  },
  {
    id: 3,
    title: "EatPur Naturals",
    tagline: "D2C E-Commerce & Distribution Platform",
    badge: "03",
    link: "https://eatpur.in/",
    // Placeholder image: replace with your project screenshot, GIF, or video
    media: eatpurThumb,
    video: eatpur_vid,
    thumbnail: eatpurThumb,
    oneLiner:
      "High-conversion direct-to-consumer store with optimized real-time inventory synchronization, sub-second checkout, and payment gateways.",
    metrics: "Ultra-Fast Checkout",
  },
  {
    id: 4,
    title: "The Jungle Story",
    tagline: "Boutique Hospitality & Luxury Resort Experience",
    badge: "04",
    link: "https://www.thejunglestory.in/",
    // Placeholder image: replace with your project screenshot, GIF, or video
    media: tjsThumb,
    thumbnail: tjsThumb,
    video: tjs_vid,
    oneLiner:
      "Immersive, motion-first resort showcase designed with micro-interactions, room reservation routing, and editorial typography.",
    metrics: "60fps Motion UI",
  },
];

export default function FeaturedProj() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Dynamically size carousel cards maintaining a sharp 16:9 ratio
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive project card width
  const cardWidth =
    viewportWidth < 640
      ? Math.min(viewportWidth - 32, 400) // Mobile
      : viewportWidth < 1024
        ? Math.min(viewportWidth - 48, 640) // Tablet
        : Math.min(viewportWidth - 80, 1060); // Desktop

  return (
    <section className="relative w-full bg-background text-foreground py-20 sm:py-28 overflow-hidden touch-auto">
      {/* Top Header Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        {/* "• SINCE 2022" badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-xs uppercase tracking-widest font-mono text-muted-foreground font-semibold">
            SINCE 2022
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans">
          Featured Work
        </h2>

        {/* Subtitle statement */}
        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl font-sans leading-relaxed">
          I blend technology, systems architecture, and motion to craft
          high-performance digital platforms that bridge people, state-scale
          data, and resilient services.
        </p>
      </div>

      {/* 3D Bend Carousel Viewport */}
      <div className="relative w-full flex justify-center items-center overflow-visible">
        <ThreeDBendCarousel
          items={PROJECTS}
          itemWidth={cardWidth}
          aspectRatio={16 / 9}
          // Card spacing
          gap={viewportWidth < 640 ? -16 : viewportWidth < 1024 ? -35 : -55}
          // 3D perspective
          perspective={
            viewportWidth < 640 ? 900 : viewportWidth < 1024 ? 1200 : 1450
          }
          // Curvature of the carousel
          bendAngle={viewportWidth < 640 ? 20 : viewportWidth < 1024 ? 27 : 30}
          // Distance of inactive cards from the viewer
          depth={viewportWidth < 640 ? 180 : viewportWidth < 1024 ? 280 : 380}
          // Dynamically allocate height based on card dimensions
          height={Math.round(
            cardWidth / (16 / 9) + (viewportWidth < 640 ? 100 : 120),
          )}
          // Active card emphasis
          activeScale={1.03}
          loop={true}
          autoPlay={false}
          renderItem={(project, index, isCenter) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                className="group/proj relative w-full h-full overflow-hidden bg-zinc-950 flex flex-col justify-between"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* ==================================================== */}
                {/* MEDIA VIEWPORT (16:9)                                */}
                {/* To show video or GIF, replace <img> with:           */}
                {/* <video src="..." autoPlay loop muted playsInline />  */}
                {/* ==================================================== */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <CarouselMedia
                    item={project}
                    isActive={isCenter}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/proj:scale-105 pointer-events-none"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />
                </div>

                {/* Top Badge Pill & Metric */}
                <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                  <span className="px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full backdrop-blur-md bg-black/60 text-white border border-white/15 shadow-md">
                    {project.badge}
                  </span>
                  <span className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-zinc-200 border border-white/10">
                    {project.metrics}
                  </span>
                </div>

                {/* Centered Bouncing "View Project" Glassmorphism Tooltip */}
                <AnimatePresence>
                  {isHovered && isCenter && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8, y: 12 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -6, 0],
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: 8 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        y: {
                          repeat: Infinity,
                          repeatType: "mirror",
                          duration: 1.4,
                          ease: "easeInOut",
                        },
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 z-30 m-auto inline-flex h-fit w-fit items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_0_24px_rgba(59,130,246,0.6)] border border-blue-400/40 backdrop-blur-xl pointer-events-auto cursor-pointer"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  )}
                </AnimatePresence>

                {/* Bottom Information Bar */}
                <div className="relative z-10 p-4 sm:p-6 text-white select-none">
                  <p className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
                    {project.tagline}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1.5 flex items-center justify-between">
                    <span>{project.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed opacity-90 max-w-xl">
                    {project.oneLiner}
                  </p>
                </div>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}

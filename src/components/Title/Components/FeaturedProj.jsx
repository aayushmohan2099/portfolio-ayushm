// src/components/Title/Components/FeaturedProj.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ThreeDBendCarousel from "@/components/ui/3d-bend-carousel";
import pr_vid from "../../../assets/proj/upsrlm/pr_vid.mp4";

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
    media: pr_vid,
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
    media:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
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
    media:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop",
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
    media:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
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

  const cardWidth =
    viewportWidth < 640
      ? Math.min(viewportWidth - 48, 380)
      : viewportWidth < 1024
        ? 540
        : 720;

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
          gap={viewportWidth < 640 ? -24 : -50}
          perspective={1100}
          bendAngle={viewportWidth < 640 ? 25 : 36}
          depth={viewportWidth < 640 ? 220 : 360}
          height={viewportWidth < 640 ? 320 : 480}
          activeScale={1.04}
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
                  <img
                    src={project.media}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/proj:scale-105 pointer-events-none"
                    loading="lazy"
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
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_0_24px_rgba(59,130,246,0.6)] border border-blue-400/40 backdrop-blur-xl pointer-events-auto cursor-pointer"
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

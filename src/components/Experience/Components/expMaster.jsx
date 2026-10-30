// src/components/Experience/Components/expMaster.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  IdCard,
  X,
} from "lucide-react";
import { HangingIdCard } from "@/components/ui/id-card";

// Dynamically discover all job & project assets inside /src/assets/jobs/**
const rawJobAssets = import.meta.glob(
  "/src/assets/jobs/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" },
);

// Resolve a single image path like "upsrlm/dp.jpg" or "upsrlm.png"
function resolveSingleJobAsset(relativePath) {
  if (!relativePath) return null;
  const clean = relativePath.replace(/^\/+/, "").toLowerCase();
  const match = Object.entries(rawJobAssets).find(([path]) =>
    path.toLowerCase().endsWith(`/jobs/${clean}`),
  );
  return match ? match[1] : null;
}

// Resolve and numerically sort (1.png, 2.png, 3.png...) all screenshots inside a project folder
function resolveFolderScreenshots(folderPath) {
  if (!folderPath) return [];
  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, "").toLowerCase();

  const matches = Object.entries(rawJobAssets).filter(([path]) =>
    path.toLowerCase().includes(`/jobs/${cleanFolder}/`),
  );

  matches.sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/(\d+)\.[a-zA-Z]+$/)?.[1] ?? "999", 10);
    const numB = parseInt(pathB.match(/(\d+)\.[a-zA-Z]+$/)?.[1] ?? "999", 10);
    return numA - numB || pathA.localeCompare(pathB);
  });

  return matches.map(([, url]) => url);
}

// ============================================================================
// INDIVIDUAL PROJECT TILE WITH AUTO-SLIDESHOW & CLICKABLE ACTION
// ============================================================================
const ProjectShowcaseTile = ({ project, index }) => {
  const screenshots = useMemo(
    () => resolveFolderScreenshots(project.assetFolder),
    [project.assetFolder],
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const totalSlides = screenshots.length;

  // Automatic slideshow timer (pauses while hovering so user can inspect screenshots)
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3400);
    return () => clearInterval(timer);
  }, [totalSlides, isHovered]);

  const handleTileClick = () => {
    if (project.link && project.link !== "#") {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleStepSlide = (e, dir) => {
    e.stopPropagation();
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + dir + totalSlides) % totalSlides);
  };

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    setCurrentSlide(idx);
  };

  const toggleSpecs = (e) => {
    e.stopPropagation();
    setShowSpecs((prev) => !prev);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTileClick}
      className="group relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-b border-border/60 dark:border-white/10 md:odd:border-r transition-colors duration-300 hover:bg-muted/15 dark:hover:bg-white/[0.015] cursor-pointer"
    >
      <div>
        {/* --- 1. TOP ROUNDED IMAGE SLIDESHOW SHOWCASE FRAME --- */}
        <div className="relative w-full aspect-[16/10] rounded-2xl sm:rounded-[22px] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-border/70 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)] mb-7 sm:mb-8">
          {totalSlides > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={screenshots[currentSlide]}
                src={screenshots[currentSlide]}
                alt={`${project.title} — Screenshot ${currentSlide + 1}`}
                draggable={false}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{
                  opacity: 1,
                  scale: isHovered ? 1.02 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full object-cover object-top block"
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-indigo-500/10">
              <Layers className="w-10 h-10 text-emerald-400 mb-3 opacity-80" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {project.eyebrow}
              </span>
              <span className="font-sans text-lg font-bold text-foreground mt-1">
                {project.title}
              </span>
            </div>
          )}

          {/* Subtle Top-Left Slide Counter Pill */}
          {totalSlides > 1 && (
            <div className="absolute top-3.5 left-3.5 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-widest uppercase pointer-events-none">
              {currentSlide + 1} / {totalSlides}
            </div>
          )}

          {/* Top-Right External Launch Pill on Hover */}
          <div className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
            <span>{project.linkLabel || "Open Project"}</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
          </div>

          {/* Manual Prev / Next Controls (Appear on Hover or Touch) */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => handleStepSlide(e, -1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => handleStepSlide(e, 1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bottom Slide Progress Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                {screenshots.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={(e) => handleDotClick(e, sIdx)}
                    aria-label={`Go to slide ${sIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === sIdx
                        ? "w-5 bg-emerald-400"
                        : "w-1.5 bg-white/45 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- 2. EDITORIAL CAPTION (Matches Reference Screenshot) --- */}
        <div className="space-y-2.5 text-left">
          {/* Eyebrow Category Label */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.eyebrow || project.category}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 dark:text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              <span>{project.linkLabel || "Visit"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Bold Project Title */}
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {project.title}
          </h3>

          {/* Concise Description */}
          <p className="text-sm sm:text-[15px] text-muted-foreground font-sans leading-relaxed line-clamp-3">
            {project.shortDesc}
          </p>
        </div>
      </div>

      {/* --- 3. TECH TAGS & EXPANDABLE ARCHITECTURE SPECS --- */}
      <div className="pt-5 mt-5 border-t border-border/40 dark:border-white/5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(project.techStack || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-md bg-muted/50 border border-border/60 text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <button
              type="button"
              onClick={toggleSpecs}
              className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-foreground/75 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{showSpecs ? "Hide Specs" : "Key Impact"}</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSpecs && project.highlights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
              className="overflow-hidden cursor-default"
            >
              <ul className="mt-2 p-4 rounded-xl bg-card/70 dark:bg-neutral-900/80 border border-border/60 space-y-2 text-xs text-muted-foreground leading-relaxed list-none m-0">
                {project.highlights.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

// ============================================================================
// MASTER EXPERIENCE PAGE COMPONENT (expMaster.jsx)
// ============================================================================
export default function ExpMaster({ data }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileIdOpen, setMobileIdOpen] = useState(false);

  const categories = data?.categories || ["All", "Govt", "Private", "In-House"];
  const projects = data?.projects || [];
  const idCardConfig = data?.idCard || {};

  // Resolve ID Card Avatar (`src/assets/jobs/upsrlm/dp.jpg`) & Company Logo (`src/assets/jobs/upsrlm.png`)
  const resolvedAvatar = useMemo(
    () => resolveSingleJobAsset(idCardConfig.avatarPath),
    [idCardConfig.avatarPath],
  );
  const resolvedLogo = useMemo(
    () => resolveSingleJobAsset(idCardConfig.logoPath),
    [idCardConfig.logoPath],
  );

  // Compute exact counts per category ("All 9", "Govt 8", "Private 0", "In-House 5")
  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length };
    categories.forEach((cat) => {
      if (cat === "All") return;
      counts[cat] = projects.filter(
        (p) =>
          p.category === cat ||
          (Array.isArray(p.categories) && p.categories.includes(cat)),
      ).length;
    });
    return counts;
  }, [projects, categories]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter(
      (p) =>
        p.category === activeCategory ||
        (Array.isArray(p.categories) && p.categories.includes(activeCategory)),
    );
  }, [projects, activeCategory]);

  const handleBackToExperienceHub = () => {
    window.dispatchEvent(
      new CustomEvent("app-navigate", {
        detail: {
          path: "/experience",
          variant: "curtain",
          changeTheme: 0,
          overlayText: "EXPERIENCE HUB",
        },
      }),
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground font-sans overflow-x-hidden touch-auto pt-40 sm:pt-44 md:pt-28 pb-24 select-none">
      {/* --- HANGING ID CARD FROM TOP-RIGHT OF SCREEN (Desktop & Large Tablet) --- */}
      <div className="hidden xl:block fixed top-0 right-6 2xl:right-14 z-40 pointer-events-none">
        <HangingIdCard
          ropeLength={115}
          ropeColor={idCardConfig.ropeColor || "#18181b"}
          strapText={idCardConfig.strapText || "UPSRLM // PMU-IT"}
          name={idCardConfig.name || "Ayush M Srivastava"}
          role={idCardConfig.role || data?.role}
          department={idCardConfig.department}
          companyName={idCardConfig.companyName || data?.title}
          badgeId={idCardConfig.badgeId || "ID-PMU-IT"}
          period={idCardConfig.period || data?.period}
          location={idCardConfig.location || data?.location}
          statusText={idCardConfig.statusText || "ACTIVE"}
          avatarSrc={resolvedAvatar}
          companyLogo={resolvedLogo}
          accentColor={idCardConfig.accentColor || "#10b981"}
          secondaryColor={idCardConfig.secondaryColor || "#064e3b"}
          initialVelocity={2.8}
        />
      </div>

      {/* --- COMPACT MOBILE/TABLET FLOATING ID BADGE DRAWER TRIGGER (< xl) --- */}
      <div className="xl:hidden fixed bottom-6 right-5 z-40">
        <button
          type="button"
          onClick={() => setMobileIdOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900/95 dark:bg-white text-white dark:text-zinc-950 shadow-2xl border border-white/15 font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          <IdCard className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>View Mission ID</span>
        </button>
      </div>

      {/* Mobile Interactive Hanging ID Modal */}
      <AnimatePresence>
        {mobileIdOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileIdOpen(false)}
            className="xl:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-start pt-6 px-4"
          >
            <button
              type="button"
              onClick={() => setMobileIdOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <HangingIdCard
                ropeLength={85}
                ropeColor={idCardConfig.ropeColor || "#18181b"}
                strapText={idCardConfig.strapText || "UPSRLM // PMU-IT"}
                name={idCardConfig.name || "Ayush M Srivastava"}
                role={idCardConfig.role || data?.role}
                department={idCardConfig.department}
                companyName={idCardConfig.companyName || data?.title}
                badgeId={idCardConfig.badgeId || "ID-PMU-IT"}
                period={idCardConfig.period || data?.period}
                location={idCardConfig.location || data?.location}
                statusText={idCardConfig.statusText || "ACTIVE"}
                avatarSrc={resolvedAvatar}
                companyLogo={resolvedLogo}
                accentColor={idCardConfig.accentColor || "#10b981"}
                secondaryColor={idCardConfig.secondaryColor || "#064e3b"}
                initialVelocity={3.2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 1. TOP CENTERED HERO & CATEGORY PILL FILTER BAR (Matches Reference) --- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-14 sm:pb-16">
        {/* Back to Experience Globe Link + Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-5"
        >
          <button
            type="button"
            onClick={handleBackToExperienceHub}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider border border-border/70 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>All Organizations</span>
          </button>

          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {data?.eyebrow || "PMU–IT UNIT"}
          </span>
        </motion.div>

        {/* Large Centered Title (Matches "Design" Heading in Reference) */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground font-sans leading-[1.05] mb-5"
        >
          {data?.title || "UPSRLM"}
        </motion.h1>

        {/* Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto mb-9"
        >
          {data?.subtitle}
        </motion.p>

        {/* Category Filter Pills (All, Govt, Private, In-House + Counts) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat] ?? 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-sm font-semibold"
                    : "bg-transparent text-muted-foreground border-border/80 hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] font-mono ${
                    isActive ? "text-background/75" : "text-muted-foreground/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* --- 2. ARCHITECTURAL 2-COLUMN BORDERED SHOWCASE GRID (Matches Reference) --- */}
      <div className="w-full border-t border-border/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto md:border-x border-border/60 dark:border-white/10">
          {filteredProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <ProjectShowcaseTile
                    key={project.id}
                    project={project}
                    index={idx}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-24 px-4 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                NO ARCHIVES IN [{activeCategory.toUpperCase()}]
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                All systems engineered under {data?.title} are classified under
                Government Mission & In-House infrastructure.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-foreground text-background cursor-pointer"
              >
                Reset Filter to All ({projects.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

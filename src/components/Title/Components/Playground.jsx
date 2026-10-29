// src/components/Title/Components/Playground.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DepthGallery from "@/components/ui/depth-gallery";

// Dynamically discover all screenshots inside /src/assets/plygrnd/<folder>/*.{png,jpg,jpeg,webp}
const rawPlaygroundAssets = import.meta.glob(
  "/src/assets/plygrnd/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" },
);

// Helper: extracts and numerically sorts (1.png, 2.png, 3.png...) screenshots for a specific folder
function getFolderScreenshots(folderName) {
  const matchingEntries = Object.entries(rawPlaygroundAssets).filter(([path]) =>
    path.toLowerCase().includes(`/plygrnd/${folderName.toLowerCase()}/`),
  );

  matchingEntries.sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/(\d+)\.[a-zA-Z]+$/)?.[1] ?? "999", 10);
    const numB = parseInt(pathB.match(/(\d+)\.[a-zA-Z]+$/)?.[1] ?? "999", 10);
    return numA - numB || pathA.localeCompare(pathB);
  });

  return matchingEntries.map(([, url]) => url);
}

// Curated Project Archive Data
const PLAYGROUND_PROJECTS = [
  {
    id: "tetris",
    folder: "tetris",
    title: "Tetris Game",
    year: "2025",
    tint: "#3B82F6",
    github: "https://github.com/aayushmohan2099/Tetris-Game",
    tags: ["React", "Vite", "Electron", "Combo Scoring", "Desktop App"],
    shortDesc:
      "A modern desktop implementation of the classic Tetris game built with React, Vite, and Electron — featuring polished visuals, persistent leaderboards, and a custom combo-based scoring engine.",
    sections: [
      {
        heading: "Overview",
        body: "A modern desktop implementation of the classic Tetris game built with React, Vite, and Electron. Designed with responsive gameplay, polished visuals, persistent leaderboards, and a custom combo-based scoring system, this project recreates the timeless puzzle experience with a modern desktop-first approach. Developed independently by Ayush Srivastava.",
      },
    ],
  },
  {
    id: "wireman",
    folder: "wireman",
    title: "Wireframe & Mockup Manager",
    year: "2025",
    tint: "#8B5CF6",
    github: "https://github.com/aayushmohan2099/wireframe-manager",
    tags: ["React", "Device Frames", "Android / iOS", "Laptop Mockups"],
    shortDesc:
      "Provide screenshots of your project to instantaneously convert them into presentation-ready Android, iOS, and laptop device mockups.",
    sections: [
      {
        heading: "Overview",
        body: "Provide screenshots of your project to convert into mockup designs of Android/iOS apps and laptop mockups — streamlining visual presentation and design handoffs.",
      },
    ],
  },
  {
    id: "dietease",
    folder: "dietease",
    title: "DietEase — AI Diet Recommendation Engine",
    year: "2024",
    tint: "#10B981",
    github: "https://github.com/aayushmohan2099/dietEase-ams",
    tags: [
      "Scikit-Learn",
      "FastAPI",
      "Streamlit",
      "Docker Compose",
      "KNN Cosine Similarity",
    ],
    shortDesc:
      "A content-based ML dietary recommendation engine built with Scikit-Learn, FastAPI, Streamlit, and Docker Compose to personalize nutrition and promote healthier living.",
    sections: [
      {
        heading: "Introduction & Motivation",
        body: "DietEase is a comprehensive web application based on a content-based approach made with Scikit-Learn, FastAPI, and Streamlit, designed to revolutionize dietary management and promote healthier living. Despite the clear benefits of a balanced diet, the notable lack of advanced systems for personalized dietary recommendations motivated this machine learning-based recommendation engine.",
      },
      {
        heading: "ML Model & Dataset",
        body: "Leverages the Nearest Neighbors algorithm (brute-force with cosine similarity) for rapid unsupervised neighbor searches across nutritional vectors. Trained on the Food.com Recipes and Reviews dataset from Kaggle.",
      },
      {
        heading: "FastAPI BackEnd & Docker Architecture",
        body: "Built with FastAPI to process user nutritional profiles and return tailored meal recommendations via REST endpoints. Containerized with Docker and orchestrated across multi-container frontend and backend services using Docker Compose.",
      },
      {
        heading: "Streamlit FrontEnd",
        body: "Interactive data-science interface built with Streamlit, tightly integrated with Scikit-Learn, StandardScaler, NumPy, Pandas, and Matplotlib.",
      },
    ],
  },
  {
    id: "covman",
    folder: "covman",
    title: "Covid Manager",
    year: "2023",
    tint: "#06B6D4",
    github: "https://github.com/aayushmohan2099/cm-ams",
    tags: [
      "HealthTech MIS",
      "Vaccination & Lab Portal",
      "Real-Time Alerts",
      "Document Vault",
    ],
    shortDesc:
      "A comprehensive health management system for seamless user vaccination and test scheduling, real-time lab result reporting, and secure digital certificate management.",
    sections: [
      {
        heading: "Core Platform Capabilities",
        bullets: [
          "User-Friendly Interface: Intuitive dashboard for scheduling vaccination appointments, viewing test results, and downloading certificates.",
          "Real-Time Updates: Instant notifications and reminders for upcoming vaccination slots and lab result availability.",
          "Document Management: Secure digital repository for storing and accessing vaccination certificates and medical reports.",
          "Laboratory Integration: Dedicated portal for laboratories to efficiently update and verify test results and certificates.",
          "Data Security: Built with strict privacy controls and industry-standard data protection practices.",
        ],
      },
    ],
  },
  {
    id: "vrs",
    folder: "vrs",
    title: "Vehicle Renting System",
    year: "2022",
    tint: "#F59E0B",
    github: "#",
    tags: [
      "Java",
      "NetBeans",
      "Team Lead (4 Members)",
      "Multi-Branch Fleet MIS",
    ],
    shortDesc:
      "A computerized multi-branch vehicle rental and reservation management system engineered in NetBeans while leading a 4-member core development team.",
    sections: [
      {
        heading: "Project Genesis & Team Leadership",
        body: "Engineered as a comprehensive semester capstone translating physical agency workflows into a computerized reservation system using NetBeans. Led a core central project team of 4 developers in collaboration with department faculty and project handlers.",
      },
      {
        heading: "Operational Scope",
        body: "Designed for vehicle rental agencies offering short-term rentals (hours, days, or weeks) across multiple local branches — supporting inter-branch vehicle returns alongside online customer reservations.",
      },
    ],
  },
];

export default function Playground() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) !== "light";

  // Build flat corridor plates list across all projects (or fallback swatch if a folder has no images yet)
  const { platesList, projectStartIndices } = useMemo(() => {
    const list = [];
    const startMap = {};

    PLAYGROUND_PROJECTS.forEach((proj, pIdx) => {
      startMap[proj.id] = list.length;
      const shots = getFolderScreenshots(proj.folder);

      if (shots.length > 0) {
        shots.forEach((src, sIdx) => {
          list.push({
            image: { src },
            offsetY: 0,
            tint: proj.tint,
            label: `${proj.title} — Shot ${sIdx + 1}`,
            projectIndex: pIdx,
            shotIndex: sIdx + 1,
            totalShots: shots.length,
          });
        });
      } else {
        // Graceful fallback plate if folder is empty during dev
        list.push({
          image: null,
          offsetY: 0,
          tint: proj.tint,
          label: proj.title,
          projectIndex: pIdx,
          shotIndex: 1,
          totalShots: 1,
        });
      }
    });

    return { platesList: list, projectStartIndices: startMap };
  }, []);

  const [activePlateIndex, setActivePlateIndex] = useState(0);
  const [targetPlateIndex, setTargetPlateIndex] = useState(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const currentPlate = platesList[activePlateIndex] || platesList[0];
  const activeProject =
    PLAYGROUND_PROJECTS[currentPlate?.projectIndex ?? 0] ||
    PLAYGROUND_PROJECTS[0];

  const handleSelectProject = (projectId) => {
    const targetIdx = projectStartIndices[projectId] ?? 0;
    setTargetPlateIndex(targetIdx);
    setActivePlateIndex(targetIdx);
  };

  const handleStepPlate = (dir) => {
    const count = platesList.length;
    const nextIdx = (((activePlateIndex + dir) % count) + count) % count;
    setTargetPlateIndex(nextIdx);
    setActivePlateIndex(nextIdx);
  };

  return (
    <section
      id="playground"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background text-foreground font-sans overflow-hidden touch-auto"
    >
      {/* Centered Container matching Reference Screenshot Layout */}
      <div className="max-w-4xl mx-auto">
        {/* --- 1. TOP HEADER BLOCK (Left-aligned within centered column) --- */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-left mb-10 sm:mb-12"
        >
          {/* Eyebrow: Green dot + SINCE 2022 */}
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
              Since 2022
            </span>
          </div>

          {/* Main Heading: Playground */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans leading-[1.08] mb-5">
            Playground
          </h2>

          {/* Subtitle matching reference screenshot */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-md sm:max-w-lg mb-7">
            A space for self-initiated products, prototypes, and creative
            systems shaped by curiosity, code, and fast iteration.
          </p>

          {/* SCROLL > Indicator + Interactive Project Switcher Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground/80">
              <span>SCROLL / DRAG CORRIDOR</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </div>

            {/* Quick Project Jump Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {PLAYGROUND_PROJECTS.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleSelectProject(proj.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                        : "bg-muted/30 text-muted-foreground border-border/60 hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {proj.title.split("—")[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* --- 2. CENTERED DEPTH GALLERY SHOWCASE STAGE --- */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-[300px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 dark:border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
        >
          <DepthGallery
            images={platesList}
            background={isDark ? "#0B0C10" : "#EDEFF5"}
            depth={5}
            spread={3.2}
            cardWidth={580}
            cardHeight={365}
            radius={14}
            sensitivity={5.5}
            smoothing={6}
            mood={{ strength: 7, blobSize: 5, grain: 3 }}
            parallax={{ pointer: 5, breath: 5, drift: 5 }}
            activeTargetIndex={targetPlateIndex}
            onActiveChange={(idx) => setActivePlateIndex(idx)}
          />

          {/* Top-Left Live Shot Badge inside Stage */}
          <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-[11px] font-mono tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {activeProject.year} // SHOT {currentPlate?.shotIndex || 1} OF{" "}
              {currentPlate?.totalShots || 1}
            </span>
          </div>

          {/* Bottom-Right Manual Corridor Stepper Controls (for easy mobile/click navigation) */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepPlate(-1)}
              aria-label="Previous screenshot"
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleStepPlate(1)}
              aria-label="Next screenshot"
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* --- 3. DYNAMIC PROJECT CAPTION BELOW STAGE (Matches "Nook" Caption Style) --- */}
        <div className="mt-7 sm:mt-8 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col space-y-3"
            >
              {/* Title + Action Links Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                  {activeProject.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Expandable Specs Button */}
                  <button
                    type="button"
                    onClick={() => setIsSpecsOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-border/80 bg-muted/30 hover:bg-muted/60 text-foreground transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {isSpecsOpen ? "Hide Specs" : "Read Full Specs"}
                    </span>
                    {isSpecsOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* GitHub Source Link */}
                  {activeProject.github && activeProject.github !== "#" ? (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-blue-500/15 border border-blue-500/35 text-blue-400 hover:bg-blue-500/25 transition-all"
                    >
                      <span>GitHub Repo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-border/50 text-muted-foreground">
                      Academic Archive
                    </span>
                  )}
                </div>
              </div>

              {/* Concise 2-Line Description matching Reference */}
              <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-2xl">
                {activeProject.shortDesc}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-muted/40 border border-border/50 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expandable Full Technical Write-Up Drawer */}
              <AnimatePresence>
                {isSpecsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md space-y-4">
                      {activeProject.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                            {sec.heading}
                          </h4>
                          {sec.body && (
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {sec.body}
                            </p>
                          )}
                          {sec.bullets && (
                            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {sec.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

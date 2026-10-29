// src/components/Title/Components/Intro.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextScrollMarquee from "@/components/ui/marquee-strip";
import { IntroCard } from "@/components/ui/intro-card";

const MARQUEE_SKILLS = [
  "System Architecture",
  "Full-Stack Engineering",
  "Interactive UI Motion",
  "Scalable REST APIs",
  "Database Management",
  "Offline-First Mobile Apps",
  "Data Pipelines",
];

// Reusable styled external project link for the Engineers tab
const CodeLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block text-white font-medium underline decoration-neutral-500 underline-offset-[6px] hover:text-[#00ffaa] hover:decoration-[#00ffaa] transition-colors duration-200 pointer-events-auto"
  >
    {label}
  </a>
);

const INTRO_PERSONAS = [
  {
    id: "anyone",
    index: "01",
    label: "For anyone",
    content: (
      <p className="m-0">
        I'm <span className="text-white font-semibold">Ayush Mohan</span> — a
        Lucknow-based Lead Software Engineer & Full-Stack Architect who blends
        deep systems engineering, tactile motion design into{" "}
        <span className="text-white">digital ecosystems </span>
        that feel genuinely human.
      </p>
    ),
  },
  {
    id: "recruiters",
    index: "02",
    label: "Recruiters",
    content: (
      <p className="m-0">
        I'm a full-stack engineer with{" "}
        <span className="text-white font-semibold">
          nearly 3 years of experience
        </span>{" "}
        architecting private platforms and state-scale government ecosystems. I
        care deeply about craft, speed, and shipping resilient software people
        rely on — and I'm open to impactful roles.
      </p>
    ),
  },
  {
    id: "designers",
    index: "03",
    label: "Product Designers",
    content: (
      <p className="m-0">
        I live where design meets physics — translating Figma visions into{" "}
        <span className="text-white font-semibold">
          60fps micro-interactions
        </span>
        , custom shaders, and fluid component systems. I prototype early, obsess
        over easing curves, and make sure production looks even sharper than the
        canvas.
      </p>
    ),
  },
  {
    id: "managers",
    index: "04",
    label: "Product Managers",
    content: (
      <p className="m-0">
        I tie engineering directly to{" "}
        <span className="text-white font-semibold">operational outcomes</span> —
        scoping tightly, normalizing complex data flows, and shipping
        predictable milestones. I think in tradeoffs and care about real-world
        adoption as much as clean architecture.
      </p>
    ),
  },
  {
    id: "engineers",
    index: "05",
    label: "Engineers",
    content: (
      <p className="m-0">
        I'm{" "}
        <span className="font-mono text-neutral-200">
          {"{highly_technical}"}
        </span>{" "}
        and while{" "}
        <span className="font-mono text-neutral-200">
          (I'm ≠ average_coder)
        </span>{" "}
        I know my way{" "}
        <span className="font-mono text-neutral-200">/around</span> & can speak{" "}
        <span className="text-white font-medium">"fluently"</span> with you; I
        built{" "}
        <CodeLink href="https://ayushbuilds.online/" label="(this.site)" /> from
        scratch + <CodeLink href="https://ab-hrms.in/" label="(this.one)" /> &&{" "}
        <CodeLink href="https://eatpur.in/" label="(this.too)" />.
      </p>
    ),
  },
];

export default function Intro() {
  // Default to "engineers" or "anyone" — starting on "engineers" showcases your live links immediately!
  const [activeTab, setActiveTab] = useState("engineers");

  const activePersona =
    INTRO_PERSONAS.find((p) => p.id === activeTab) || INTRO_PERSONAS[0];

  return (
    <section className="relative w-full bg-background text-foreground overflow-hidden pb-24 sm:pb-32 touch-auto">
      {/* --- 1. TOP INVERTED THEME SCROLL MARQUEE STRIP --- */}
      <TextScrollMarquee
        items={MARQUEE_SKILLS}
        baseVelocity={0.5}
        scrollDependent={true}
        direction="left"
      />

      {/* --- 2. MAIN INTRO CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* --- LEFT COLUMN: "Intro" Title & Interactive Index List --- */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 lg:sticky lg:top-32"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans">
              Intro
            </h2>

            {/* Persona Selector List (Horizontal scroll pills on small mobile, vertical index list on sm+) */}
            <nav
              aria-label="Intro perspective selector"
              className="flex sm:flex-col gap-2 sm:gap-3.5 overflow-x-auto no-scrollbar pb-2 sm:pb-0"
            >
              {INTRO_PERSONAS.map((persona) => {
                const isActive = persona.id === activeTab;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setActiveTab(persona.id)}
                    onMouseEnter={() => setActiveTab(persona.id)}
                    className={`group flex items-center gap-3 text-left py-1.5 px-3 sm:px-0 rounded-full sm:rounded-none border sm:border-none transition-all duration-300 cursor-pointer shrink-0 ${
                      isActive
                        ? "border-foreground/40 bg-foreground/10 sm:bg-transparent text-foreground font-medium"
                        : "border-border/50 text-muted-foreground hover:text-foreground/80"
                    }`}
                  >
                    {/* Animated Horizontal Dash Indicator (Matches Reference Image) */}
                    <span
                      className={`hidden sm:inline-block h-[1.5px] transition-all duration-300 ${
                        isActive
                          ? "w-7 bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                          : "w-3 bg-muted-foreground/40 group-hover:w-5 group-hover:bg-foreground/60"
                      }`}
                    />
                    <span className="text-xs sm:text-sm md:text-[15px] tracking-wide font-sans whitespace-nowrap">
                      {persona.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* --- RIGHT COLUMN: 3D Cyber Intro Card --- */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 w-full"
          >
            <IntroCard
              activeTabId={activePersona.id}
              activeLabel={activePersona.label}
              indexNumber={activePersona.index}
            >
              {activePersona.content}
            </IntroCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

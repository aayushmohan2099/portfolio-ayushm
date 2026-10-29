// src/components/About/Components/Section3.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Compass,
  Users,
  GitBranch,
  Layers,
  Database,
  ShieldCheck,
  Network,
  Code2,
  Cpu,
  Sparkles,
  Smartphone,
  Rocket,
  Activity,
  Container,
  BarChart3,
} from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";

const WORKFLOW_STEPS = [
  {
    stepNumber: "01",
    title: "Discover & Decode",
    description:
      "Every build starts by untangling real-world friction — auditing workflows, mapping edge cases, and understanding the people behind the screen.",
    phaseLabel: "INSIGHT",
    accent: "emerald",
    mainIcon: Search,
    miniIcons: [Compass, Users, GitBranch],
  },
  {
    stepNumber: "02",
    title: "Architect Systems",
    description:
      "Designing normalized schemas, strict RBAC boundaries, and modular REST APIs so the foundation stays rock-solid as operations scale.",
    phaseLabel: "BLUEPRINT",
    accent: "blue",
    mainIcon: Layers,
    miniIcons: [Database, ShieldCheck, Network],
  },
  {
    stepNumber: "03",
    title: "Engineer & Craft",
    description:
      "Translating blueprints into fluid 60fps interfaces and offline-first mobile apps — where clean backend logic meets tactile motion.",
    phaseLabel: "EXECUTION",
    accent: "violet",
    mainIcon: Code2,
    miniIcons: [Sparkles, Smartphone, Cpu],
  },
  {
    stepNumber: "04",
    title: "Scale & Deliver",
    description:
      "Shipping containerized production builds and automated analytical pipelines that turn fragmented data into measurable real-world impact.",
    phaseLabel: "IMPACT",
    accent: "amber",
    mainIcon: Rocket,
    miniIcons: [Container, BarChart3, Activity],
  },
];

export default function Section3() {
  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background text-foreground">
      {/* Subtle Top Divider Line */}
      <div className="max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-60 mb-16 sm:mb-24" />

      <div className="max-w-7xl mx-auto">
        {/* --- HEADER BLOCK (Aligned to Reference Image) --- */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-left mb-14 sm:mb-20"
        >
          {/* Eyebrow with Glowing Green Dot */}
          <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
              How I Work
            </span>
          </div>

          {/* Large Section Title */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans leading-[1.1] mb-5">
            Engineering Process
          </h2>

          {/* Subtitle Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
            Rooted in systems thinking, architectural clarity, and relentless
            iteration, my workflow transforms complex operational challenges
            into intuitive, resilient software built to last.
          </p>
        </motion.div>

        {/* --- 3D CARDS RESPONSIVE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10 xl:gap-6 items-center justify-items-center">
          {WORKFLOW_STEPS.map((step, index) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <Card3D
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                phaseLabel={step.phaseLabel}
                accent={step.accent}
                mainIcon={step.mainIcon}
                miniIcons={step.miniIcons}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

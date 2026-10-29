// src/components/Title/Components/WebDesigns.jsx
import React from "react";
import { motion } from "framer-motion";
import HoverImageReveal from "@/components/ui/hover-img-reveal";

// Import Web Design Preview Screenshots
import privishImg from "@/assets/web/privish.png";
import technoImg from "@/assets/web/techno.png";
import paiImg from "@/assets/web/pai.png";
import lbsImg from "@/assets/web/lbs.png";

const WEB_DESIGN_PROJECTS = [
  {
    id: "privish",
    text: "Privish Creations",
    category: "Company Portfolio",
    link: "https://github.com/aayushmohan2099/privishHome",
    image: {
      src: privishImg,
      alt: "Company Portfolio website for Privish Creations",
    },
  },
  {
    id: "techno",
    text: "TechnoHorizon",
    category: "Corporate Portal",
    link: "https://github.com/aayushmohan2099/technohorizon.co.in",
    image: {
      src: technoImg,
      alt: "Company Portfolio website for TechnoHorizon",
    },
  },
  {
    id: "pragati-ai",
    text: "Pragati AI",
    category: "AI Platform",
    link: "https://github.com/aayushmohan2099/Pragati-AI",
    image: {
      src: paiImg,
      alt: "Pragati AI Web Interface",
    },
  },
  {
    id: "lbsgoi",
    text: "LBSGOI Revamp",
    category: "Institutional Web",
    link: "https://ayushmohan193.wixsite.com/mysite",
    image: {
      src: lbsImg,
      alt: "LBSGOI Revamp Website",
    },
  },
];

export default function WebDesigns() {
  return (
    <section
      id="web-design"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background text-foreground font-sans overflow-hidden touch-auto"
    >
      <div className="max-w-5xl mx-auto">
        {/* --- TOP HEADER ROW: Title + "(04)" Counter & Subtitle --- */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20"
        >
          {/* Heading + Right-Aligned (04) Counter */}
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans leading-[1.08]">
              Web Design
            </h2>

            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-muted-foreground">
              (0{WEB_DESIGN_PROJECTS.length})
            </span>
          </div>

          {/* Left-Aligned Editorial Description */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-md sm:max-w-lg">
            I create digital surfaces that are visually compelling,
            strategically aligned, and optimized for both users and business
            growth.
          </p>
        </motion.div>

        {/* --- HOVER IMAGE REVEAL LIST --- */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <HoverImageReveal
            items={WEB_DESIGN_PROJECTS}
            imageWidth={430}
            imageHeight={270}
            rounded={14}
            offsetX={130}
            offsetY={-10}
            followStrength={6}
          />
        </motion.div>
      </div>
    </section>
  );
}

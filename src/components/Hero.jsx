// src/components/Hero.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const ref = useRef(null);

    // Track scroll progress within this specific section
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax transformations
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

    return (
        <section
            ref={ref}
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Grid/Texture (Optional subtle detail) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black z-0"></div>

            <motion.div
                style={{ y: textY, opacity: opacity, scale: scale }}
                className="relative z-10 text-center px-4"
            >
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
                >
                    Ayush M Srivastava
                </motion.h1> {/* FIX: This was previously </motion.div> */}

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto"
                >
                    Lead Software Developer
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-6 text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed"
                >
                    Specializing in highly scalable full-stack ecosystems, complex frontend interactions, and data-driven infrastructure.
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
                <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scroll</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"
                />
            </motion.div>
        </section>
    );
};

export default Hero;
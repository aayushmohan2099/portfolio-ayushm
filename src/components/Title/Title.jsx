// src/components/Title.jsx
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

import Header from "./Components/Header";
import LeftPanel from "./Components/LeftPanel";
import MainPanel from "./Components/MainPanel";
import RightPanel from "./Components/RightPanel";
import Footer from "./Components/Footer";

// Import the new background component
// import InteractiveGridBg from "./Components/InteractiveGridBg";

const Title = () => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const textY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "50%"]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.8],
        [1, 0]
    );

    const scale = useTransform(
        scrollYProgress,
        [0, 1],
        [1, 0.9]
    );

    return (
        // Added 'relative' to keep the absolutely positioned canvas inside
        <div className="title-bg-anim relative w-full h-screen overflow-hidden">

            {/* Pure Black Background */}
            {/* <div
                className="absolute inset-0 z-0 pointer-events-none bg-black"
            /> */}

            {/* The interactive distortion layer (sits behind the content)
            <div className="absolute inset-0 z-[1]">
                <InteractiveGridBg />
            </div> */}

            {/* Blur layer */}
            <div className="absolute inset-0 z-[2] backdrop-blur-[1px] pointer-events-none" />

            {/* Added 'relative z-10' to ensure content stays clickable and visible on top */}
            <section
                ref={ref}
                className="relative z-10 h-screen w-full overflow-hidden p-6 pointer-events-none"
            >
                {/* Notice: Apply pointer-events-auto to inner content so the canvas can still detect mouse movements through the gaps */}
                <div className="h-full w-full grid grid-cols-[1fr_3fr_1fr] grid-rows-[60px_1fr_60px] gap-2 pointer-events-auto">

                    {/* Header (4) */}
                    <div className="col-span-3">
                        <Header />
                    </div>

                    {/* Left (2) */}
                    <div>
                        <LeftPanel
                            textY={textY}
                            opacity={opacity}
                            scale={scale}
                        />
                    </div>

                    {/* Main (1) */}
                    <div>
                        <MainPanel />
                    </div>

                    {/* Right (3) */}
                    <div>
                        <RightPanel
                            textY={textY}
                            opacity={opacity}
                            scale={scale}
                        />
                    </div>

                    {/* Footer (5) */}
                    <div className="col-span-3">
                        <Footer />
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Title;
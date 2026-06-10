// src/components/SplashScreen.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleVideoEnd = () => {
        setIsVisible(false);
        setTimeout(onComplete, 800); // Wait for the fade-out animation to finish
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                >
                    {/* 
            pointer-events-none prevents dragging/clicking.
            playsInline ensures it doesn't open fullscreen on mobile.
          */}
                    <video
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable="false"
                    >
                        <source src="/intro-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
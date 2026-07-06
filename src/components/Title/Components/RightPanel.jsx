// src/components/Title/RightPanel.jsx
import { motion } from "framer-motion";

const RightPanel = ({ textY, opacity, scale }) => {
    return (
        <motion.div
            style={{ y: textY, opacity, scale }}
            className="h-full flex flex-col justify-center px-8"
        >
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-sans"
            >
                into
                production systems
            </motion.h1>
        </motion.div>
    );
};

export default RightPanel;
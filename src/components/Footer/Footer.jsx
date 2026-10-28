// src/components/Title/Footer.jsx
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                Scroll
            </span>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"
            />
        </div>
    );
};

export default Footer;
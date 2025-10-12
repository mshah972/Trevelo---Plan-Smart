import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const subtitles = [
    "Let's plan your dream trip! ✨ ",
    "Dream big. Travel far. 🌍 ",
    "Your next adventure starts here! 🚀 ",
    "Your adventure, one prompt away ✈️ ",
    "Mapping memories, one trip at a time 🗺️ ",
    "Discover wonders around every corner 🌏 ",
    "Dream. Plan. Go. 🌅 ",
    "The journey begins with your imagination 🚀 ",
    "Where to next? The world’s waiting! 🧭 ",
    "Every destination, perfectly planned 🎒 ",
    "Let’s make your bucket list a reality 📝 ",
    "Find your next favorite place 🌺 ",
    "Plan smarter, travel happier 😎 ",
];

function Subtitle() {
    const [subtitleIdx, setSubtitleIdx] = React.useState(0);
    const [typed, setTyped] = React.useState("");
    const [typing, setTyping] = React.useState(true);

    React.useEffect(() => {
        let timeout;
        if (typing) {
            if (typed.length < subtitles[subtitleIdx].length) {
                timeout = setTimeout(() => {
                    setTyped(subtitles[subtitleIdx].slice(0, typed.length + 1));
                }, 60);
            } else {
                timeout = setTimeout(() => setTyping(false), 2500); // Pause on full line
            }
        } else {
            if (typed.length > 0) {
                timeout = setTimeout(() => {
                    setTyped(subtitles[subtitleIdx].slice(0, typed.length - 1));
                }, 40);
            } else {
                setTyping(true);
                setSubtitleIdx((i) => (i + 1) % subtitles.length);
            }
        }
        return () => clearTimeout(timeout);
    }, [typed, typing, subtitleIdx]);

    return (
        <AnimatePresence mode="wait">
            <motion.p
                key={subtitleIdx}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.5 }}
                className="leading-6 font-light text-text-secondary lg:text-lg mt-4 min-h-[30px]"
            >
                {typed}
                <span className="animate-pulse text-white">|</span>
            </motion.p>
        </AnimatePresence>
    );
}

export {Subtitle};

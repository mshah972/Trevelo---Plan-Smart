import { motion } from "framer-motion";

function LoadingDotsAnimation() {
    const dotVariants = {
        jump: {
            y: 6,
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            animate="jump"
            transition={{ staggerChildren: -0.1, staggerDirection: -0.2 }}
            className="flex justify-center items-center gap-0.5"
        >
            <motion.div className="w-1 h-1 rounded-full bg-muted transform" variants={dotVariants} />
            <motion.div className="w-1 h-1 rounded-full bg-muted transform" variants={dotVariants} />
            <motion.div className="w-1 h-1 rounded-full bg-muted transform" variants={dotVariants} />
        </motion.div>
    );
}

export default LoadingDotsAnimation;

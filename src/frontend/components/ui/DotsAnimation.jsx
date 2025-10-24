import { motion } from "framer-motion";

function LoadingDotsAnimation() {
    const dotVariants = {
        jump: {
            y: -30,
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            animate="jump"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="flex justify-center items-center gap-10"
        >
            <motion.div className="w-8 h-8 rounded-full bg-muted transform" variants={dotVariants} />
            <motion.div className="w-8 h-8 rounded-full bg-muted transform" variants={dotVariants} />
            <motion.div className="w-8 h-8 rounded-full bg-muted transform" variants={dotVariants} />
        </motion.div>
    );
}

export default LoadingDotsAnimation;

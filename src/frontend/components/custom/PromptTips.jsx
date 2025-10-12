import { Lightbulb, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// For your styling: use bg-card, text-foreground, etc. matching your theme

export function PromptTips() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex flex-col w-auto max-w-[750px] rounded-2xl bg-card shadow-shadow-2 backdrop-blur-md bg-elevated">
            {/* Header: clickable to toggle */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-4 h-11 select-none focus:outline-none"
                aria-expanded={open}
                aria-controls="prompt-tips-content"
            >
                <Lightbulb className="size-4 text-yellow-400" />
                <span className="text-white text-sm lg:text-base">Get the best itinerary: Perfect your prompt</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="ml-auto"
                >
                    <ChevronDown className="size-4 text-foreground/60" />
                </motion.span>
            </button>

            {/* Animated dropdown content */}
            <AnimatePresence initial={false}>z
                {open && (
                    <motion.div
                        id="prompt-tips-content"
                        key="tips-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, type: "spring" }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col bg-card-inner w-full rounded-b-2xl rounded-2xl gap-2 bg-muted">
                            <ul className="list-disc list-inside text-white text-xs lg:text-sm font-normal space-y-2 px-4 py-4">
                                <li>Include your destination and travel dates</li>
                                <li>Mention your group size and traveler ages</li>
                                <li>Describe your interests (adventure, food, culture, etc.)</li>
                                <li>Set a budget (low, mid, or high)</li>
                                <li>Share dietary restrictions or health needs</li>
                                <li>Highlight any “must-do” activities or experiences</li>
                                <li>The more details you add, the smarter and more personalized your recommendations!</li>
                            </ul>
                            <div className="flex items-center gap-2 mt-1 py-2 px-2 bg-elevated rounded-2xl mb-2 m-2">
                                <Info className="size-3 lg:size-4 text-text-secondary" />
                                <p className="text-text-secondary text-[8px] lg:text-xs">
                                  Specific prompts help the AI to plan trips tailored to your unique travel style—so go deep and get the best results!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

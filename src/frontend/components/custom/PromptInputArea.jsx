import { useState } from "react";
import { ArrowUp, Loader } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { TextArea } from "../ui/TextArea.jsx";
import { cn } from "../../utils/utils.js";

export const PromptInputArea = ({ className, onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");

    const handleSubmit = async () => {
        const value = input.trim();
        if (!value || isLoading) return;

        setIsLoading(true);
        try {
            if (typeof onSubmit === "function") {
                await onSubmit(value);
            } else {
                console.log("[PromptInputArea] Submitted prompt:", value);
            }
            setInput("");
        } catch (err) {
            console.error("❌ Prompt submission failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={cn("flex flex-col gap-4 w-full", className)}>
            <div className="w-full rounded-xl relative overflow-hidden animate-rotate-border bg-[conic-gradient(from_var(--border-angle),red,orange,yellow,green,blue,indigo,violet,red)] p-px">
                <div className="relative rounded-xl bg-muted">
                    <TextArea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ backgroundColor: "transparent" }}
                        className="flex field-sizing-content max-h-[120px] md:max-h-[200px] w-full rounded-xl px-4 py-3 leading-relaxed text-white placeholder:text-text-secondary focus-visible:outline-none [resize:none] shadow-none border-none focus-visible:ring-0"
                        placeholder="Where are you planning to go next?..."
                        aria-label="Enter your prompt"
                    />

                    <div className="flex justify-end px-3 py-2">
                        <Button
                            size="lg"
                            className="rounded-full size-8 cursor-pointer"
                            onClick={handleSubmit}
                            type="button"
                            disabled={isLoading || !input.trim()}
                            aria-label="Submit prompt"
                        >
                            {isLoading ? (
                                <Loader className="w-[7px] h-[7px] animate-[spin_4s_linear_infinite]" />
                            ) : (
                                <ArrowUp className="w-[7px] h-[7px]" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

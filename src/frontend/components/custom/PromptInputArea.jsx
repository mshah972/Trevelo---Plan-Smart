import {
    ArrowUp,
    Loader,
} from "lucide-react";
import {Button} from "../ui/Button.jsx";
import {TextArea} from "../ui/TextArea.jsx";
import {useState} from "react";
import {cn} from "../../utils/utils.js";

export const PromptInputArea = ({
    className,
    onSubmit,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState(
        "Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat, a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred."
    );

    const handleSubmit = async () => {
        if (input.trim()) {
            setIsLoading(true);
            await onSubmit(input.trim());
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            setInput('');
        }
    };

    return (
        <div className={cn("flex flex-col gap-4 w-full", className)}>
            <div
                className={"w-full rounded-xl relative overflow-hidden animate-rotate-border bg-[conic-gradient(from_var(--border-angle),red,orange,yellow,green,blue,indigo,violet,red)] p-px"}>
                <div className={"relative rounded-xl bg-muted"}>
                    <TextArea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        style={{
                            backgroundColor: 'transparent',
                        }}
                        className={"flex field-sizing-content max-h-[150px] md:max-h-[200px] w-full rounded-xl px-4 py-3 leading-relaxed text-white placeholder:text-text-secondary focus-visible:outline-none [resize:none] shadow-none border-none focus-visible:ring-0"}
                        placeholder={"Ask me anything about your trip..."}
                        aria-label={"Enter your prompt"}
                    />
                    <div className={"flex justify-end px-3 py-2"}>
                        <Button
                            size={"lg"}
                            className={"rounded-full size-8 cursor-pointer"}
                            onClick={""}
                            type="submit"
                        >
                            {isLoading ? (
                                <Loader className={"w-[7px] h-[7px] animate-[spin_4s_linear_infinite]"}/>
                            ) : (
                                <ArrowUp className={"w-[7px] h-[7px]"}/>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

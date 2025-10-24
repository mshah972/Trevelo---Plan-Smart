import React, {useState, useEffect, useRef} from "react";
import {motion} from "motion/react";
import {PromptInputArea} from "../../../components/custom/PromptInputArea.jsx";
import {ArrowUp, Loader, LogOut} from "lucide-react";
import {Button} from "../../../components/ui/Button.jsx";
import {Subtitle} from "../../../components/ui/Subtitle.jsx";
import {PromptTips} from "../../../components/custom/PromptTips.jsx";
import {ChatContainer} from "../../../components/custom/ChatContainer.jsx";
import {sampleMessages} from "../../sample-messages.jsx";
import LoadingDotsAnimation from "../../../components/ui/DotsAnimation.jsx";
// import { useChat } from "../../hooks/use-chat.js";
// import {
//     ChatContainer,
//     Message as MessageType,
// } from "../components/custom/ChatContainer";
// import { AccomodationDrawer } from "../components/custom/AccomodationDrawer"

export default function HomePage() {
    // const {messages, addMessage, clearMessages } = useChat();
    //
    // useEffect(() => {
    //     return () => {
    //         clearMessages();
    //     }
    // }, []);

    // useEffect(() => {
    //     if (messages.length > 0 && messages[messages.length -1].role === "user") {
    //         const
    //     }
    // }, []);
    const containerRef = useRef(null);

    const logoURL = "https://firebasestorage.googleapis.com/v0/b/travel-mate-sm07.firebasestorage.app/o/travel-mate-logo.svg?alt=media&token=43abb583-1320-4935-934d-a51d8f94f179";

    const API = import.meta.env.VITE_API_BASE_URL;

    const [isLoading, setIsLoading] = useState(false);

    // Call from your UI: await handleGenerate(userParagraph)
    const handleGenerate = async (userParagraph) => {
        try {
            // 1) Start background job
            const startRes = await fetch("/api/itineraries/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userParagraph }),
            });

            const startCt = startRes.headers.get("content-type") || "";
            if (!startRes.ok) {
                const msg = startCt.includes("application/json") ? (await startRes.json()).error : await startRes.text();
                throw new Error(`Start failed (HTTP ${startRes.status}): ${msg}`);
            }

            const startJson = await startRes.json(); // { ok: true, jobId }
            if (!startJson?.ok || !startJson?.jobId) {
                throw new Error("Failed to start job (no jobId).");
            }
            const jobId = startJson.jobId;
            console.log("[itinerary] started job:", jobId);

            // 2) Poll until the job completes (or fails/timeout)
            const startedAt = Date.now();
            const POLL_INTERVAL_MS = 1200;     // 1.2s
            const TIMEOUT_MS = 300000;         // 5 minutes safety timeout

            // Optional: surface interim UI state here (e.g., spinner)
            setIsLoading(true);

            let result = null;
            for (;;) {
                // client-side timeout guard
                if (Date.now() - startedAt > TIMEOUT_MS) {
                    throw new Error("Timed out waiting for itinerary. Please try a shorter prompt.");
                }

                await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

                const statusRes = await fetch(`/api/jobs/${jobId}`, { method: "GET" });
                const statusCt = statusRes.headers.get("content-type") || "";
                if (!statusRes.ok) {
                    const msg = statusCt.includes("application/json") ? (await statusRes.json()).error : await statusRes.text();
                    throw new Error(`Status check failed (HTTP ${statusRes.status}): ${msg}`);
                }

                const { job } = await statusRes.json(); // { status, data?, error? }
                if (!job) throw new Error("Invalid job response.");

                if (job.status === "completed") {
                    result = job.data;
                    break;
                }
                if (job.status === "failed") {
                    throw new Error(job.error || "Itinerary generation failed.");
                }

                // statuses: queued | running → continue polling
                console.debug("[itinerary] job status:", job.status);
            }

            console.log("Itinerary:", result);
            // setPlan(result); // ← store to state and render

        } catch (e) {
            console.error("Network/Unexpected error:", e.message || e);
            // Optionally show a toast/snackbar here
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <div className={"relative w-full min-h-svh"}>
                {/*<motion.div*/}
                {/*    initial={{opacity: 0}}*/}
                {/*    animate={{opacity: 1}}*/}
                {/*    transition={{duration: 0.7, delay: 1}}*/}
                {/*>*/}
                {/*    <button*/}
                {/*        className={"group absolute top-5 right-8 z-50 rounded-full bg-elevated ring-1 ring-red-500 font-light text-xs hover:bg-white hover:text-black hover:cursor-pointer transition duration-300 p-2"}*/}
                {/*        onClick={""}*/}
                {/*        type="submit"*/}
                {/*    >*/}
                {/*        <LogOut color={"red"} className={"w-[16px] h-[16px]"}/>*/}
                {/*    </button>*/}
                {/*</motion.div>*/}


                <div className={"flex flex-col w-full min-h-svh items-center gap-7 justify-center pb-24 lg:pb-4"}>
                    {sampleMessages?.length <= 0 && (
                        <>
                            <motion.div
                                initial={{opacity: 0, y: -32}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.7, delay: 0.2}}
                                className="flex flex-col w-full items-center gap-2 pt-4 pb-7 text-center"
                            >
                                <div
                                    className="relative rounded-full flex justify-center items-center bg-[conic-gradient(from_var(--border-angle),red,orange,yellow,green,blue,indigo,violet,red)] p-px w-[65px] h-[65px] animate-rotate-border shadow-lg shadow-white/10">
                                    <div
                                        className="bg-muted rounded-full w-full h-full flex justify-center items-center overflow-hidden p-3.5 inset-shadow-sm inset-shadow-white/10">
                                        <img src={logoURL} className="w-full h-full object-contain -ml-0.5 mt-0.5"
                                             alt="Logo"/>
                                    </div>
                                </div>


                                <div className={"flex flex-col w-full items-center lg:gap-2 pt-4 text-center"}>
                                    <motion.h1
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.7, delay: 0.3}}
                                        className="leading-8 font-normal text-2xl lg:text-3xl"
                                    >
                                        Ready to explore the world?
                                    </motion.h1>

                                    <Subtitle/>
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/*{sampleMessages?.length > 0 && (*/}
                    {/*    <div*/}
                    {/*        ref={containerRef}*/}
                    {/*        className="w-full h-full overflow-y-auto flex justify-center"*/}
                    {/*    >*/}
                    {/*        <div className="max-w-[752px] w-full px-4">*/}
                    {/*            <ChatContainer messages={sampleMessages} containerRef={containerRef} />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <motion.div
                        initial={{opacity: 0, y: -32}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, delay: 0.2}}
                        className={"w-full flex justify-center"}
                    >
                        <div className={`${isLoading ? "flex" : "hidden"}`}>
                            <LoadingDotsAnimation />
                        </div>
                        <PromptInputArea
                            onSubmit={handleGenerate}
                            className={"max-w-[752px] w-full px-2"}
                        />
                    </motion.div>

                    {sampleMessages?.length <= 0 && (
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 0}}
                            transition={{duration: 0.7, delay: 0.4}}
                            className="inline-block m-2"
                            layout
                        >
                            <PromptTips/>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
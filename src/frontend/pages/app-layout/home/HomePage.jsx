import React, {useState, useEffect, useRef} from "react";
import {motion} from "motion/react";
import {PromptInputArea} from "../../../components/custom/PromptInputArea.jsx";
import {ArrowUp, Loader, LogOut} from "lucide-react";
import {Button} from "../../../components/ui/Button.jsx";
import {Subtitle} from "../../../components/ui/Subtitle.jsx";
import {PromptTips} from "../../../components/custom/PromptTips.jsx";
import {ChatContainer} from "../../../components/custom/ChatContainer.jsx";
import {sampleMessages} from "../../sample-messages.jsx";
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

    const handleGenerate = async (userParagraph) => {
        try {
            const res = await fetch(`/api/itineraries/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: userParagraph
                }),
            });

            const ct = res.headers.get("content-type") || "";
            if (!res.ok) {
                const msg = ct.includes("application/json") ? (await res.json()).error : await res.text();
                throw new Error(`HTTP ${res.status}: ${msg}`);
            }

            const json = await res.json();
            if (!json.ok) {
                console.error("Generation failed:", json.error, json.details || "");
                return;
            }
            console.log("Itinerary:", json.data);
            // setPlan(json.data);  // <- store in state and render if you want
        } catch (e) {
            console.error("Network/Unexpected error:", e);
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
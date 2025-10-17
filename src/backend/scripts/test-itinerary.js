import {generateItineraryFromPrompt} from "./openai.js";

const userPrompt = `
We’re planning a 7-day high-budget trip to Mumbai and Vadodara in November 2025. We want to spend 2 days in vadodara 2 days in manali and also the mode of transportation is motorcycle. We love street food but I am vegetarian. Include must-try snacks.`;

const run = async () => {
    try {
        console.log("🚀 Generating itinerary...");
        const plan = await generateItineraryFromPrompt(userPrompt, {
            promptTemplate: { id: "pmpt_68dc81a73320819780475f732dcef55509b3ed914f0bf0af", version: "13" },
        });
        console.log("✅ Itinerary generated:\n", JSON.stringify(plan, null, 2));
    } catch (err) {
        console.error("❌ Generation failed:", err.message);
        if (err.details) console.error("Details:", err.details);
    }
};

run();

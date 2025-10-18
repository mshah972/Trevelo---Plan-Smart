import { getStore } from "@netlify/blobs";
import {generateItineraryFromPrompt} from "./_lib/openai.js";

const store = getStore({ name: "jobs" });

export default async (req) => {
    // Background functions don't need to return a response body
    const { jobId } = await req.json().catch(() => ({}));
    if (!jobId) return new Response(null, { status: 200 });

    // Load the job started by /api/itineraries/start
    const rec = await store.getJSON(jobId);
    if (!rec) return new Response(null, { status: 200 });

    try {
        await store.setJSON(jobId, { ...rec, status: "running", startedAt: Date.now() });

        // 🚀 NEW API: only pass the paragraph prompt
        const data = await generateItineraryFromPrompt(rec.prompt);

        await store.setJSON(jobId, {
            ...rec,
            status: "completed",
            completedAt: Date.now(),
            data,
        });
    } catch (err) {
        await store.setJSON(jobId, {
            ...rec,
            status: "failed",
            completedAt: Date.now(),
            error: err?.message || String(err),
            // optionally attach structured error info for the UI:
            ...(err?.code ? { code: err.code, details: err.details ?? null } : {}),
        });
    }

    return new Response(null, { status: 200 });
};
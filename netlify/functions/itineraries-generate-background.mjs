import { getStore } from "@netlify/blobs";
import {generateItineraryFromPrompt} from "./_lib/openai.js";

const store = getStore({ name: "jobs" });

async function readJob(id) {
    return await store.get(id, { type: "json" });
}
async function writeJob(id, obj) {
    await store.set(id, JSON.stringify(obj), { contentType: "application/json" });
}

export default async (req) => {
    const { jobId } = await req.json().catch(() => ({}));
    if (!jobId) return new Response(null, { status: 200 });

    const rec = await readJob(jobId);
    if (!rec) return new Response(null, { status: 200 });

    try {
        await writeJob(jobId, { ...rec, status: "running", startedAt: Date.now() });

        // New signature: just pass the paragraph
        const data = await generateItineraryFromPrompt(rec.prompt);

        await writeJob(jobId, {
            ...rec,
            status: "completed",
            completedAt: Date.now(),
            data,
        });
    } catch (err) {
        await writeJob(jobId, {
            ...rec,
            status: "failed",
            completedAt: Date.now(),
            error: err?.message || String(err),
            ...(err?.code ? { code: err.code, details: err.details ?? null } : {}),
        });
    }

    return new Response(null, { status: 200 });
};
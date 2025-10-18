import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const store = getStore({ name: "jobs" });

// small helpers so the rest of the code stays clean
async function readJob(id) {
    return await store.get(id, { type: "json" }); // returns parsed JSON or null
}
async function writeJob(id, obj) {
    await store.set(id, JSON.stringify(obj), { contentType: "application/json" });
}

export default async (req) => {
    const url = new URL(req.url);
    let path = url.pathname.replace(/^\/+/, "");
    if (path.startsWith("api/")) path = path.slice(4);
    path = path.replace(/\/{2,}/g, "/").replace(/\/$/, "");
    const method = req.method.toUpperCase();

    if (method === "GET" && path === "health") {
        return json({ ok: true, service: "itinerary-api" });
    }

    // POST /api/itineraries/start
    if (method === "POST" && path === "itineraries/start") {
        const body = await req.json().catch(() => ({}));
        const { prompt } = body;
        if (!prompt?.trim()) return json({ ok:false, error:"Missing 'prompt'." }, 400);

        const jobId = crypto.randomUUID();
        await writeJob(jobId, {
            status: "queued",
            createdAt: Date.now(),
            prompt: prompt.trim(),
        });

        // trigger background worker
        await fetch(`${url.origin}/.netlify/functions/itineraries-generate-background`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
        });

        return json({ ok: true, jobId }, 202);
    }

    // GET /api/jobs/:id
    const m = path.match(/^jobs\/([a-f0-9-]+)$/i);
    if (method === "GET" && m) {
        const job = await readJob(m[1]);
        if (!job) return json({ ok:false, error:"Job not found" }, 404);
        return json({ ok:true, job });
    }

    return json({ ok:false, error:"Not found" }, 404);
};

function json(obj, status = 200) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: { "content-type": "application/json" },
    });
}

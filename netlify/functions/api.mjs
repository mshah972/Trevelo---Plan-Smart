// excerpt from your router; keep your existing helpers/utilities
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const store = getStore({ name: "jobs" });

export default async (req) => {
    const url = new URL(req.url);
    let path = url.pathname.replace(/^\/+/, "");
    if (path.startsWith("api/")) path = path.slice(4);
    path = path.replace(/\/{2,}/g, "/").replace(/\/$/, "");
    const method = req.method.toUpperCase();

    if (method === "POST" && path === "itineraries/start") {
        const body = await req.json().catch(() => ({}));
        const { prompt } = body;

        if (!prompt?.trim()) {
            return json({ ok: false, error: "Missing 'prompt'." }, 400);
        }

        const jobId = crypto.randomUUID();
        await store.setJSON(jobId, {
            status: "queued",
            createdAt: Date.now(),
            prompt: prompt.trim(),
        });

        // kick off background worker
        await fetch(`${url.origin}/.netlify/functions/itineraries-generate-background`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
        });

        return json({ ok: true, jobId }, 202);
    }

    // polling route: GET /api/jobs/:id  (unchanged)
    const m = path.match(/^jobs\/([a-f0-9-]+)$/i);
    if (method === "GET" && m) {
        const rec = await store.getJSON(m[1]);
        if (!rec) return json({ ok: false, error: "Job not found" }, 404);
        return json({ ok: true, job: rec });
    }

    // optional: keep your /api/health and other routes...
    return json({ ok: false, error: "Not found" }, 404);
};

function json(obj, status = 200) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: { "content-type": "application/json" },
    });
}

// netlify/functions/api.mjs
import {generateItineraryFromPrompt} from "../../src/backend/scripts/openai.js";

export default async (req) => {
    const url = new URL(req.url);
    // In Netlify Dev, req.url can include the full URL; in prod too.
    // We want the path AFTER /api/
    const path = url.pathname.replace(/^\/api\//, "");

    // Debug (temporarily)
    console.log("[fn] method:", req.method, "path:", path);

    if (req.method === "GET" && path === "health") {
        return json({ ok: true, service: "itinerary-api" });
    }

    if (req.method === "POST" && path === "itineraries/generate") {
        const body = await req.json().catch(() => ({}));
        const { prompt, template, variables, model, temperature } = body;

        if (!prompt?.trim()) return json({ ok:false, error:"Missing 'prompt'." }, 400);
        if (!template?.id || !template?.version)
            return json({ ok:false, error:"Missing 'template': { id, version }." }, 400);

        try {
            const data = await generateItineraryFromPrompt(prompt, {
                model,
                temperature,
                promptTemplate: { id: template.id, version: template.version, ...(variables ? { variables } : {}) },
            });
            return json({ ok: true, data });
        } catch (err) {
            if (err?.code === "ZOD_VALIDATION_ERROR") return json({ ok:false, error: err.message, details: err.details }, 400);
            if (err?.code === "OPENAI_API_ERROR")     return json({ ok:false, error: err.message }, 502);
            console.error("[UNEXPECTED]", err);
            return json({ ok:false, error: "Internal server error" }, 500);
        }
    }

    return json({ ok:false, error:"Not found" }, 404);
};

function json(obj, status = 200) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: { "content-type": "application/json" },
    });
}

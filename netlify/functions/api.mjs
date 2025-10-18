// netlify/functions/api.mjs
import {generateItineraryFromPrompt} from "./_lib/openai.js";

export default async (req) => {
    // Normalize path: remove leading "/api/", collapse slashes, drop trailing slash
    const url = new URL(req.url);
    let path = url.pathname.replace(/^\/+/, "");
    if (path.startsWith("api/")) path = path.slice(4);
    path = path.replace(/\/{2,}/g, "/").replace(/\/$/, "");

    const method = req.method.toUpperCase();

    // TEMP: log what the function actually sees (check Netlify logs)
    console.log("[fn] method:", method, "path:", path);

    // Preflight for CORS (safe even if you don't use cookies)
    if (method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders(),
        });
    }

    // Health probe
    if (method === "GET" && path === "health") {
        return json({ ok: true, status: 200 });
    }

    // MAIN endpoint: accepts both `/api/itineraries/generate` and `/api/itineraries/generate/`
    if (method === "POST" && path === "itineraries/generate") {
        const body = await req.json().catch(() => ({}));
        const { prompt } = body;

        if (!prompt?.trim())       return json({ ok:false, error:"Missing 'prompt'." }, 400);

        try {
            const data = await generateItineraryFromPrompt(prompt);
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
        headers: { "content-type": "application/json", ...corsHeaders() },
    });
}
function corsHeaders() {
    return {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type",
    };
}

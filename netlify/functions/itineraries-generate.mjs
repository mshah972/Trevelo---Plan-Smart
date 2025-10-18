// netlify/functions/itineraries-generate.mjs
import {generateItineraryFromPrompt} from "Travel-Mate/src/backend/scripts/openai.js";

export default async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
                status: 405,
                headers: { "content-type": "application/json" },
            });
        }

        const body = await req.json().catch(() => ({}));
        const { prompt, template, variables, model, temperature } = body;

        if (!prompt?.trim()) {
            return new Response(JSON.stringify({ ok: false, error: "Missing 'prompt'." }), {
                status: 400, headers: { "content-type": "application/json" },
            });
        }
        if (!template?.id || !template?.version) {
            return new Response(JSON.stringify({ ok: false, error: "Missing 'template': { id, version }." }), {
                status: 400, headers: { "content-type": "application/json" },
            });
        }

        const data = await generateItineraryFromPrompt(prompt, {
            model,
            temperature,
            promptTemplate: {
                id: template.id,
                version: template.version,
                ...(variables ? { variables } : {}),
            },
        });

        return new Response(JSON.stringify({ ok: true, data }), {
            status: 200,
            headers: { "content-type": "application/json" },
        });
    } catch (err) {
        if (err?.code === "ZOD_VALIDATION_ERROR") {
            return new Response(JSON.stringify({ ok: false, error: err.message, details: err.details }), {
                status: 400, headers: { "content-type": "application/json" },
            });
        }
        if (err?.code === "OPENAI_API_ERROR") {
            return new Response(JSON.stringify({ ok: false, error: err.message }), {
                status: 502, headers: { "content-type": "application/json" },
            });
        }
        console.error("[UNEXPECTED]", err);
        return new Response(JSON.stringify({ ok: false, error: "Internal server error" }), {
            status: 500, headers: { "content-type": "application/json" },
        });
    }
};

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import {generateItineraryFromPrompt} from "./scripts/openai.js";

dotenv.config();

const {
    PORT = process.env.PORT,
    FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN,
} = process.env;

const app = express();

// Security & plumbing
app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "itinerary-api" });
});

// Generate itinerary via your template
app.post("/api/itineraries/generate", async (req, res) => {
    try {
        const { prompt, template, variables, model, temperature } = req.body || {};

        if (typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({ ok: false, error: "Missing 'prompt'." });
        }
        if (!template?.id || !template?.version) {
            return res.status(400).json({
                ok: false,
                error: "Missing 'template': { id, version }.",
            });
        }

        const plan = await generateItineraryFromPrompt(prompt, {
            model,
            temperature,
            promptTemplate: {
                id: template.id,
                version: template.version,
                ...(variables ? { variables } : {}),
            },
        });

        res.json({ ok: true, data: plan });
    } catch (err) {
        // Map known error codes from your function
        if (err.code === "ZOD_VALIDATION_ERROR") {
            return res.status(400).json({ ok: false, error: err.message, details: err.details });
        }
        if (err.code === "OPENAI_API_ERROR") {
            return res.status(502).json({ ok: false, error: err.message });
        }
        console.error("[UNEXPECTED]", err);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

// Start
app.listen(PORT, () => {
    console.log(`Itinerary API listening on ${PORT}`);
});

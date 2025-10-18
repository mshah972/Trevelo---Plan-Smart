import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import {generateItineraryFromPrompt} from "../../netlify/functions/_lib/openai.js";

dotenv.config();

const app = express();

// ----- CORS (allow the frontend origin) -----
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "https://trevelo.ai";
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // set to true only if you’ll send cookies/auth
}));
app.use(cors({ origin: ["https://trevelo.ai", "https://www.trevelo.ai"] }));

// ----- Baseline hardening & JSON parsing -----
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "itinerary-api" }));

// Main route
app.post("/api/itineraries/generate", async (req, res) => {
    try {
        const { prompt, template, variables, model, temperature } = req.body || {};
        if (!prompt?.trim()) return res.status(400).json({ ok: false, error: "Missing 'prompt'." });
        if (!template?.id || !template?.version) {
            return res.status(400).json({ ok: false, error: "Missing 'template': { id, version }." });
        }

        const data = await generateItineraryFromPrompt(prompt, {
            model,
            promptTemplate: { id: template.id, version: template.version, ...(variables ? { variables } : {}) },
        });

        res.json({ ok: true, data });
    } catch (err) {
        if (err.code === "ZOD_VALIDATION_ERROR") return res.status(400).json({ ok:false, error: err.message, details: err.details });
        if (err.code === "OPENAI_API_ERROR")     return res.status(502).json({ ok:false, error: err.message });
        console.error("[UNEXPECTED]", err);
        res.status(500).json({ ok:false, error: "Internal server error" });
    }
});

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on :${PORT}`));

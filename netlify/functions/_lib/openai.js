import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ItinerarySchema = z.object({
  title: z.string(),
  destination: z.string(),
  duration: z.number(),
  activities: z.array(z.object({
    day: z.number(),
    description: z.string(),
    location: z.string().optional(),
  })),
});

export async function generateItineraryFromPrompt(prompt, options = {}) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.7,
    promptTemplate = {},
  } = options;

  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OpenAI API key not configured");
    error.code = "OPENAI_API_ERROR";
    throw error;
  }

  try {
    const systemPrompt = `You are a travel itinerary generator. Generate a detailed travel itinerary in JSON format based on the user's request. 
Return ONLY valid JSON without markdown code blocks or any other formatting.
The response must match this structure:
{
  "title": "string",
  "destination": "string",
  "duration": number,
  "activities": [
    {
      "day": number,
      "description": "string",
      "location": "string (optional)"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      const error = new Error("No response from OpenAI");
      error.code = "OPENAI_API_ERROR";
      throw error;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      const error = new Error("Failed to parse OpenAI response as JSON");
      error.code = "OPENAI_API_ERROR";
      throw error;
    }

    const validated = ItinerarySchema.parse(parsedData);
    return validated;

  } catch (err) {
    if (err.name === "ZodError") {
      const zodError = new Error("Invalid itinerary format returned from AI");
      zodError.code = "ZOD_VALIDATION_ERROR";
      zodError.details = err.errors;
      throw zodError;
    }

    if (err.code === "OPENAI_API_ERROR") {
      throw err;
    }

    if (err.response?.status || err.status) {
      const apiError = new Error(err.message || "OpenAI API request failed");
      apiError.code = "OPENAI_API_ERROR";
      throw apiError;
    }

    throw err;
  }
}

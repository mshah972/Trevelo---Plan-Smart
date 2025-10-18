import OpenAI from "openai";
import {z} from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ItinerarySchema = z.object({
    tripTitle: z.string()
        .describe("A creative and catchy title for the itinerary."),
    summary: z.string()
        .describe("4 to 6 sentences about the trip and things planned in proper English sentences. Capture the overall spirit and highlights."),
    dailyPlan: z.array(
        z.object({
            day: z.number().int().positive()
                .describe("The day number, starting from 1."),
            theme: z.string()
                .describe("A one or two-word theme for the day (e.g., 'Historical Immersion', 'Coastal Exploration')."),
            themeDescription: z.string()
                .describe("Short 3 to 4 sentences about things will be doing in proper English sentences"),
            activities: z.array(
                z.object({
                    timeOfDay: z.enum(["Morning", "Afternoon", "Evening"])
                        .describe("Time segment of the activity."),
                    location: z.string()
                        .describe("The name of the place, landmark, or a specific address. Main venue or restaurant name only."),
                    description: z.string()
                        .describe("5–6+ detailed, engaging sentences. Start with the reasoning or value of the activity, and end with a summary or recommendation. Do not use meta-labels like 'Description:'."),
                    costLabel: z.enum(["low", "mid", "high"])
                        .describe("Relative expense label based on the local context (e.g., 'low', 'mid', 'high'). Do not use numbers or currency symbols."),
                    gpsCoordinates: z.object({
                        latitude: z.number().describe("Plausible latitude for the location."),
                        longitude: z.number().describe("Plausible longitude for the location."),
                    }),
                })
            ).describe("An array of 2-4 scheduled attractions or activities for the day."),
            restaurants: z.object({
                lunch: z.object({
                    name: z.string().describe("Main restaurant name only."),
                    description: z.string().describe("2–3 sentences about style/cuisine, a suggested dish, and its connection to the day's theme or local culture."),
                }),
                dinner: z.object({
                    name: z.string().describe("Main restaurant name only."),
                    description: z.string().describe("2–3 sentences about style/cuisine, a suggested dish, and its connection to the day's theme or local culture."),
                }),
                snacks: z.array(z.object({
                    name: z.string().describe("Main snack spot name only."),
                    description: z.string().describe("1–2 sentences on local snack specialties."),
                })).optional(),
                mustTry: z.array(z.object({
                    name: z.string().describe("A notable local place or food item."),
                    description: z.string().describe("1 short sentence on what makes this a 'must try' experience."),
                })).optional(),
            }).describe("Recommendations for lunch, dinner, and optional snacks for the day."),
        })
    ).describe("The array of daily plans, one for each day of the trip."),
    listOfPlaces: z.array(
        z.object({
            places: z.object({
                city: z.string().min(1)
                    .describe("City name (e.g., 'Paris')."),
                stateOrRegion: z.string()
                    .describe("State/region if applicable (use '' if not applicable)."),
                country: z.string()
                    .describe("Country name or ISO 3166-1 alpha-2 code (use '' if unknown)."),
            }).describe("City and region/country for hotel search. All keys required by API."),
        }).strict()
    ).min(1)
        .describe("Cities you plan to visit (used to query hotels)."),
    totalBudget: z.enum(["low", "mid", "high"])
        .describe("Overall trip budget tier to guide hotel search."),
});

const tripPlanJsonSchema = {
    type: "object",
    properties: {
        tripTitle: {type: "string", description: "The trip title"},
        summary: {
            type: "string",
            description: "4 to 6 sentences about the trip and things planned in proper English sentences"
        },
        dailyPlan: {
            type: "array",
            description: "Detailed itinerary for each day of the trip",
            items: {
                type: "object",
                properties: {
                    day: {type: "integer", description: "The day number"},
                    theme: {type: "string", description: "Theme or main focus of the day"},
                    themeDescription: {
                        type: "string",
                        description: "Short 3 to 4 sentences about things will be doing in proper English sentences"
                    },
                    activities: {
                        type: "array",
                        description: "Scheduled attractions or activities for the day",
                        items: {
                            type: "object",
                            properties: {
                                timeOfDay: {
                                    type: "string",
                                    enum: ["Morning", "Afternoon", "Evening"],
                                    description: "Time segment of the activity"
                                },
                                location: {type: "string", description: "Main venue or restaurant name only"},
                                description: {
                                    type: "string",
                                    description: "5–6+ sentences. Start with reasoning or value, end with summary/recommendation. No meta-labels. No citation for web-search. Just place english text."
                                },
                                costLabel: {
                                    type: "string",
                                    enum: ["low", "mid", "high"],
                                    description: "Relative expense label per local context (no numbers/currency)"
                                },
                                gpsCoordinates: {
                                    type: "object",
                                    properties: {
                                        latitude: {type: "number", description: "Latitude of location"},
                                        longitude: {type: "number", description: "Longitude of location"}
                                    },
                                    required: ["latitude", "longitude"],
                                    additionalProperties: false
                                }
                            },
                            required: ["timeOfDay", "location", "description", "costLabel", "gpsCoordinates"],
                            additionalProperties: false
                        }
                    },
                    restaurants: {
                        type: "object",
                        properties: {
                            lunch: {
                                type: "object",
                                properties: {
                                    name: {type: "string", description: "Main restaurant name only"},
                                    description: {
                                        type: "string",
                                        description: "2–3 sentences about style/cuisine, suggested dish, connection to day's theme/culture, No meta-labels. No citation for web-search. Just place english text."
                                    }
                                },
                                required: ["name", "description"],
                                additionalProperties: false
                            },
                            dinner: {
                                type: "object",
                                properties: {
                                    name: {type: "string", description: "Main restaurant name only"},
                                    description: {
                                        type: "string",
                                        description: "2–3 sentences about style/cuisine, suggested dish, connection to day's theme/culture, No meta-labels. No citation for web-search. Just place english text."
                                    }
                                },
                                required: ["name", "description"],
                                additionalProperties: false
                            },
                            snacks: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {type: "string", description: "Main snack spot name only"},
                                        description: {
                                            type: "string",
                                            description: "1–2 sentences on local snack specialties, No meta-labels. No citation for web-search. Just place english text."
                                        }
                                    },
                                    required: ["name", "description"],
                                    additionalProperties: false
                                }
                            },
                            mustTry: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {type: "string", description: "Notable place or food item"},
                                        description: {
                                            type: "string",
                                            description: "1 short sentence on what makes this a 'must try', No meta-labels. No citation for web-search. Just place english text."
                                        }
                                    },
                                    required: ["name", "description"],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ["lunch", "dinner", "snacks", "mustTry"],
                        additionalProperties: false
                    }
                },
                required: ["day", "theme", "themeDescription", "activities", "restaurants"],
                additionalProperties: false
            }
        },
        listOfPlaces: {
            type: "array",
            minItems: 1,
            description: "Cities you plan to visit (optional state/region/country) for hotel search.",
            items: {
                type: "object",
                properties: {
                    places: {
                        type: "object",
                        additionalProperties: false,
                        required: ["city", "stateOrRegion", "country"],
                        properties: {
                            city: {type: "string", minLength: 1, description: "City name (e.g., 'Paris')"},
                            stateOrRegion: {
                                type: "string",
                                description: "State/region if applicable (e.g., 'CA' or 'Ile-de-France')",
                            },
                            country: {
                                type: "string",
                                description: "Country name or ISO 3166-1 alpha-2 code (e.g., 'US' or 'FR')"
                            }
                        }
                    }
                },
                required: ["places"],
                additionalProperties: false
            }
        },
        totalBudget: {
            type: "string",
            enum: ["low", "mid", "high"],
            description: "Overall trip budget tier to guide hotel search."
        }
    },
    required: ["tripTitle", "summary", "dailyPlan", "listOfPlaces", "totalBudget"],
    additionalProperties: false
};

export async function generateItineraryFromPrompt(userInput, opts = {}) {
    console.log("--------------------");
    console.log("Attempting to generate itinerary");

    if (typeof userInput !== "string" || userInput.trim().length === 0) {
        throw new Error("Prompt must be a non-empty string.");
    }

    const {
        model = "gpt-5",
        prompt: promptRef,
    } = opts;

    // Build messages: one system, one user (your paragraph)
    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: userInput.trim(), // <-- must be a string, not {userInput}
                }
            ]
        }
    ];

    try {
        const response = await openai.responses.parse({
            model,
            input: messages,
            ...(promptRef ? {prompt: promptRef} : {}), // include your prompt template only if provided
            text: {
                format: {
                    type: "json_schema",
                    name: "trip_plan_no_hotels",
                    strict: true,
                    schema: tripPlanJsonSchema, // your raw JSON schema defined above
                },
                verbosity: "medium",
            },
            reasoning: {summary: null},
        });

        // 1) Parse to JSON via SDK
        const rawItinerary = response.output_parsed;

        // 2) Validate with Zod for strong typing
        const validatedItinerary = ItinerarySchema.parse(rawItinerary);

        console.log("✅ OpenAI response parsed and validated successfully!");
        return validatedItinerary;

    } catch (error) {
        // Zod validation errors have .issues
        if (error?.issues && Array.isArray(error.issues)) {
            const details = error.issues.map(e => ({
                path: Array.isArray(e.path) ? e.path.join(".") : String(e.path ?? ""),
                message: e.message
            }));
            const err = new Error(`Zod validation failed: ${JSON.stringify(details)}`);
            err.code = "ZOD_VALIDATION_ERROR";
            err.details = details;
            throw err;
        }

        // OpenAI API errors typically include status/message
        if (error?.status || error?.code) {
            const err = new Error(
                `OpenAI error${error.status ? ` (${error.status})` : ""}: ${error.message || "Unknown error"}`
            );
            err.code = "OPENAI_API_ERROR";
            throw err;
        }

        // Fallback
        const err = new Error(`Unexpected error: ${error?.message || String(error)}`);
        err.code = "UNEXPECTED_ERROR";
        throw err;
    }
}

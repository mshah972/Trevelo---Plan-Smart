import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z, ZodError } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Schema definition for an itinerary object.
 *
 * The schema defines the structure and required properties for creating a detailed itinerary, including trip information, daily plans, and associated metadata.
 *
 * Properties:
 * - `tripTitle`: A creative and catchy title for the itinerary.
 * - `summary`: 4 to 6 sentences about the trip and things planned in proper English sentences. Captures the overall spirit and highlights.
 * - `dailyPlan`: An array of daily plans, each describing specific details for one day of the trip. Includes day number, theme, activities, and food recommendations.
 * - `listOfPlaces`: Cities you plan to visit, used to query hotels. Requires city, state/region (if applicable), and country information.
 * - `totalBudget`: Overall trip budget tier to guide hotel search. Possible values: 'low', 'mid', 'high'.
 */
const itinerarySchema = z.object({
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


/**
 * JSON schema for validating a trip plan object.
 *
 * @type {object}
 * @property {string} tripTitle The title of the trip.
 * @property {string} summary A 4 to 6 sentence summary about the trip and planned activities, written in proper English sentences.
 * @property {Array} dailyPlan Detailed day-by-day itinerary for the trip.
 * @property {Array} listOfPlaces A list of cities or destinations to be visited, with optional state/region/country information for hotel search.
 * @property {string} totalBudget The overall trip budget tier to guide hotel search. Acceptable values are "low", "mid", or "high".
 */
const tripPlanJsonSchema = {
    type: "object",
    properties: {
        tripTitle: { type: "string", description: "The trip title" },
        summary: { type: "string", description: "4 to 6 sentences about the trip and things planned in proper English sentences" },
        dailyPlan: {
            type: "array",
            description: "Detailed itinerary for each day of the trip",
            items: {
                type: "object",
                properties: {
                    day: { type: "integer", description: "The day number" },
                    theme: { type: "string", description: "Theme or main focus of the day" },
                    themeDescription: {type: "string", description: "Short 3 to 4 sentences about things will be doing in proper English sentences"},
                    activities: {
                        type: "array",
                        description: "Scheduled attractions or activities for the day",
                        items: {
                            type: "object",
                            properties: {
                                timeOfDay: { type: "string", enum: ["Morning", "Afternoon", "Evening"], description: "Time segment of the activity" },
                                location: { type: "string", description: "Main venue or restaurant name only" },
                                description: { type: "string", description: "5–6+ sentences. Start with reasoning or value, end with summary/recommendation. No meta-labels. No citation for web-search. Just place english text." },
                                costLabel: { type: "string", enum: ["low", "mid", "high"], description: "Relative expense label per local context (no numbers/currency)" },
                                gpsCoordinates: {
                                    type: "object",
                                    properties: {
                                        latitude: { type: "number", description: "Latitude of location" },
                                        longitude: { type: "number", description: "Longitude of location" }
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
                                    name: { type: "string", description: "Main restaurant name only" },
                                    description: { type: "string", description: "2–3 sentences about style/cuisine, suggested dish, connection to day's theme/culture, No meta-labels. No citation for web-search. Just place english text." }
                                },
                                required: ["name", "description"],
                                additionalProperties: false
                            },
                            dinner: {
                                type: "object",
                                properties: {
                                    name: { type: "string", description: "Main restaurant name only" },
                                    description: { type: "string", description: "2–3 sentences about style/cuisine, suggested dish, connection to day's theme/culture, No meta-labels. No citation for web-search. Just place english text." }
                                },
                                required: ["name", "description"],
                                additionalProperties: false
                            },
                            snacks: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", description: "Main snack spot name only" },
                                        description: { type: "string", description: "1–2 sentences on local snack specialties, No meta-labels. No citation for web-search. Just place english text." }
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
                                        name: { type: "string", description: "Notable place or food item" },
                                        description: { type: "string", description: "1 short sentence on what makes this a 'must try', No meta-labels. No citation for web-search. Just place english text." }
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
                            city : { type: "string", minLength: 1, description: "City name (e.g., 'Paris')"},
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


/**
 * Generates and validates a travel itinerary based on user input.
 * This method interacts with the OpenAI API to generate a raw itinerary
 * and then validates the returned data using a predefined schema for type safety.
 * If an error occurs during the process, it logs the error details and returns null.
 *
 * @return {Object|null} The validated itinerary object, or null if an error occurs.
 */
async function getValidatedItinerary() {
    console.log("--------------------");
    console.log(`Attempting to generate itinerary`);

    try {
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: "We are planning a 12-day luxury honeymoon to India for this winter. We want an incredibly romantic and relaxing experience. Our ideal trip would combine seeing iconic cultural sites like the Taj Mahal with staying in beautiful heritage palace hotels. We are big foodies and would love to experience some of the best fine-dining Indian cuisine. We prefer a leisurely pace with plenty of downtime for relaxation."
                    }
                ]
            },
        ];

        // 3. Call the OpenAI API using `responses.parse` and the raw JSON schema.
        const response = await openai.responses.parse({
            model: "gpt-5",
            prompt : {
                id: "pmpt_68dc81a73320819780475f732dcef55509b3ed914f0bf0af",
                version: "11"
            },
            input: messages,
            text: {
                format: {
                    type: "json_schema",
                    name: "trip_plan_no_hotels",
                    strict: true,
                    schema: tripPlanJsonSchema,
                },
                verbosity: "medium"
            },
            reasoning: {
                summary: null
            },
        });

        // The `response.output_parsed` contains the JSON object from the API.
        const rawItinerary = response.output_parsed;

        // 4. We still parse with Zod on our side to get full type-safety.
        const validatedItinerary = itinerarySchema.parse(rawItinerary);

        console.log("✅ OpenAI response parsed and validated successfully!");
        return validatedItinerary;

    } catch (error) {
        if (error instanceof ZodError) {
            console.error("❌ Zod Validation Failed after API call:", error.errors);
        } else if (error instanceof OpenAI.APIError) {
            console.error("❌ OpenAI API Error:", error.status, error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
        return null;
    }
}

// --- Example Usage ---
async function generateLuxuryHoneymoonPlan() {

    const itinerary = await getValidatedItinerary();

    if (itinerary) {
        console.log("\n--- GENERATED ITINERARY ---");
        console.log(JSON.stringify(itinerary, null, 2)); // Pretty-print the JSON
        console.log("\n---------------------------\n");
    } else {
        console.log("\n--- FAILED TO GENERATE ITINERARY ---\n");
    }
}

// Uncomment to run the example when you execute this file
generateLuxuryHoneymoonPlan();
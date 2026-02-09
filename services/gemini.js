import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchPlayerByName, searchPlayersByTags } from "./mock_database.js";

const MODEL_NAME = "gemini-2.0-flash-lite";

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: MODEL_NAME,
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "get_player_stats",
                            description: "Get detailed stats, market value, and contract info for a specific football player.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING", description: "The name of the player (e.g., 'Lamine Yamal', 'Haaland')" }
                                },
                                required: ["name"]
                            }
                        },
                        {
                            name: "scout_players",
                            description: "Find players matching specific criteria or tags.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    tags: { type: "STRING", description: "Comma-separated list of tags, positions, or attributes (e.g., 'striker, fast', 'wonderkid, real madrid')" }
                                },
                                required: ["tags"]
                            }
                        }
                    ]
                }
            ]
        });
    }

    async chat(userQuery) {
        try {
            const chat = this.model.startChat();
            console.log(`\n🤖 GEMINI: Processing "${userQuery}"...`);

            // 1. Send query to Gemini
            const result = await chat.sendMessage(userQuery);
            const call = result.response.functionCalls()?.[0];

            // 2. If Gemini wants to call a tool
            if (call) {
                console.log(`   > Tool Call: ${call.name}(${JSON.stringify(call.args)})`);

                let toolResult = null;

                if (call.name === "get_player_stats") {
                    toolResult = searchPlayerByName(call.args.name);
                } else if (call.name === "scout_players") {
                    toolResult = searchPlayersByTags(call.args.tags);
                    // Limit results to top 5 to keep context small
                    if (Array.isArray(toolResult)) toolResult = toolResult.slice(0, 5);
                }

                console.log(`   > Tool Result: Found ${Array.isArray(toolResult) ? toolResult.length + ' items' : (toolResult ? '1 item' : '0 items')}`);

                // 3. Send tool result back to Gemini
                const result2 = await chat.sendMessage([
                    {
                        functionResponse: {
                            name: call.name,
                            response: { result: toolResult }
                        }
                    }
                ]);

                return result2.response.text();

            } else {
                // No tool needed (just chat)
                return result.response.text();
            }

        } catch (error) {
            console.error("Gemini Error:", error);
            return "❌ I'm having trouble connecting to my brain (Gemini). Please check the server logs.";
        }
    }
}

export const geminiService = new GeminiService();

// Handle common errors to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

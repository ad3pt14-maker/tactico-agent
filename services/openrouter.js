import { searchPlayerByName, searchPlayersByTags } from "./mock_database.js";

// Free models on OpenRouter that support tool calling
const FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-4b:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "google/gemma-3-27b-it:free",
    "nvidia/nemotron-nano-9b-v2:free"
];

const TOOLS = [
    {
        type: "function",
        function: {
            name: "get_player_stats",
            description: "Get detailed stats, market value, and contract info for a specific football player.",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string", description: "The name of the player (e.g., 'Lamine Yamal', 'Haaland')" }
                },
                required: ["name"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "scout_players",
            description: "Find players matching specific criteria or tags.",
            parameters: {
                type: "object",
                properties: {
                    tags: { type: "string", description: "Comma-separated list of tags, positions, or attributes (e.g., 'striker, fast', 'wonderkid, real madrid')" }
                },
                required: ["tags"]
            }
        }
    }
];

// Custom error for rate limiting
class RateLimitError extends Error {
    constructor(model, message) {
        super(message);
        this.name = "RateLimitError";
        this.model = model;
    }
}

class OpenRouterService {
    constructor() {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
        }
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseUrl = "https://openrouter.ai/api/v1/chat/completions";
        this.currentModelIndex = 0;
        this.model = FREE_MODELS[this.currentModelIndex];
    }

    // Check if error is retriable (rate limit or temporary)
    isRetriableError(status) {
        return status === 429 || status === 503 || status === 502;
    }

    // Switch to the next available model
    switchToNextModel() {
        this.currentModelIndex++;
        if (this.currentModelIndex >= FREE_MODELS.length) {
            this.currentModelIndex = 0; // Reset for next request
            return false; // No more models to try
        }
        this.model = FREE_MODELS[this.currentModelIndex];
        console.log(`   > Switching to backup model: ${this.model}`);
        return true;
    }

    // Reset model index (call after successful response)
    resetModelIndex() {
        this.currentModelIndex = 0;
        this.model = FREE_MODELS[0];
    }

    // Main chat method with automatic fallback
    async chat(userQuery) {
        const startingIndex = this.currentModelIndex;
        let lastError = null;

        // Try each model until one works
        do {
            try {
                const result = await this._chatSingleAttempt(userQuery);
                // Success - reset to first model for next request
                this.resetModelIndex();
                return result;
            } catch (error) {
                lastError = error;

                if (error instanceof RateLimitError) {
                    console.log(`   > Model ${error.model} rate limited, trying next...`);

                    if (!this.switchToNextModel()) {
                        // All models exhausted
                        break;
                    }

                    // Small delay before retry
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    // Non-retriable error, give up
                    console.error("OpenRouter Error:", error);
                    return "❌ I'm having trouble connecting to OpenRouter. Please check the server logs.";
                }
            }
        } while (this.currentModelIndex !== startingIndex);

        // All models exhausted
        console.error("All models rate limited:", lastError);
        this.resetModelIndex();
        return "❌ All AI models are currently rate limited. Please try again in a minute.";
    }

    // Single attempt to chat with the current model
    async _chatSingleAttempt(userQuery) {
        console.log(`\n🤖 OPENROUTER: Processing "${userQuery}" with ${this.model}...`);

        // 1. Send query to OpenRouter
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Tactico AI"
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are Tactico, an AI football scouting assistant. Use the provided tools to look up player stats or find players matching criteria. Be concise and helpful."
                    },
                    { role: "user", content: userQuery }
                ],
                tools: TOOLS,
                tool_choice: "auto"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (this.isRetriableError(response.status)) {
                throw new RateLimitError(this.model, errorText);
            }
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const message = data.choices[0].message;

        // 2. Check if model wants to call a tool
        if (message.tool_calls && message.tool_calls.length > 0) {
            const call = message.tool_calls[0];
            const funcName = call.function.name;
            const args = JSON.parse(call.function.arguments);

            console.log(`   > Tool Call: ${funcName}(${JSON.stringify(args)})`);

            let toolResult = null;

            if (funcName === "get_player_stats") {
                toolResult = searchPlayerByName(args.name);
            } else if (funcName === "scout_players") {
                toolResult = searchPlayersByTags(args.tags);
                if (Array.isArray(toolResult)) toolResult = toolResult.slice(0, 5);
            }

            console.log(`   > Tool Result: Found ${Array.isArray(toolResult) ? toolResult.length + ' items' : (toolResult ? '1 item' : '0 items')}`);

            // 3. Send tool result back to model
            const response2 = await fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Tactico AI"
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: "You are Tactico, an AI football scouting assistant. Present the data clearly and concisely."
                        },
                        { role: "user", content: userQuery },
                        message,
                        {
                            role: "tool",
                            tool_call_id: call.id,
                            content: JSON.stringify(toolResult)
                        }
                    ]
                })
            });

            if (!response2.ok) {
                const errorText = await response2.text();
                if (this.isRetriableError(response2.status)) {
                    throw new RateLimitError(this.model, errorText);
                }
                throw new Error(`OpenRouter API error: ${response2.status} - ${errorText}`);
            }

            const data2 = await response2.json();
            return data2.choices[0].message.content;

        } else {
            // No tool needed
            return message.content;
        }
    }
}

export const openRouterService = new OpenRouterService();

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY missing");
            return;
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log("Fetching models...");
        // Using fetch directly or checking if the SDK has it
        // The SDK usually doesn't have a direct listModels but we can try v1
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("❌ No models found or error:", data);
        }

    } catch (error) {
        console.error("❌ List Models Failed:", error);
    }
}

listModels();

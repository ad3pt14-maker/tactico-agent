import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY missing");
            return;
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Using a model confirmed in your list
        console.log("Connecting to gemini-2.0-flash-lite...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent("Hello! Are you working?");
        console.log("✅ Gemini 2.0 Flash responded:", result.response.text());

    } catch (error) {
        console.error("❌ Gemini Test Failed:", error);
        if (error.status === 404) {
            console.log("TIP: The model name might be case-sensitive or requires 'models/' prefix depending on the SDK version.");
        }
    }
}

test();

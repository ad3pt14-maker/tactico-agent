import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for now (dev mode)
app.use(express.json());

// Serve static files from the 'docs' directory (Frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'docs')));

// --- Database & AI Services ---
import { searchPlayerByName, searchPlayersByTags } from './services/mock_database.js';
// Lazy load AI service to avoid crash if API Key is missing during startup check
let aiService = null;
try {
    const { openRouterService } = await import('./services/openrouter.js');
    aiService = openRouterService;
} catch (e) {
    console.warn("⚠️ OpenRouter Service could not be loaded (likely missing API Key). Agent endpoint will fail.");
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        services: {
            openrouter: !!aiService
        }
    });
});

// Agent Endpoint (OpenRouter Proxy)
app.post('/api/agent', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    if (!aiService) {
        return res.status(503).json({ error: "AI Service Unavailable. Check server logs." });
    }

    try {
        const aiResponse = await aiService.chat(query);
        res.json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: "Internal Agent Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n⚽ Tactico AI Server running at http://localhost:${PORT}`);
    console.log(`   - Frontend: http://localhost:${PORT}`);
    console.log(`   - Health:   http://localhost:${PORT}/api/health`);
});

/**
 * Tactico AI - Browser Agent Logic (AI-Powered)
 * Sends natural language queries to the Backend and displays the response.
 */

// API base URL - change this when deploying
// For local: leave empty (uses relative /api/agent)
// For GitHub Pages: set to your tunnel/server URL
const API_BASE_URL = window.location.hostname === 'localhost'
    ? ''
    : 'https://kind-shoes-worry.loca.lt';

class TacticoAgent {
    constructor() {
        this.name = "Tactico Scout (AI)";
    }

    // The "Loop": Input -> API -> Output
    async process(query) {
        console.log(`\n🤖 TACTICO THINKING (AI): "${query}"`);

        try {
            const response = await fetch(`${API_BASE_URL}/api/agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return `⚠️ Server Error: ${errorData.error || response.statusText}`;
            }

            const data = await response.json();

            // Format the AI response (Gemini returns markdown, we can render it simply)
            // Replace newlines with <br> for basic HTML display
            return this.formatResponse(data.response);

        } catch (error) {
            console.error("Agent Error:", error);
            return "❌ Connection Failed. Is the server running?";
        }
    }

    formatResponse(text) {
        // Simple Markdown-ish to HTML converter
        let html = text
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
            .replace(/\*(.*?)\*/g, "<em>$1</em>");           // Italic

        return `
            <strong>🤖 AI ANALYSIS</strong><br>
            ----------------------------------------<br>
            ${html}
        `;
    }
}

// Expose to global scope for app.js
window.TacticoAgent = TacticoAgent;

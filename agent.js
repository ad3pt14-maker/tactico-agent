import { get_player_data, find_similar_players } from './tools.js';

export class TacticoAgent {
    constructor() {
        this.name = "Tactico Scout";
    }

    // The "Loop": Input -> Think -> Tool -> Output
    async process(query) {
        console.log(`\n🤖 TACTICO THINKING: "${query}"`);

        // 1. INTENT RECOGNITION (The "Brain")
        // In a real agent, an LLM does this. Here, we simulate it with logic/Regex.

        const q = query.toLowerCase();

        // SCENARIO 1: Asking for player stats
        // Trigger words: stats, profile, who is, how is
        if (q.includes("stats") || q.includes("profile") || q.includes("who is") || q.includes("how is")) {
            // Extract name (cheating a bit by checking our DB names)
            const knownPlayers = ["lamine yamal", "mo salah", "erling haaland", "vinicius jr"];
            const detectedName = knownPlayers.find(p => q.includes(p));

            if (detectedName) {
                console.log(`   > Intent: Get Data > Entity: ${detectedName}`);
                const data = get_player_data(detectedName);
                if (data) {
                    return this.formatStatResponse(data);
                }
            }
        }

        // SCENARIO 2: Scouting / Similar players
        // Trigger words: like, similar, scout, find me
        if (q.includes("like") || q.includes("similar") || q.includes("scout") || q.includes("find me")) {
            // Extract simple tags
            const tags = ["creative", "finisher", "speed", "dribbler", "left-footed", "poacher", "wonderkid"];
            const detectedTags = tags.filter(t => q.includes(t));

            if (detectedTags.length > 0) {
                console.log(`   > Intent: Find Similar > Tags: ${detectedTags}`);
                const matches = find_similar_players(detectedTags.join(","));
                if (matches.length > 0) {
                    return this.formatScoutResponse(matches);
                } else {
                    return "⚠️ No players found in DB matching those traits.";
                }
            }
        }

        return "❌ TACTICO ERROR: Query not understood. Try asking about 'Yamal stats' or 'find me creative players'.";
    }

    // "Generator" - Formats the JSON into text (The "Speak" part)
    formatStatResponse(data) {
        return `
✅ ANALYSIS COMPLETE: ${data.profile.name}
----------------------------------------
Club: ${data.profile.club} | Age: ${data.profile.age} | Val: ${data.profile.value}
📊 Performance: 
   - Goals: ${data.performance.goals}
   - xG/90: ${data.performance.xg_per_90} (Elite)
   - Dribbles/90: ${data.performance.dribbles_per_90}
`;
    }

    formatScoutResponse(players) {
        const list = players.map(p => `- ${p.name} (${p.club})`).join("\n");
        return `
🔍 SCOUTING REPORT
----------------------------------------
Found ${players.length} candidates matching your criteria:
${list}
`;
    }
}

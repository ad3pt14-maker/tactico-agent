
// Mock Database - The "Knowledge Base"
const PLAYERS = [
    {
        name: "Lamine Yamal",
        age: 17,
        club: "FC Barcelona",
        position: "Right Winger",
        market_value: "€150m",
        stats: {
            goals: 6,
            assists: 8,
            xg_per_90: 0.35,
            xa_per_90: 0.45,
            dribbles_per_90: 3.2
        },
        tags: ["wonderkid", "creative", "left-footed"]
    },
    {
        name: "Mohamed Salah",
        age: 32,
        club: "Liverpool FC",
        position: "Right Winger",
        market_value: "€55m",
        stats: {
            goals: 18,
            assists: 10,
            xg_per_90: 0.75,
            xa_per_90: 0.40,
            dribbles_per_90: 1.5
        },
        tags: ["finisher", "experienced", "left-footed"]
    },
    {
        name: "Erling Haaland",
        age: 24,
        club: "Manchester City",
        position: "Striker",
        market_value: "€180m",
        stats: {
            goals: 25,
            assists: 5,
            xg_per_90: 1.10,
            xa_per_90: 0.15,
            dribbles_per_90: 0.4
        },
        tags: ["finisher", "physical", "poacher"]
    },
    {
        name: "Vinicius Jr",
        age: 24,
        club: "Real Madrid",
        position: "Left Winger",
        market_value: "€180m",
        stats: {
            goals: 15,
            assists: 12,
            xg_per_90: 0.60,
            xa_per_90: 0.50,
            dribbles_per_90: 4.1
        },
        tags: ["dribbler", "explosive", "creative"]
    }
];

// Tool 1: Get Player Data
export function get_player_data(name) {
    console.log(`[TOOL] Searching DB for: ${name}...`);
    const player = PLAYERS.find(p => p.name.toLowerCase().includes(name.toLowerCase()));

    if (!player) {
        return null;
    }

    // Return a clean formatted object
    return {
        profile: {
            name: player.name,
            club: player.club,
            age: player.age,
            value: player.market_value
        },
        performance: player.stats
    };
}

// Tool 2: Find Similar Players (Simple tag matching)
export function find_similar_players(query_tags) {
    console.log(`[TOOL] Finding players with tags: ${query_tags}...`);

    // Filter players who match at least one tag
    const matches = PLAYERS.filter(p =>
        p.tags.some(tag => query_tags.toLowerCase().includes(tag))
    );

    // Return top 3, excluding the stats to keep it concise
    return matches.slice(0, 3).map(p => ({
        name: p.name,
        club: p.club,
        match_reason: `Matches tags in: ${p.tags.join(", ")}`
    }));
}

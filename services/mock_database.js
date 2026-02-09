/**
 * Tactico AI - Synthetic Player Database
 * Simulates a premium API with advanced stats (xG, xA, Market Value).
 */

const PLAYERS = [
    // --- PREMIER LEAGUE ---
    {
        name: "Erling Haaland",
        club: "Manchester City",
        position: "Striker",
        age: 24,
        market_value: "€180m",
        contract_expires: "2027",
        nationality: "Norway",
        stats: { goals: 25, assists: 5, xg_per_90: 1.10, xa_per_90: 0.15, dribbles_per_90: 0.4 },
        tags: ["finisher", "physical", "poacher", "elite"]
    },
    {
        name: "Mohamed Salah",
        club: "Liverpool FC",
        position: "Right Winger",
        age: 32,
        market_value: "€55m",
        contract_expires: "2025",
        nationality: "Egypt",
        stats: { goals: 18, assists: 10, xg_per_90: 0.75, xa_per_90: 0.40, dribbles_per_90: 1.5 },
        tags: ["finisher", "experienced", "left-footed", "world-class"]
    },
    {
        name: "Bukayo Saka",
        club: "Arsenal",
        position: "Right Winger",
        age: 23,
        market_value: "€140m",
        contract_expires: "2027",
        nationality: "England",
        stats: { goals: 14, assists: 11, xg_per_90: 0.45, xa_per_90: 0.50, dribbles_per_90: 2.1 },
        tags: ["creative", "left-footed", "work-rate", "elite"]
    },
    {
        name: "Kevin De Bruyne",
        club: "Manchester City",
        position: "Midfielder",
        age: 33,
        market_value: "€50m",
        contract_expires: "2025",
        nationality: "Belgium",
        stats: { goals: 4, assists: 18, xg_per_90: 0.15, xa_per_90: 0.85, dribbles_per_90: 1.0 },
        tags: ["creative", "passer", "vision", "experienced"]
    },
    {
        name: "Cole Palmer",
        club: "Chelsea",
        position: "Attacking Midfielder",
        age: 22,
        market_value: "€80m",
        contract_expires: "2031",
        nationality: "England",
        stats: { goals: 22, assists: 11, xg_per_90: 0.65, xa_per_90: 0.45, dribbles_per_90: 1.8 },
        tags: ["creative", "finisher", "versatile", "wonderkid"]
    },
    {
        name: "Alejandro Garnacho",
        club: "Manchester United",
        position: "Left Winger",
        age: 20,
        market_value: "€45m",
        contract_expires: "2028",
        nationality: "Argentina",
        stats: { goals: 9, assists: 5, xg_per_90: 0.38, xa_per_90: 0.22, dribbles_per_90: 2.8 },
        tags: ["dribbler", "speed", "inverted-winger", "young"]
    },

    // --- LA LIGA ---
    {
        name: "Lamine Yamal",
        club: "FC Barcelona",
        position: "Right Winger",
        age: 17,
        market_value: "€150m",
        contract_expires: "2026",
        nationality: "Spain",
        stats: { goals: 6, assists: 8, xg_per_90: 0.35, xa_per_90: 0.45, dribbles_per_90: 3.2 },
        tags: ["wonderkid", "creative", "left-footed", "dribbler", "elite"]
    },
    {
        name: "Vinicius Jr",
        club: "Real Madrid",
        position: "Left Winger",
        age: 24,
        market_value: "€180m",
        contract_expires: "2027",
        nationality: "Brazil",
        stats: { goals: 15, assists: 12, xg_per_90: 0.60, xa_per_90: 0.50, dribbles_per_90: 4.1 },
        tags: ["dribbler", "explosive", "creative", "elite", "ballon-dor"]
    },
    {
        name: "Jude Bellingham",
        club: "Real Madrid",
        position: "Midfielder",
        age: 21,
        market_value: "€180m",
        contract_expires: "2029",
        nationality: "England",
        stats: { goals: 19, assists: 10, xg_per_90: 0.55, xa_per_90: 0.30, dribbles_per_90: 2.0 },
        tags: ["box-to-box", "clutch", "physical", "elite", "leader"]
    },
    {
        name: "Pedri",
        club: "FC Barcelona",
        position: "Midfielder",
        age: 21,
        market_value: "€80m",
        contract_expires: "2026",
        nationality: "Spain",
        stats: { goals: 4, assists: 5, xg_per_90: 0.15, xa_per_90: 0.35, dribbles_per_90: 1.2 },
        tags: ["controller", "technical", "vision", "young"]
    },
    {
        name: "Nico Williams",
        club: "Athletic Club",
        position: "Left Winger",
        age: 22,
        market_value: "€60m",
        contract_expires: "2027",
        nationality: "Spain",
        stats: { goals: 8, assists: 14, xg_per_90: 0.28, xa_per_90: 0.55, dribbles_per_90: 3.5 },
        tags: ["dribbler", "speed", "creative", "two-footed"]
    },

    // --- BUNDESLIGA ---
    {
        name: "Jamal Musiala",
        club: "Bayern Munich",
        position: "Attacking Midfielder",
        age: 21,
        market_value: "€130m",
        contract_expires: "2026",
        nationality: "Germany",
        stats: { goals: 12, assists: 8, xg_per_90: 0.45, xa_per_90: 0.35, dribbles_per_90: 3.8 },
        tags: ["dribbler", "technical", "agile", "elite"]
    },
    {
        name: "Florian Wirtz",
        club: "Bayer Leverkusen",
        position: "Attacking Midfielder",
        age: 21,
        market_value: "€130m",
        contract_expires: "2027",
        nationality: "Germany",
        stats: { goals: 11, assists: 15, xg_per_90: 0.40, xa_per_90: 0.60, dribbles_per_90: 2.5 },
        tags: ["creative", "vision", "technical", "elite"]
    },
    {
        name: "Harry Kane",
        club: "Bayern Munich",
        position: "Striker",
        age: 31,
        market_value: "€100m",
        contract_expires: "2027",
        nationality: "England",
        stats: { goals: 36, assists: 8, xg_per_90: 1.05, xa_per_90: 0.25, dribbles_per_90: 0.8 },
        tags: ["finisher", "playmaker", "clinical", "experienced"]
    },

    // --- SERIE A ---
    {
        name: "Lautaro Martinez",
        club: "Inter Milan",
        position: "Striker",
        age: 27,
        market_value: "€110m",
        contract_expires: "2026",
        nationality: "Argentina",
        stats: { goals: 24, assists: 6, xg_per_90: 0.85, xa_per_90: 0.20, dribbles_per_90: 1.2 },
        tags: ["finisher", "leader", "work-rate", "captain"]
    },
    {
        name: "Khvicha Kvaratskhelia",
        club: "Napoli",
        position: "Left Winger",
        age: 23,
        market_value: "€80m",
        contract_expires: "2027",
        nationality: "Georgia",
        stats: { goals: 11, assists: 9, xg_per_90: 0.35, xa_per_90: 0.40, dribbles_per_90: 3.1 },
        tags: ["dribbler", "creative", "unpredictable"]
    },
    {
        name: "Rafael Leao",
        club: "AC Milan",
        position: "Left Winger",
        age: 25,
        market_value: "€90m",
        contract_expires: "2028",
        nationality: "Portugal",
        stats: { goals: 9, assists: 10, xg_per_90: 0.32, xa_per_90: 0.38, dribbles_per_90: 4.5 },
        tags: ["speed", "dribbler", "strong", "counter-attack"]
    },

    // --- LIGUE 1 ---
    {
        name: "Ousmane Dembele",
        club: "PSG",
        position: "Right Winger",
        age: 27,
        market_value: "€60m",
        contract_expires: "2028",
        nationality: "France",
        stats: { goals: 6, assists: 14, xg_per_90: 0.25, xa_per_90: 0.70, dribbles_per_90: 4.2 },
        tags: ["dribbler", "creative", "two-footed", "speed"]
    },

    // --- GEMS / WONDERKIDS ---
    {
        name: "Endrick",
        club: "Real Madrid",
        position: "Striker",
        age: 18,
        market_value: "€60m",
        contract_expires: "2030",
        nationality: "Brazil",
        stats: { goals: 5, assists: 1, xg_per_90: 0.65, xa_per_90: 0.10, dribbles_per_90: 1.5 },
        tags: ["wonderkid", "powerful", "finisher", "left-footed"]
    },
    {
        name: "Arda Guler",
        club: "Real Madrid",
        position: "Attacking Midfielder",
        age: 19,
        market_value: "€45m",
        contract_expires: "2029",
        nationality: "Turkey",
        stats: { goals: 6, assists: 0, xg_per_90: 0.55, xa_per_90: 0.20, dribbles_per_90: 2.2 },
        tags: ["wonderkid", "technical", "left-footed", "creative"]
    }
];

export function searchPlayerByName(name) {
    const q = name.toLowerCase();
    // Fuzzy search: includes, or exact match on last name
    return PLAYERS.find(p =>
        p.name.toLowerCase().includes(q) ||
        p.name.toLowerCase().split(' ').pop() === q
    );
}

export function searchPlayersByTags(tagString) {
    const qTags = tagString.toLowerCase().split(',').map(t => t.trim());

    return PLAYERS.filter(p => {
        // Match if player has ANY of the requested tags
        // OR if player's position matches a tag (e.g. "striker")
        // OR if player's club matches a tag (e.g. "real madrid")

        const playerTags = [...p.tags, p.position.toLowerCase(), p.club.toLowerCase()];

        return qTags.some(qt => playerTags.some(pt => pt.includes(qt)));
    });
}

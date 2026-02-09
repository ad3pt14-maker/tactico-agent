// Built-in fetch is available in Node.js 18+

async function testEndpoints() {
    const baseUrl = 'http://127.0.0.1:3000';

    console.log("1. Testing Health...");
    try {
        const health = await fetch(`${baseUrl}/api/health`);
        console.log("Health Status:", health.status);
        console.log("Health Body:", await health.json());
    } catch (e) {
        console.error("Health Check Failed:", e.message);
    }

    console.log("\n2. Testing Player Search (Lamine Yamal)...");
    try {
        const player = await fetch(`${baseUrl}/api/player/lamine%20yamal`);
        console.log("Player Status:", player.status);
        if (player.ok) {
            console.log("Player Data:", await player.json());
        } else {
            console.log("Player Error:", await player.text());
        }
    } catch (e) {
        console.error("Player Search Failed:", e.message);
    }
}

testEndpoints();

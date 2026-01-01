import { TacticoAgent } from './agent.js';
import readline from 'readline';

const agent = new TacticoAgent();

// Method 1: CLI Argument Mode (for quick testing)
// Example: node index.js "stats for yamal"
const args = process.argv.slice(2);
if (args.length > 0) {
    const query = args.join(" ");
    (async () => {
        const response = await agent.process(query);
        console.log(response);
        process.exit(0);
    })();
} else {
    // Method 2: Interactive Mode
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("⚽ TACTICO V1.0 INITIALIZED. Ask me about players...");
    console.log("Type 'exit' to quit.\n");

    const ask = () => {
        rl.question('user> ', async (query) => {
            if (query.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            const response = await agent.process(query);
            console.log(response);
            ask();
        });
    };

    ask();
}

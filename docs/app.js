// Simulate live data updates to show "performance insight" capabilities

const totalMatchesElement = document.getElementById('total-matches');
const currentMatchElement = document.getElementById('current-match');

let totalMatches = 12450;
const potentialMatches = [
    "Man City vs Liverpool (2024-02-04)",
    "Real Madrid vs Barcelona (2023-10-28)",
    "Bayern vs Dortmund (2023-11-04)",
    "Inter vs Milan (2023-09-16)",
    "Chelsea vs Arsenal (2023-10-21)",
    "PSG vs Marseille (2023-09-24)"
];

function simulateEngine() {
    // 1. Simulate finding a new match
    const randomMatch = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];
    currentMatchElement.innerText = `Analyzing: ${randomMatch}...`;

    // 2. Simulate processing completion after a short delay
    setTimeout(() => {
        totalMatches++;
        totalMatchesElement.innerText = totalMatches.toLocaleString();

        // Flash effect
        totalMatchesElement.style.color = '#fff';
        setTimeout(() => totalMatchesElement.style.color = '', 300);

    }, 1500); // Process finishes 1.5s after starting
}

// Run every 4 seconds
setInterval(simulateEngine, 4000);

console.log("Tactico AI Engine: Enhanced Mode Online");

/* --- Chat Demo Logic --- */
const inputField = document.getElementById('agent-input');
const outputDiv = document.getElementById('chat-output');
const sendBtn = document.getElementById('send-btn');

function handleSend() {
    const query = inputField.value;
    if (!query) return;

    // 1. Display User Message
    addMessage(query, 'user');
    inputField.value = '';

    // 2. Simulate Processing Delay (Thinking...)
    setTimeout(() => {
        processDemoQuery(query);
    }, 800);
}

// Quick Prompt Handler (called from HTML onclick)
function sendQuick(text) {
    inputField.value = text;
    handleSend();
}

inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
sendBtn.addEventListener('click', handleSend);

function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);

    // Create inner bubble
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    // Allow HTML for bolding stats
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    msgDiv.appendChild(bubble);
    outputDiv.appendChild(msgDiv);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Initialize the Agent
const agent = new TacticoAgent();

async function processDemoQuery(input) {
    // Use the optimized Agent Class logic
    const response = await agent.process(input);

    // The agent now returns formatted HTML, so we pass 'agent' type to style it
    addMessage(response, 'agent');
}

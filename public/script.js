const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// This connects to your server.js /api/gemini endpoint
async function callAI(prompt, sysInstruct, base64Image = null) {
    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, sysInstruct, base64Image })
        });
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error:", error);
        return "Connection error. Make sure Render is 'Live'.";
    }
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    const loadingId = 'loading-' + Date.now();
    appendMessage('ai', 'Thinking...', loadingId);

    const systemPrompt = "You are KX7-STUDY, an expert SSC Physics tutor.";
    const aiResponse = await callAI(text, systemPrompt);

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.innerText = aiResponse;
}

function appendMessage(sender, text, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `p-3 rounded-lg mb-2 max-w-[80%] ${sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

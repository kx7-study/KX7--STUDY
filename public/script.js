/**
 * KX7-STUDY | SSC Physics AI Assistant
 * This file handles the frontend chat logic and communicates with the server.js backend.
 */

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

/**
 * Communicates with the Backend Server (server.js)
 * @param {string} prompt - The user's question
 * @param {string} sysInstruct - Instructions for the AI's personality
 * @param {string|null} base64Image - Optional image data
 */
async function callAI(prompt, sysInstruct, base64Image = null) {
    try {
        // We call our OWN server endpoint defined in server.js
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ prompt, sysInstruct, base64Image })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error connecting to backend:", error);
        return "⚠️ Connection error. Please ensure your Render server is 'Live' and the GEMINI_KEY is set correctly.";
    }
}

/**
 * Handles sending the message and updating the UI
 */
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Display User Message in UI
    appendMessage('user', text);
    userInput.value = '';

    // 2. Display "Thinking..." placeholder for AI response
    const loadingId = 'loading-' + Date.now();
    appendMessage('ai', 'Thinking...', loadingId);

    // 3. Define the AI's personality (System Instruction)
    const systemPrompt = "You are KX7-STUDY, an expert SSC Physics tutor for Bangladeshi students. Explain concepts in simple English or Bengali. Use LaTeX for math formulas. Be encouraging and accurate.";

    // 4. Get response from our server
    const aiResponse = await callAI(text, systemPrompt);

    // 5. Replace the "Thinking..." text with the actual AI response
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.innerText = aiResponse;
    }
}

/**
 * Adds a message bubble to the chat container
 */
function appendMessage(sender, text, id = null) {
    const msgDiv = document.createElement('div');
    
    // Modern Tailwind styling for message bubbles
    const baseClasses = "p-3 rounded-lg mb-2 max-w-[85%] shadow-sm transition-all";
    const senderClasses = sender === 'user' 
        ? "bg-blue-600 text-white ml-auto rounded-br-none" 
        : "bg-white text-gray-800 mr-auto border border-gray-200 rounded-bl-none";
    
    msgDiv.className = `${baseClasses} ${senderClasses}`;
    if (id) msgDiv.id = id;
    
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Event Listeners
 */
// Listen for 'Enter' key press
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus input on load
window.onload = () => {
    userInput.focus();
};

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
        return "Connection error.";
    }
}

// Add your existing sendChatMessage and button functions here, 
// just make sure they use the callAI function above!

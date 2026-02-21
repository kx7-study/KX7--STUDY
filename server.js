const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini with your Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt, sysInstruct } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: sysInstruct 
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "AI failed to respond. Check API Key." });
    }
});

// Serve the index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KX7-STUDY Server live on port ${PORT}`);
});

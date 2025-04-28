import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.REACT_APP_API_KEY;

const SYSTEM_PROMPT = {
  en: `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make using **only those ingredients**. However, you may **optionally include common spices, seasonings, and pantry staples** (such as salt, pepper, olive oil, garlic, etc.) if necessary to enhance the flavor, but **do not include any other ingredients** that were not provided. The recipe should be formatted clearly with **step-by-step instructions** and written in markdown to make it easier to render to a web page. Be creative with your use of the ingredients provided while maintaining a focus on what the user has available.`,
  // You can add other languages here if needed (e.g., es, fr, de, zh)
};

app.use(cors());
app.use(express.json());

// Handle POST request for recipe suggestions
app.post('/api/chat', async (req, res) => {
    const { ingredients, language = 'en' } = req.body || {};
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    const ingredientsString = ingredients.join(', ');

    console.log("Request received with ingredients:", ingredients);
    console.log("Selected language:", language);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",  // Make sure this matches your local app URL
                "X-Title": "ChefApp"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout:free",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT[language] || SYSTEM_PROMPT.en },
                    { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
                ],
                max_tokens: 1024,
            })
        });

        const data = await response.json();
        console.log("OpenRouter response:", data);

        const recipe = data.choices?.[0]?.message?.content;

        res.status(200).json({ recipe });
    } catch (err) {
        console.error("Backend server error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Make sure the server listens on the correct port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

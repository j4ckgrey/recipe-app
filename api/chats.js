import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config();

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make using **only those ingredients**. However, you may **optionally include common spices, seasonings, and pantry staples** (such as salt, pepper, olive oil, garlic, etc.) if necessary to enhance the flavor, but **do not include any other ingredients** that were not provided. The recipe should be formatted clearly with **step-by-step instructions** and written in markdown to make it easier to render to a web page. Be creative with your use of the ingredients provided while maintaining a focus on what the user has available.`;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'POST') {
        const ingredientsArr = req.body.ingredients || []
        const ingredientsString = ingredientsArr.join(', ')

        const API_KEY = process.env.REACT_APP_API_KEY

        console.log("Request received with ingredients:", ingredientsArr)

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://leftovers-recipe-app.vercel.app", // Update this to match your deployed app URL
                    "X-Title": "ChefApp"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout:free",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
                    ],
                    max_tokens: 1024,
                })
            })

            const data = await response.json()
            console.log("OpenRouter response:", data)

            const recipe = data.choices?.[0]?.message?.content

            return res.status(200).json({ recipe });
        } catch (err) {
            console.error("Error while processing API request:", err)
            return res.status(500).json({ error: 'Server error' })
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }
}

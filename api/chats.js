import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients and suggests a recipe using **only those ingredients**. 
You may optionally include common spices/staples (salt, pepper, oil, etc.) if needed. 
Respond in the same language as the user's request. Format the recipe clearly in markdown with step-by-step instructions.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'POST') {
    const { ingredients, language = 'en' } = req.body
    const ingredientsString = ingredients.join(', ')

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://leftovers-app.vercel.app",
          "X-Title": "ChefApp"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { 
              role: "user", 
              content: `I have these ingredients: ${ingredientsString}. 
              Suggest a recipe I can make (respond in ${language}).` 
            },
          ],
          max_tokens: 1024,
        })
      })

      const data = await response.json()
      const recipe = data.choices?.[0]?.message?.content
      return res.status(200).json({ recipe })

    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Server error' })
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
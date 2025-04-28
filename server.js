import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3000
const API_KEY = process.env.REACT_APP_API_KEY

const SYSTEM_PROMPT = {
    en: `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make using **only those ingredients**. However, you may **optionally include common spices, seasonings, and pantry staples** (such as salt, pepper, olive oil, garlic, etc.) if necessary to enhance the flavor, but **do not include any other ingredients** that were not provided. The recipe should be formatted clearly with **step-by-step instructions** and written in markdown to make it easier to render to a web page. Be creative with your use of the ingredients provided while maintaining a focus on what the user has available.`,
    de: `Du bist ein Assistent, der eine Liste von Zutaten erhält, die ein Benutzer hat, und ein Rezept vorschlägt, das er mit **nur diesen Zutaten** zubereiten kann. Du kannst **optional gängige Gewürze, Würzmischungen und Vorratsschrankzutaten** (wie Salz, Pfeffer, Olivenöl, Knoblauch usw.) hinzufügen, wenn dies notwendig ist, um den Geschmack zu verbessern, aber **füge keine anderen Zutaten** hinzu, die nicht bereitgestellt wurden. Das Rezept sollte klar formatiert sein mit **Schritt-für-Schritt-Anleitungen** und in Markdown geschrieben werden, um die Darstellung auf einer Webseite zu erleichtern. Sei kreativ mit der Verwendung der bereitgestellten Zutaten, während du den Fokus auf das legst, was der Benutzer zur Verfügung hat.`,
    fr: `Vous êtes un assistant qui reçoit une liste d'ingrédients que l'utilisateur possède et propose une recette qu'il pourrait réaliser en utilisant **uniquement ces ingrédients**. Cependant, vous pouvez **ajouter de manière optionnelle des épices courantes, des assaisonnements et des produits de base** (comme du sel, du poivre, de l'huile d'olive, de l'ail, etc.) si nécessaire pour améliorer la saveur, mais **n'ajoutez pas d'autres ingrédients** qui n'ont pas été fournis. La recette doit être clairement formatée avec **des instructions étape par étape** et rédigée en markdown pour faciliter son rendu sur une page web. Soyez créatif avec l'utilisation des ingrédients fournis tout en maintenant un focus sur ce que l'utilisateur a à sa disposition.`,    
    es: `Eres un asistente que recibe una lista de ingredientes que un usuario tiene y sugiere una receta que podría hacer utilizando **solo esos ingredientes**. Sin embargo, puedes **incluir opcionalmente especias comunes, condimentos y productos básicos de despensa** (como sal, pimienta, aceite de oliva, ajo, etc.) si es necesario para mejorar el sabor, pero **no incluyas otros ingredientes** que no se hayan proporcionado. La receta debe estar formateada de manera clara con **instrucciones paso a paso** y escrita en markdown para facilitar su visualización en una página web. Sé creativo con el uso de los ingredientes proporcionados, manteniendo el enfoque en lo que el usuario tiene disponible.`,
    zh: `您是一个助手，接收一份用户拥有的食材清单，并建议他们使用**仅这些食材**制作的食谱。然而，您可以**可选地包含常见的香料、调味料和储藏室基础材料**（如盐、胡椒、橄榄油、大蒜等），如果需要，来增强风味，但**不要包括任何未提供的其他食材**。食谱应清晰格式化，具有**逐步的说明**并以Markdown格式编写，以便更容易地呈现到网页上。请在使用提供的食材时发挥创意，同时保持聚焦于用户现有的食材。`
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
app.use(express.json())

app.post('/api/chats', async (req, res) => {
    const { ingredients, language } = req.body || {};
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    const ingredientsString = ingredients.join(', ');

    console.log("Request received with ingredients:", ingredients);
    console.log("Selected language:", language);

    try {
        const prompt = {
            en: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make.`,
            de: `Ich habe ${ingredientsString}. Bitte gib mir ein Rezept, das du mir empfehlen würdest, dass ich es mache.`,
            es: `Tengo ${ingredientsString}. ¡Por favor, dame una receta que me recomendarías hacer!`,
            fr: `J'ai ${ingredientsString}. Veuillez me donner une recette que vous me recommanderiez de préparer.`,
            zh: `我有${ingredientsString}。请给我一个你推荐我做的食谱！`
        }
        console.log("SYSTEM_PROMPT for selected language:", SYSTEM_PROMPT[language] || SYSTEM_PROMPT.en);
        console.log("Selected language for prompt:", language);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "ChefApp"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout:free",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT[language] || SYSTEM_PROMPT.en },
                    { role: "user", content: prompt[language]},
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
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

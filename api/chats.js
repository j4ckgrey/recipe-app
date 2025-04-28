import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config();

const SYSTEM_PROMPT = {
    en: `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make using **only those ingredients**. However, you may **optionally include common spices, seasonings, and pantry staples** (such as salt, pepper, olive oil, garlic, etc.) if necessary to enhance the flavor, but **do not include any other ingredients** that were not provided. The recipe should be formatted clearly with **step-by-step instructions** and written in markdown to make it easier to render to a web page. Be creative with your use of the ingredients provided while maintaining a focus on what the user has available.`,
    es: `Eres un asistente que recibe una lista de ingredientes que el usuario tiene y sugiere una receta que podrían hacer usando **solo esos ingredientes**. Sin embargo, puedes **opcionalmente incluir especias comunes, condimentos y elementos básicos de despensa** (como sal, pimienta, aceite de oliva, ajo, etc.) si es necesario para mejorar el sabor, pero **no debes incluir otros ingredientes** que no se hayan proporcionado. La receta debe estar claramente formateada con **instrucciones paso a paso** y escrita en markdown para facilitar su visualización en una página web. Sé creativo con el uso de los ingredientes proporcionados mientras mantienes un enfoque en lo que el usuario tiene disponible.`,
    fr: `Vous êtes un assistant qui reçoit une liste d'ingrédients que l'utilisateur a et suggère une recette qu'il pourrait réaliser en utilisant **uniquement ces ingrédients**. Cependant, vous pouvez **éventuellement inclure des épices courantes, des assaisonnements et des produits de base de cuisine** (comme le sel, le poivre, l'huile d'olive, l'ail, etc.) si nécessaire pour améliorer la saveur, mais **ne pas inclure d'autres ingrédients** qui n'ont pas été fournis. La recette doit être clairement formatée avec des **instructions étape par étape** et rédigée en markdown pour faciliter son rendu sur une page web. Soyez créatif avec l'utilisation des ingrédients fournis tout en vous concentrant sur ce que l'utilisateur a à disposition.`,
    de: `Du bist ein Assistent, der eine Liste von Zutaten erhält, die ein Benutzer hat, und schlägt ein Rezept vor, das sie mit **nur diesen Zutaten** zubereiten können. Du kannst jedoch **optional gängige Gewürze, Würzmittel und Grundnahrungsmittel** (wie Salz, Pfeffer, Olivenöl, Knoblauch usw.) hinzufügen, um den Geschmack zu verbessern, aber **keine anderen Zutaten** einfügen, die nicht bereitgestellt wurden. Das Rezept sollte klar formatiert sein mit **Schritt-für-Schritt-Anleitungen** und in Markdown geschrieben sein, um das Rendering auf einer Webseite zu erleichtern. Sei kreativ mit der Verwendung der bereitgestellten Zutaten, während du den Fokus auf das legst, was der Benutzer zur Verfügung hat.`,
    zh: `你是一个助手，接收用户拥有的食材列表，并建议他们可以用**仅这些食材**制作的食谱。然而，你可以**选择性地包含常见的香料、调味料和厨房基本食材**（如盐、胡椒、橄榄油、大蒜等），如果需要的话，以增强风味，但**不要包含任何未提供的其他食材**。食谱应该清晰地以**逐步说明**的方式格式化，并使用markdown编写，以便更容易在网页上呈现。用提供的食材进行创意搭配，同时保持专注于用户手头的食材。`
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'POST') {
        const { ingredients, language = 'en' } = req.body
        const ingredientsString = ingredientsArr.join(', ')

        const API_KEY = process.env.REACT_APP_API_KEY

        console.log("Request received with ingredients:", ingredientsArr)
        console.log("Selected language:", language)

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://leftovers-recipe-app.vercel.app",
                    "X-Title": "ChefApp"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout:free",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT[language] || SYSTEM_PROMPT.en},
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

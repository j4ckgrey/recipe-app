const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

export async function getRecipeFromLlama(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:5173",
                "Content-Type": "application/json",
                "X-Title": "ChefApp"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout:free",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: [{"type": "text", "text": `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`}]},
                ],
                max_tokens: 1024,
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        try {
            const data = JSON.parse(responseText);
            if (!response.ok) {
                throw new Error(`API error: ${data.message || response.status}`);
            }
            return data.choices[0].message.content;
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            throw new Error(`Invalid response format: ${responseText.substring(0, 100)}`);
        }
    } catch (err) {
        console.error("API call failed:", err);
        throw err;
    }
}
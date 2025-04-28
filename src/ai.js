const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://leftovers-app.vercel.app/api/chats' 
    : 'http://localhost:3000/api/chats';

export async function getRecipeFromLlama(ingredientsArr, language) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ingredients: ingredientsArr,
                language: language
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        return data.recipe
    } catch (err) {
        console.error("API call failed:", err)
        throw err
    }
}

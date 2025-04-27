const API_URL = '/api/chat'
export async function getRecipeFromLlama(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ingredients: ingredientsArr
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

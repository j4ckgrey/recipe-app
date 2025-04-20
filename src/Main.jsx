//import 'dotenv/config'
import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromLlama } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromLlama(ingredients)
        setRecipe(recipeMarkdown)
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    function resetPage() {
        setIngredients([])
        setRecipe("")
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            
                {!recipe && <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />}
            

            {recipe && <ClaudeRecipe recipe={recipe} />}
            {recipe && <button className="get-recipe-container button" onClick={resetPage}>New Recipe</button>}
        </main>
    )
}
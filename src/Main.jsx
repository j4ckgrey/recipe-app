import './i18n'
import { useTranslation } from "react-i18next"
import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromLlama } from "./ai"

export default function Main(props) {
    const { t } = useTranslation()

    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromLlama(ingredients, props.language)
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
            {!recipe && <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder={t("placeholder_add_ingredient")}
                    aria-label={t("aria_add_ingredient")}
                    name="ingredient"
                />
                <button>{t("button_add_ingredient")}</button>
            </form>}

            
                {!recipe && <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />}
            {recipe &&
                <>
                    <ClaudeRecipe recipe={recipe} />
                    <button className="new-recipe" onClick={resetPage}>{t("button_new_recipe")}</button>
                </>
            }
        </main>
    )
}
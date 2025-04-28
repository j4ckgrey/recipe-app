import { useTranslation } from "react-i18next"
export default function IngredientsList(props) {
    const { t } = useTranslation()
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))
    return (
        <section>
            {props.ingredients.length > 0 && <h2>{t("ingredients_on_hand")}</h2>}
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {props.ingredients.length > 3 ? <div className="get-recipe-container">
                <div>
                    <h3>{t("ready_for_recipe")}</h3>
                    <p>{t("generate_recipe")}</p>
                </div>
                <button onClick={props.getRecipe}>{t("get_recipe")}</button>
            </div>
            : <div className="get-recipe-container"><h3>{t("enter_4_ingredients")}</h3></div>}
        </section>
    )
}
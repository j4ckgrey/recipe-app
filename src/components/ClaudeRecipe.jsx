import ReactMarkdown from "react-markdown"
import { useTranslation } from "react-i18next"

export default function ClaudeRecipe(props) {
    const { t } = useTranslation();
    return (
        <>
            <section className="suggested-recipe-container" aria-live="polite">
                <h2>{t("chef_recommends")}</h2>
                <ReactMarkdown>{props.recipe}</ReactMarkdown>
            </section>
        </>
    )
}
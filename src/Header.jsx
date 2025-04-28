import chefClaudeLogo from "./images/chef-claude-icon.png"
import { useTranslation } from "react-i18next"

export default function Header(props) {
    const { t } = useTranslation();

    return (
        <header>
            <div className="header-center">
                <img src={chefClaudeLogo}/>
                <h1>{t("jack_leftovers_chef")}</h1>
            </div>
            <select className="language-select" value={props.selectedLanguage} onChange={(e) => props.handleLanguageChange(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
            </select>
        </header>
    )
}
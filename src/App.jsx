import Header from "./Header"
import Main from "./Main"
import React from "react"
import { useTranslation } from "react-i18next"

export default function App() {
  const [language, setLanguage] = React.useState("en")
  const { i18n } = useTranslation()
  
  function handleLanguageChange(selectedLanguage) {
    console.log("Selected language:", selectedLanguage)
    setLanguage(selectedLanguage)
    i18n.changeLanguage(selectedLanguage)
  }
  return (
    <>
      <Header selectedLanguage={language} handleLanguageChange={handleLanguageChange} />
      <Main language={language} />
    </>
  )
}

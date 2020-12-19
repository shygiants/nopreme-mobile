import React, { createContext } from "react";

import kr from "../assets/kr.json";
import jp from "../assets/jp.json";
import en from "../assets/en.json";

export const LanguageContext = createContext({
  language: "ko-kr",
  dictionary: kr,
});

export function LanguageProvider({ children }) {
  const language = navigator.language || navigator.userLanguage || "ko-kr";

  const dictionary = (() => {
    if (language === "ko-kr") return kr;
    else if (["en-US", "en"].includes(language)) return en;
    else if (language === "ja") return jp;
    else return kr;
  })();

  return (
    <LanguageContext.Provider value={{ language, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

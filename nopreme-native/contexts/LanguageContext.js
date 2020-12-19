import React, { createContext } from "react";
import * as Localization from "expo-localization";

import kr from "../assets/lang/kr.json";
// import jp from "../assets/lang/jp.json";
// import en from "../assets/lang/en.json";

export const LanguageContext = createContext({
  language: "ko-KR",
  dictionary: kr,
});

export function LanguageProvider({ children }) {
  const language = Localization.locale;

  const dictionary = (() => {
    if (language === "ko-KR") return kr;
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

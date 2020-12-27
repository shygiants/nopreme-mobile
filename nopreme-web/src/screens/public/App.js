import React from "react";

import { LanguageProvider } from "../../contexts/LanguageContext";

export default function App({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

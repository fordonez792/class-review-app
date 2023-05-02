import React, { useState, useContext, useEffect } from "react";

export const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English | 英文"
  );

  const chooseLanguage = (e) => {
    localStorage.setItem("language", e.target.textContent.split(" ")[0]);
    window.location.reload();
  };

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      setLanguage("English | 英文");
      localStorage.setItem("language", "English");
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        chooseLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  return useContext(LanguageContext);
};

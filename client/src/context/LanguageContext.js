import React, { useState, useContext, useEffect } from "react";

export const LanguageContext = React.createContext();

// Controls the language displayed for the whole website, can only be changed by choosing a different language on the footer of the webiste
// Language state used in all pages to determine which language to be displayed

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const chooseLanguage = (e) => {
    localStorage.setItem("language", e.target.textContent.split(" ")[0]);
    window.location.reload();
  };

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      setLanguage("English");
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

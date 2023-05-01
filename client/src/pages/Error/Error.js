import React from "react";
import { useNavigate } from "react-router-dom";

import { errorTranslations } from "./errorTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

const Error = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();

  return (
    <section id="error">
      <div className="container">
        <article className="header">
          <h1>
            {language === "English"
              ? errorTranslations[0].english
              : language === "Chinese" && errorTranslations[0].chinese}
          </h1>
          <h1>
            {language === "English"
              ? errorTranslations[1].english
              : language === "Chinese" && errorTranslations[1].chinese}
          </h1>
        </article>
        <p>
          {language === "English"
            ? errorTranslations[2].english
            : language === "Chinese" && errorTranslations[2].chinese}
        </p>
        <button onClick={() => navigate("/")}>
          {language === "English"
            ? errorTranslations[3].english
            : language === "Chinese" && errorTranslations[3].chinese}
        </button>
      </div>
    </section>
  );
};

export default Error;

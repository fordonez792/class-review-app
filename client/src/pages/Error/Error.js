import React from "react";
import { useNavigate } from "react-router-dom";

import { errorTranslations } from "./errorTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

// This is the error page, if users try to access a route that does not exist users will be redirected to this page, where they can click the button to go back to the home page

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

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiLanguage } from "react-icons/hi2";
import { FaChevronDown } from "react-icons/fa";

import logo from "../assets/logo.png";
import { footerTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";

// Footer of the page that includes the option to change language of the whole website to english or chinese

const Footer = () => {
  const { language, chooseLanguage } = useLanguageContext();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Opens the dropdown when clicking on the input
  const openDropdown = (e) => {
    if (!e.target.id === "language" && !e.target.classList.contains("icon"))
      return;
    dropdownRef.current.classList.toggle("active");
  };

  // closes the dropdown when clicked anywhere other than dropdown or input
  const closeDropdown = (e) => {
    if (
      e.target.id === "language" ||
      e.target.classList.contains("option") ||
      e.target.classList.contains("icon")
    )
      return;
    dropdownRef.current.classList.remove("active");
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <section id="footer">
      <div className="container">
        <footer>
          <article className="logo">
            <img src={logo} alt="Logo" />
          </article>
          <article className="language">
            <div className="field-container" onClick={(e) => openDropdown(e)}>
              <label htmlFor="review-year">
                <HiLanguage />
              </label>
              <input
                type="text"
                placeholder={
                  language === "English"
                    ? footerTranslations[0].english
                    : language === "Chinese" && footerTranslations[0].chinese
                }
                className="input-field"
                value={language}
                id="language"
                autoComplete="off"
                readOnly={true}
              />
              <ul className="dropdown-menu" ref={dropdownRef}>
                <li
                  className="dropdown-option"
                  onClick={(e) => chooseLanguage(e)}
                >
                  {language === "English"
                    ? "Chinese | 中文"
                    : language === "Chinese" && "English | 英文"}
                </li>
              </ul>
              <div className="icon">
                <FaChevronDown />
              </div>
            </div>
            <p className="paragraph">
              {language === "English"
                ? footerTranslations[1].english
                : language === "Chinese" && footerTranslations[1].chinese}
            </p>
            <a
              className="paragraph"
              href="https://forms.gle/LcYrHyVzKxZ1bc6RA"
              target="_blank"
            >
              {language === "English"
                ? footerTranslations[2].english
                : language === "Chinese" && footerTranslations[2].chinese}
            </a>
            <p>© NDHU Reviews {new Date().getFullYear()}</p>
          </article>
        </footer>
      </div>
    </section>
  );
};

export default Footer;

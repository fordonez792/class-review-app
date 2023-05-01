import React, { useState, useEffect } from "react";
import { FaTimes, FaStar } from "react-icons/fa";

import {
  difficultyDescription,
  engagingDescription,
  effectivenessDescription,
  fairAssessmentsDescription,
  recommendDescription,
} from "../../assets/criteria";
import { criteriaModalTranslations } from "./writeReviewTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

const CriteriaModal = ({ isModalOpen, setIsModalOpen, name, setName }) => {
  const { language } = useLanguageContext();
  const [array, setArray] = useState();

  const closeModal = (e) => {
    setName("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (name.toLowerCase() === "difficulty" || name === "難度")
      setArray(difficultyDescription);
    if (name.toLowerCase() === "engaging" || name === "互動性")
      setArray(engagingDescription);
    if (name.toLowerCase() === "effectiveness" || name === "效率")
      setArray(effectivenessDescription);
    if (name.toLowerCase() === "fair assessments" || name === "同等對待")
      setArray(fairAssessmentsDescription);
    if (name.toLowerCase() === "recommend" || name === "推薦")
      setArray(recommendDescription);
  }, [name]);

  return (
    <>
      <section id="criteria-modal" className={isModalOpen ? "active" : null}>
        <div className="container">
          <article className="close-btn" onClick={(e) => closeModal(e)}>
            <FaTimes />
          </article>
          <article className="header">
            <h1>{name}</h1>
          </article>
          <article className="description">
            <h1>
              {language === "English"
                ? criteriaModalTranslations[0].english
                : language === "Chinese" &&
                  criteriaModalTranslations[0].chinese}
            </h1>
            <p>
              {language === "English"
                ? array?.definition
                : language === "Chinese" && array?.definitionChinese}
            </p>
            <h1 className="criteria">
              {language === "English"
                ? criteriaModalTranslations[1].english
                : language === "Chinese" &&
                  criteriaModalTranslations[1].chinese}
            </h1>
            {language === "English"
              ? array?.criteria.map((item, index) => {
                  return (
                    <p key={index}>
                      <span>
                        {index + 1}
                        <FaStar />
                      </span>
                      <span>{item}</span>
                    </p>
                  );
                })
              : array?.criteriaChinese.map((item, index) => {
                  return (
                    <p key={index}>
                      <span>
                        {index + 1}
                        <FaStar />
                      </span>
                      <span>{item}</span>
                    </p>
                  );
                })}
          </article>
        </div>
        <div className="overlay" onClick={(e) => closeModal(e)}></div>
      </section>
    </>
  );
};

export default CriteriaModal;

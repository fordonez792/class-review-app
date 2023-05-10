import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

import { useLanguageContext } from "../context/LanguageContext";
import { confirmDeleteTranslations } from "../assets/componentsTranslations";

const ConfirmDeleteModal = ({
  isConfirmDeleteOpen,
  setIsConfirmDeleteOpen,
  mutate,
  id,
  courseId,
}) => {
  const { language } = useLanguageContext();

  const deleteReview = () => {
    mutate({ id, courseId });
    setIsConfirmDeleteOpen(false);
  };

  return (
    <section
      id="confirm-delete-modal"
      className={isConfirmDeleteOpen ? "active" : null}
    >
      <div className="container">
        <article
          className="close-btn"
          onClick={() => setIsConfirmDeleteOpen(false)}
        >
          <FaTimes />
        </article>
        <article className="icon">
          <FaExclamationTriangle />
        </article>
        <article className="header">
          <h1>
            {language === "English"
              ? confirmDeleteTranslations[0].english
              : language === "Chinese" && confirmDeleteTranslations[0].chinese}
          </h1>
        </article>
        <p>
          {language === "English"
            ? confirmDeleteTranslations[1].english
            : language === "Chinese" && confirmDeleteTranslations[1].chinese}
        </p>
        <article className="btn-container">
          <button onClick={() => setIsConfirmDeleteOpen(false)}>
            {language === "English"
              ? confirmDeleteTranslations[2].english
              : language === "Chinese" && confirmDeleteTranslations[2].chinese}
          </button>
          <button onClick={() => deleteReview()}>
            {language === "English"
              ? confirmDeleteTranslations[3].english
              : language === "Chinese" && confirmDeleteTranslations[3].chinese}
          </button>
        </article>
      </div>
      <div
        className="overlay"
        onClick={() => setIsConfirmDeleteOpen(false)}
      ></div>
    </section>
  );
};

export default ConfirmDeleteModal;

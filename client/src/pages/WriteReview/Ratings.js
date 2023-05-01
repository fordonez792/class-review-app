import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaInfoCircle } from "react-icons/fa";

import { criteria } from "../../assets/criteria";
import { useLanguageContext } from "../../context/LanguageContext";

import CriteriaModal from "./CriteriaModal";

const Ratings = ({ ratings, setRatings }) => {
  const { language } = useLanguageContext();
  const criteriaRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handleChange = (e) => {
    const { parentElement } = e.target.parentElement;
    if (!criteria.find((e) => e.english === parentElement.id)) return;

    // Updates the state for each rating selection
    const nextState = ratings.map((rating) => {
      if (rating.name.english === parentElement.id)
        return { ...rating, selection: parseInt(e.target.value) };
      return rating;
    });
    setRatings(nextState);
  };

  const openModal = (criterion) => {
    if (language === "English") setName(criterion.english);
    if (language === "Chinese") setName(criterion.chinese);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // on mount the previous ratings inputted will be preserved and shown
    Array.from(criteriaRef.current.children).forEach((child, index) => {
      if (child.id === ratings[index].name) {
        const stars = child.children[1];
        // const p = child.lastChild;
        Array.from(stars.children).forEach((star) => {
          if (
            star.id ===
            `${ratings[index].name}-star-${ratings[index].selection}`
          ) {
            star.checked = true;
          }
        });
      }
    });
  }, []);

  return (
    <>
      <article className="criteria" ref={criteriaRef}>
        {criteria.map((criterion, index) => {
          return (
            <div id={criterion.english} key={index} className="single-criteria">
              <div className="header">
                <h1>
                  {language === "English"
                    ? criterion.english
                    : language === "Chinese" && criterion.chinese}
                </h1>
                <FaInfoCircle onClick={() => openModal(criterion)} />
              </div>
              <div className="stars" onChange={(e) => handleChange(e)}>
                <input
                  type="radio"
                  name={criterion.english}
                  value="5"
                  id={`${criterion.english}-star-5`}
                />
                <label htmlFor={`${criterion.english}-star-5`}>
                  <FaStar />
                </label>
                <input
                  type="radio"
                  name={criterion.english}
                  value="4"
                  id={`${criterion.english}-star-4`}
                />
                <label htmlFor={`${criterion.english}-star-4`}>
                  <FaStar />
                </label>
                <input
                  type="radio"
                  name={criterion.english}
                  value="3"
                  id={`${criterion.english}-star-3`}
                />
                <label htmlFor={`${criterion.english}-star-3`}>
                  <FaStar />
                </label>
                <input
                  type="radio"
                  name={criterion.english}
                  value="2"
                  id={`${criterion.english}-star-2`}
                />
                <label htmlFor={`${criterion.english}-star-2`}>
                  <FaStar />
                </label>
                <input
                  type="radio"
                  name={criterion.english}
                  value="1"
                  id={`${criterion.english}-star-1`}
                />
                <label htmlFor={`${criterion.english}-star-1`}>
                  <FaStar />
                </label>
              </div>
            </div>
          );
        })}
      </article>
      <CriteriaModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        name={name}
        setName={setName}
      />
    </>
  );
};

export default Ratings;

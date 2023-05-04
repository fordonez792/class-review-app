import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaStarHalf, FaPlus, FaMinus } from "react-icons/fa";

import { ratingsSectionTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";
import {
  difficultyDescription,
  engagingDescription,
  effectivenessDescription,
  fairAssessmentsDescription,
} from "../../assets/criteria";

// This is the ratings section of the course specific page
// Displays the overall rating of the course measured specifically by the average recommend ratings given by users
// It as well displays the average rating for the other criteria including difficulty, engaging, effectiveness, and fair assessments
// Moreover if the user is in desktop they can see the definition of the criteria by hovering over it
// Users can also minimize this section on mobile or tablet

const RatingsSection = ({
  overallDifficulty,
  overallEffectiveness,
  overallEngaging,
  overallFairAssessments,
  overallRecommend,
  numberOfReviews,
}) => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const ratingsRef = useRef();
  const criteriaRef = useRef();
  const [isRatingsOpen, setIsRatingsOpen] = useState(true);

  // Hanlde the open and closing of the Reviews and Course Info sections
  const openClose = (e) => {
    if (e.target.parentElement.classList.contains("ratings")) {
      setIsRatingsOpen(!isRatingsOpen);
    }
  };

  // If user is on desktop then user can see the definition of each criteria by hovering on it
  const displayDefinition = (e) => {
    if (!isDesktop) return;
    const definition = criteriaRef.current.children[4];
    if (e.target.classList.contains("difficulty")) {
      if (language === "English") {
        definition.textContent = difficultyDescription.definition;
      } else if (language === "Chinese") {
        definition.textContent = difficultyDescription.definitionChinese;
      }
      definition.classList.add("difficulty");
    }
    if (e.target.classList.contains("engaging")) {
      if (language === "English") {
        definition.textContent = engagingDescription.definition;
      } else if (language === "Chinese") {
        definition.textContent = engagingDescription.definitionChinese;
      }
      definition.classList.add("engaging");
    }
    if (e.target.classList.contains("effectiveness")) {
      if (language === "English") {
        definition.textContent = effectivenessDescription.definition;
      } else if (language === "Chinese") {
        definition.textContent = effectivenessDescription.definitionChinese;
      }
      definition.classList.add("effectiveness");
    }
    if (e.target.classList.contains("fair-assessments")) {
      if (language === "English") {
        definition.textContent = fairAssessmentsDescription.definition;
      } else if (language === "Chinese") {
        definition.textContent = fairAssessmentsDescription.definitionChinese;
      }
      definition.classList.add("fair-assessments");
    }
  };

  // Once user hovers outside criteria just close it
  const resetDefinition = () => {
    if (!isDesktop) return;
    const definition = criteriaRef.current.children[4];
    definition.textContent = "";
    definition.classList.remove("difficulty");
    definition.classList.remove("engaging");
    definition.classList.remove("effectiveness");
    definition.classList.remove("fair-assessments");
  };

  // Applies css animation for Ratings section
  useEffect(() => {
    if (!ratingsRef.current) return;
    if (isRatingsOpen) {
      ratingsRef.current.style.maxHeight = "1000px";
    } else {
      ratingsRef.current.style.maxHeight = "0px";
    }
  }, [isRatingsOpen]);

  // Set the ratings bar percentage according to overall rating of each criteria
  useEffect(() => {
    if (overallRecommend === 0) return;
    criteriaRef.current.style.setProperty(
      "--difficulty",
      `${overallDifficulty * 20}%`
    );
    criteriaRef.current.style.setProperty(
      "--engaging",
      `${overallEngaging * 20}%`
    );
    criteriaRef.current.style.setProperty(
      "--effectiveness",
      `${overallEffectiveness * 20}%`
    );
    criteriaRef.current.style.setProperty(
      "--fair-assessments",
      `${overallFairAssessments * 20}%`
    );
  }, [numberOfReviews]);

  return (
    <article className="ratings" ref={ratingsRef}>
      <div className="button" onClick={(e) => openClose(e)}>
        {isRatingsOpen ? <FaMinus /> : <FaPlus />}
      </div>
      <div className="header">
        <FaStar />
        <h1>
          {language === "English"
            ? ratingsSectionTranslations[0].english
            : language === "Chinese" && ratingsSectionTranslations[0].chinese}
        </h1>
      </div>
      {overallRecommend === 0 ? (
        <h1>
          {language === "English"
            ? ratingsSectionTranslations[1].english
            : language === "Chinese" && ratingsSectionTranslations[1].chinese}
        </h1>
      ) : (
        <div className="contain">
          <div className="recommend">
            <h1>{(Math.round(overallRecommend * 10) / 10).toFixed(1)}</h1>
            <div className="stars-container">
              <div className="stars">
                {[...Array(5).keys()].map((i) => {
                  return (
                    <div
                      key={i}
                      className={
                        overallRecommend <= 0.3 + i
                          ? null
                          : overallRecommend <= 0.7 + i
                          ? "half"
                          : overallRecommend <= 0.9 + i
                          ? "full"
                          : "full"
                      }
                    >
                      <FaStar className="fullStar" />
                      {overallRecommend >= 0.3 + i &&
                        overallRecommend < 0.9 + i && (
                          <FaStarHalf className="halfStar" />
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
            <p>
              {numberOfReviews}{" "}
              {language === "English"
                ? ratingsSectionTranslations[2].english
                : language === "Chinese" &&
                  ratingsSectionTranslations[2].chinese}
            </p>
          </div>
          <div className="criteria" ref={criteriaRef}>
            <div
              className="single difficulty"
              onMouseEnter={(e) => displayDefinition(e)}
              onMouseLeave={() => resetDefinition()}
            >
              <p>
                {language === "English"
                  ? ratingsSectionTranslations[3].english
                  : language === "Chinese" &&
                    ratingsSectionTranslations[3].chinese}{" "}
                <span>{overallDifficulty.toFixed(1)}</span>
              </p>
              <div></div>
            </div>
            <div
              className="single engaging"
              onMouseEnter={(e) => displayDefinition(e)}
              onMouseLeave={() => resetDefinition()}
            >
              <p>
                {language === "English"
                  ? ratingsSectionTranslations[4].english
                  : language === "Chinese" &&
                    ratingsSectionTranslations[4].chinese}{" "}
                <span>{overallEngaging.toFixed(1)}</span>
              </p>
              <div></div>
            </div>
            <div
              className="single effectiveness"
              onMouseEnter={(e) => displayDefinition(e)}
              onMouseLeave={() => resetDefinition()}
            >
              <p>
                {language === "English"
                  ? ratingsSectionTranslations[5].english
                  : language === "Chinese" &&
                    ratingsSectionTranslations[5].chinese}{" "}
                <span>{overallEffectiveness.toFixed(1)}</span>
              </p>
              <div></div>
            </div>
            <div
              className="single fair-assessments"
              onMouseEnter={(e) => displayDefinition(e)}
              onMouseLeave={() => resetDefinition()}
            >
              <p>
                {language === "English"
                  ? ratingsSectionTranslations[6].english
                  : language === "Chinese" &&
                    ratingsSectionTranslations[6].chinese}{" "}
                <span>{overallFairAssessments.toFixed(1)}</span>
              </p>
              <div></div>
            </div>
            <div className="criteria-definition"></div>
          </div>
        </div>
      )}
    </article>
  );
};

export default RatingsSection;

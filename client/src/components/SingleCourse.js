import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalf } from "react-icons/fa";

import { useAuthStateContext } from "../context/AuthStateContext";
import { useLanguageContext } from "../context/LanguageContext";
import { searchResultsTranslations } from "../pages/SearchResults/searchResultsTranslations";

const SingleCourse = ({
  courseId,
  courseEnglishName,
  courseName,
  overallRecommend,
  numberOfReviews,
  teacher,
  time,
  taughtInEnglish,
  className,
}) => {
  const { authState } = useAuthStateContext();
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  return (
    <article id="single-course" className={className}>
      <div className="header">
        <h1
          onClick={() =>
            navigate(`/course/${courseId}`, {
              state: { navigate: true },
            })
          }
        >
          {language === "English"
            ? courseEnglishName
            : language === "Chinese" && courseName}
        </h1>
      </div>
      <div className="reviews">
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
                {overallRecommend >= 0.3 + i && overallRecommend < 0.9 + i && (
                  <FaStarHalf className="halfStar" />
                )}
              </div>
            );
          })}
        </div>
        <span>
          {numberOfReviews}{" "}
          {language === "English"
            ? searchResultsTranslations[10].english
            : language === "Chinese" && searchResultsTranslations[10].chinese}
        </span>
      </div>
      <div className="class-info">
        <p>
          <span>{courseId}</span>
          <span>{time}</span>
        </p>
        <p>
          <span>{teacher}</span>
          <span>
            {taughtInEnglish
              ? language === "English"
                ? searchResultsTranslations[13].english
                : language === "Chinese" &&
                  searchResultsTranslations[13].chinese
              : language === "English"
              ? searchResultsTranslations[14].english
              : language === "Chinese" && searchResultsTranslations[14].chinese}
          </span>
        </p>
      </div>
      <div className="btn-container">
        {authState.loggedIn && (
          <button
            className="write-review"
            onClick={() => navigate(`/write-review/${courseId}`)}
          >
            {language === "English"
              ? searchResultsTranslations[11].english
              : language === "Chinese" && searchResultsTranslations[11].chinese}
          </button>
        )}
        <button
          className="more-info"
          onClick={() =>
            navigate(`/course/${courseId}`, {
              state: { navigate: true },
            })
          }
        >
          {language === "English"
            ? searchResultsTranslations[12].english
            : language === "Chinese" && searchResultsTranslations[12].chinese}
        </button>
      </div>
    </article>
  );
};

export default SingleCourse;

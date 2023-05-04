import React, { useState, useEffect, useRef } from "react";
import { FaFileAlt, FaPlus, FaMinus } from "react-icons/fa";

import { courseInfoTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

// In charge of the course information section of the course specific page
// Displays basic all the information for a course including, teacher time, language, course name, department ,number of credits, which semester is it taught in, and is it taught in english
// Users can also minimize this section on mobile or tablet

const CourseInfoSection = ({
  courseId,
  teacher,
  credits,
  time,
  fallSemester,
  springSemester,
  taughtInEnglish,
}) => {
  const { language } = useLanguageContext();
  const infoRef = useRef();
  const [isInfoOpen, setIsInfoOpen] = useState(true);

  // Hanlde the open and closing of the Reviews and Course Info sections
  const openClose = (e) => {
    if (e.target.parentElement.classList.contains("course-info")) {
      setIsInfoOpen(!isInfoOpen);
    }
  };

  // Applies css animation for Course Info section
  useEffect(() => {
    if (!infoRef.current) return;
    if (isInfoOpen) {
      infoRef.current.style.maxHeight = "1000px";
    } else {
      infoRef.current.style.maxHeight = "0px";
    }
  }, [isInfoOpen]);

  return (
    <article className="course-info" ref={infoRef}>
      <div className="button" onClick={(e) => openClose(e)}>
        {isInfoOpen ? <FaMinus /> : <FaPlus />}
      </div>
      <div className="header">
        <FaFileAlt />
        <h1>
          {language === "English"
            ? courseInfoTranslations[0].english
            : language === "Chinese" && courseInfoTranslations[0].chinese}
        </h1>
      </div>
      <ul className="info">
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[1].english
              : language === "Chinese" &&
                courseInfoTranslations[1].chinese}{" "}
          </span>{" "}
          <span>{courseId}</span>
        </li>
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[2].english
              : language === "Chinese" &&
                courseInfoTranslations[2].chinese}{" "}
          </span>{" "}
          <span>{teacher}</span>
        </li>
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[3].english
              : language === "Chinese" &&
                courseInfoTranslations[3].chinese}{" "}
          </span>{" "}
          <span>{credits}</span>
        </li>
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[4].english
              : language === "Chinese" &&
                courseInfoTranslations[4].chinese}{" "}
          </span>{" "}
          <span>{time}</span>
        </li>
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[5].english
              : language === "Chinese" &&
                courseInfoTranslations[5].chinese}{" "}
          </span>{" "}
          <span>
            {(fallSemester && springSemester && language === "English"
              ? courseInfoTranslations[6].english
              : language === "Chinese" && courseInfoTranslations[6].chinese) ||
              (fallSemester && language === "English"
                ? courseInfoTranslations[7].english
                : language === "Chinese" &&
                  courseInfoTranslations[7].chinese) ||
              (springSemester && language === "English"
                ? courseInfoTranslations[8].english
                : language === "Chinese" && courseInfoTranslations[8].chinese)}
          </span>
        </li>
        <li>
          <span>
            {language === "English"
              ? courseInfoTranslations[9].english
              : language === "Chinese" &&
                courseInfoTranslations[9].chinese}{" "}
          </span>{" "}
          <span>
            {taughtInEnglish
              ? language === "English"
                ? courseInfoTranslations[10].english
                : language === "Chinese" && courseInfoTranslations[10].chinese
              : language === "English"
              ? courseInfoTranslations[11].english
              : language === "Chinese" && courseInfoTranslations[11].chinese}
          </span>
        </li>
      </ul>
    </article>
  );
};

export default CourseInfoSection;

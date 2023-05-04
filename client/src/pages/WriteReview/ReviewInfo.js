import React, { useState, useEffect, useRef } from "react";
import {
  FaEdit,
  FaKeyboard,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

import { yearOptions, semesterOptions } from "../../assets/reviewInfoDropdown";
import { reviewInfoTranslations } from "./writeReviewTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

// This is the part in which a user writes the review itself or the writing a review page
// Users can choose a title, and write a description which will later be displayed throughout the website
// Users will then choose a year and semester in which they took the course
// And finally they can choose if they want the review to be anonymous or not
// After the review is submitted users will be redirected to the course specific page for the review they just wrote

const ReviewInfo = ({ reviewInfo, setReviewInfo, error }) => {
  const { language } = useLanguageContext();
  const yearRef = useRef();
  const semesterRef = useRef();
  const [years, setYears] = useState(yearOptions);
  const [semesters, setSemesters] = useState(semesterOptions);

  // narrows the year list according to what is typed
  const narrowYearOptions = (e) => {
    if (e.target.value !== "") {
      const results = yearOptions.filter((year) => {
        return year.toString().indexOf(e.target.value) !== -1;
      });
      setYears(results);
    } else {
      setYears(yearOptions);
    }
    setReviewInfo({ ...reviewInfo, year: e.target.value });
  };

  // narrows the semester list according to what is typed
  const narrowSemesterOptions = (e) => {
    if (e.target.value !== "") {
      const results = semesterOptions.filter((semester) => {
        return (
          semester.semester
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||
          semester.value.toString().indexOf(e.target.value) !== -1
        );
      });
      setSemesters(results);
    } else {
      setSemesters(semesterOptions);
    }
    setReviewInfo({ ...reviewInfo, semester: e.target.value });
  };

  // Brings the dropdown down
  const activateDropdown = (e) => {
    if (e.target.id === "review-year") {
      yearRef.current.classList.add("active");
      semesterRef.current.classList.remove("active");
    }
    if (e.target.id === "review-semester") {
      yearRef.current.classList.remove("active");
      semesterRef.current.classList.add("active");
    }
  };

  // closes the dropdown when clicked anywhere other than dropdown or input
  const closeDropdown = (e) => {
    if (e.target.id === "review-year" || e.target.id === "review-semester")
      return;
    yearRef.current.classList.remove("active");
    semesterRef.current.classList.remove("active");
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <article className="review-info">
      <form>
        <div className="field-container">
          <label htmlFor="review-title">
            <FaEdit />
          </label>
          <input
            type="text"
            placeholder={
              language === "English"
                ? reviewInfoTranslations[0].english
                : language === "Chinese" && reviewInfoTranslations[0].chinese
            }
            className="input-field"
            id="review-title"
            value={reviewInfo.title}
            onChange={(e) =>
              setReviewInfo({ ...reviewInfo, title: e.target.value })
            }
            autoComplete="off"
          />
        </div>
        <div className="field-container description-container">
          <label htmlFor="review-description">
            <FaKeyboard />
          </label>
          <div
            id="review-description"
            className="description-input"
            contentEditable="true"
            value={reviewInfo.description}
            onInput={(e) => {
              setReviewInfo({
                ...reviewInfo,
                description: e.target.textContent,
              });
            }}
          ></div>
        </div>
        <div className="joint">
          <div className="field-container">
            <label htmlFor="review-year">
              <FaCalendarAlt />
            </label>
            <input
              type="number"
              placeholder={
                language === "English"
                  ? reviewInfoTranslations[1].english
                  : language === "Chinese" && reviewInfoTranslations[1].chinese
              }
              className="input-field"
              id="review-year"
              value={reviewInfo.year === 0 ? "" : reviewInfo.year}
              autoComplete="off"
              onClick={(e) => activateDropdown(e)}
              onChange={(e) => narrowYearOptions(e)}
            />
            <ul className="dropdown-menu" ref={yearRef}>
              {years.map((year, index) => {
                return (
                  <li
                    key={index}
                    className="dropdown-option"
                    onClick={() =>
                      setReviewInfo({
                        ...reviewInfo,
                        year,
                      })
                    }
                  >
                    {year}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="field-container">
            <label htmlFor="review-semester">
              <FaGraduationCap />
            </label>
            <input
              type="text"
              placeholder={
                language === "English"
                  ? reviewInfoTranslations[2].english
                  : language === "Chinese" && reviewInfoTranslations[2].chinese
              }
              className="input-field"
              value={reviewInfo.semester}
              id="review-semester"
              autoComplete="off"
              onClick={(e) => activateDropdown(e)}
              onChange={(e) => narrowSemesterOptions(e)}
            />
            <ul className="dropdown-menu" ref={semesterRef}>
              {semesters.map((semester, index) => {
                return (
                  <li
                    key={index}
                    className="dropdown-option"
                    onClick={() =>
                      setReviewInfo({
                        ...reviewInfo,
                        semester: semester.semester,
                      })
                    }
                  >
                    {semester.semester}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="field-container anonymous">
          <label className="toggler-wrapper">
            <input
              type="checkbox"
              checked={reviewInfo.anonymous}
              onChange={(e) =>
                setReviewInfo({ ...reviewInfo, anonymous: e.target.checked })
              }
            />
            <div className="toggler-slider">
              <div className="toggler-knob"></div>
            </div>
          </label>
          <p>
            {reviewInfo.anonymous
              ? language === "English"
                ? reviewInfoTranslations[3].english
                : language === "Chinese" && reviewInfoTranslations[3].chinese
              : language === "English"
              ? reviewInfoTranslations[4].english
              : language === "Chinese" && reviewInfoTranslations[4].chinese}
          </p>
        </div>
        <div className="error-container">
          {error !== "" && <span className={error.classname}>{error.msg}</span>}
        </div>
      </form>
    </article>
  );
};

export default ReviewInfo;

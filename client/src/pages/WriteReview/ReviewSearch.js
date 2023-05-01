import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../components/Loading";
import useDebounce from "../../hooks/useDebounce";

import { getCoursesByNameOrId } from "../../api/coursesApi";
import { reviewSearchTranslations } from "./writeReviewTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

const ReviewSearch = ({ courseId, setCourseId, setStep, error, setError }) => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 1000);

  // Fetch courses with function defined in coursesApi file
  const courses = useQuery(
    ["searchCourses", debouncedValue],
    () => debouncedValue.length > 2 && getCoursesByNameOrId(debouncedValue)
  );

  const navigateSearchResults = (search) => {
    setSearch("");
    navigate(`/search/${search}`);
  };

  useEffect(() => {
    if (!courseId) return;
    setError({ msg: `Course ID selected: ${courseId}`, classname: "green" });
  }, [courseId]);

  return (
    <article className="review-search">
      <div className="error-container">
        {error !== "" && <span className={error.classname}>{error.msg}</span>}
      </div>
      <div className="container">
        <form className="searchbar">
          <label>
            <FaSearch />
          </label>
          <input
            name="search"
            type="text"
            placeholder={
              language === "English"
                ? reviewSearchTranslations[0].english
                : language === "Chinese" && reviewSearchTranslations[0].chinese
            }
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <FaTimes className="clear" onClick={() => setSearch("")} />
          )}
        </form>
      </div>
      <article className="results">
        {search && (
          <ul className="search-results">
            {courses.status === "error" && (
              <h1>
                {language === "English"
                  ? reviewSearchTranslations[1].english
                  : language === "Chinese" &&
                    reviewSearchTranslations[1].chinese}
              </h1>
            )}
            {courses.status === "loading" && <Loading />}
            {courses.status === "success" && (
              <>
                {debouncedValue && debouncedValue.length >= 3 && (
                  <li onClick={() => navigateSearchResults(debouncedValue)}>
                    <FaSearch />{" "}
                    <span>
                      {language === "English"
                        ? reviewSearchTranslations[2].english
                        : language === "Chinese" &&
                          reviewSearchTranslations[2].chinese}{" "}
                      "{search}"
                    </span>
                  </li>
                )}
                {Array.from(courses.data).map((course, index) => {
                  const {
                    courseId,
                    courseName,
                    courseEnglishName,
                    Department,
                  } = course;
                  const { departmentEnglishName, departmentName } = Department;
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setCourseId(courseId);
                        setStep(1);
                      }}
                    >
                      <span>
                        {language === "English"
                          ? courseEnglishName
                          : language === "Chinese" && courseName}{" "}
                        - {courseId}
                      </span>
                      <span>
                        {language === "English"
                          ? departmentEnglishName
                          : language === "Chinese" && departmentName}
                      </span>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        )}
      </article>
    </article>
  );
};

export default ReviewSearch;

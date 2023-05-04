import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Loading from "./Loading";
import useDebounce from "../hooks/useDebounce";

import { searchTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";
import { useScreenSizeContext } from "../context/ScreenSizeContext";
import { getCoursesByNameOrId, getPopularCourses } from "../api/coursesApi";

// Search that allows users to search db courses by chinese name, course code, or english name
// If nothing is typed it displays the top 5 most popular courses at the time
// After 3 characters are typed then it returns first 10 results for the string matches in the db
// On Click of any of the single courses will redirect the user to the course specific page
// User can also view all the search results in the search results page by clicking on the option

const Search = ({ isSearchOpen, setIsSearchOpen, navSearch }) => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const searchbarRef = useRef();
  const [search, setSearch] = useState(navSearch || "");
  const debouncedValue = useDebounce(search, 1000);

  // Fetches the top 5 most popular courses at the moment
  const popular = useQuery(["popularCourses"], () => getPopularCourses());

  // Fetch courses with function defined in coursesApi file
  const courses = useQuery(
    ["searchCourses", debouncedValue],
    () => debouncedValue.length > 2 && getCoursesByNameOrId(debouncedValue)
  );

  // On click of a course navigates to the course specific page, navigate: true allows for visited column in db to be updated
  const navigateCourse = (courseId) => {
    setIsSearchOpen(false);
    setSearch("");
    navigate(`/course/${courseId}`, { state: { navigate: true } });
  };

  // If clicked on view all results then navigate to the search results page
  const navigateSearchResults = (search) => {
    setIsSearchOpen(false);
    setSearch("");
    navigate(`/search/${search}`);
  };

  // Apply focus to the searchbar once the search window is open
  useEffect(() => {
    searchbarRef.current.focus();
  }, [isSearchOpen]);

  // Specifically for desktop, makes the search term same as the one found on the navbar searchbar
  useEffect(() => {
    setSearch(navSearch);
  }, [navSearch]);

  return (
    <section id="search" className={isSearchOpen ? "active" : null}>
      {isDesktop && (
        <div
          className="overlay"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        ></div>
      )}
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
                ? searchTranslations[0].english
                : language === "Chinese" && searchTranslations[0].chinese
            }
            autoComplete="off"
            ref={searchbarRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <FaTimes className="clear" onClick={() => setSearch("")} />
          )}
        </form>
        {search ? (
          <article className="results">
            <ul className="search-results">
              {courses.status === "error" && (
                <h1>
                  {language === "English"
                    ? searchTranslations[1].english
                    : language === "Chinese" && searchTranslations[1].chinese}
                </h1>
              )}
              {courses.status === "loading" && <Loading />}
              {courses.status === "success" && (
                <>
                  {debouncedValue && (
                    <li onClick={() => navigateSearchResults(debouncedValue)}>
                      <FaSearch />{" "}
                      <span>
                        {language === "English"
                          ? searchTranslations[2].english
                          : language === "Chinese" &&
                            searchTranslations[2].chinese}{" "}
                        "{search}"
                      </span>
                    </li>
                  )}
                  {Array.from(courses?.data).map((course, index) => {
                    const {
                      courseId,
                      courseName,
                      courseEnglishName,
                      Department,
                    } = course;
                    const { departmentEnglishName, departmentName } =
                      Department;
                    return (
                      <li key={index} onClick={() => navigateCourse(courseId)}>
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
          </article>
        ) : (
          <article className="popular">
            <div className="header">
              <h1>
                {language === "English"
                  ? searchTranslations[3].english
                  : language === "Chinese" && searchTranslations[3].chinese}
              </h1>
            </div>
            <ul className="popular-courses">
              {popular.status === "error" && (
                <h1>
                  {language === "English"
                    ? searchTranslations[1].english
                    : language === "Chinese" && searchTranslations[1].chinese}
                </h1>
              )}
              {popular.status === "loading" && <Loading />}
              {popular.status === "success" &&
                Array.from(popular.data).map((course, index) => {
                  const {
                    courseId,
                    courseName,
                    courseEnglishName,
                    Department,
                  } = course;
                  const { departmentEnglishName, departmentName } = Department;
                  return (
                    <li key={index} onClick={() => navigateCourse(courseId)}>
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
            </ul>
          </article>
        )}
      </div>
    </section>
  );
};

export default Search;

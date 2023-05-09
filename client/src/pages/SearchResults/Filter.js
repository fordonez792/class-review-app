import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronUp } from "react-icons/fa";

import { searchFilters } from "../../assets/filters";
import { filterTranslations } from "./searchResultsTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// This is the filters page for the search results page to filter courses
// Allows users to filter courses by language course is taught in, semester course is available in, course level meaining freshman, master, etc, and day of the week the course is taught in
// If users are in mobile or tablet users must select and then apply the filters for courses to be filtered
// If users are in desktop just selecting is enough, filters will be applied automatically

const Filter = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedFilters,
  setSelectedFilters,
  refetch,
  setPageNumber,
  className,
}) => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  // Refetch the data according to the filters selected
  const applyFilters = () => {
    setPageNumber(0);
    refetch();
    setSelectedFilters({ ...tempFilters, saved: true });
    setIsFilterOpen(false);
  };

  const closeFilters = () => {
    if (!selectedFilters.saved) {
      setSelectedFilters({
        ...selectedFilters,
        taughtInEnglish: null,
        fall: null,
        spring: null,
        courseLevel: [],
        time: [],
      });
    }
    setIsFilterOpen(false);
  };

  // Handles opening and closing of a single filter, only on desktop
  const openClose = (e) => {
    if (!e.target.classList.contains("open-close-btn")) return;
    const filter = e.target.parentElement.parentElement;
    filter.classList.toggle("active");
  };

  // Connecting the css to the states
  const handleFilter = (e) => {
    const { classList, textContent, dataset } = e.target;
    if (!classList.contains("filter-option")) return;
    if (!classList.contains("active")) {
      // Only update the filter for the language part
      if (classList.contains("language")) {
        setTempFilters({ ...tempFilters, taughtInEnglish: true });
      }
      // Only update the filter for the semester part
      if (classList.contains("semester")) {
        if (textContent === "Fall") {
          setTempFilters({ ...tempFilters, fall: true });
        }
        if (textContent === "Spring") {
          setTempFilters({ ...tempFilters, spring: true });
        }
      }
      // Only update the filter for the course level part
      if (classList.contains("courseLevel")) {
        setTempFilters({
          ...tempFilters,
          courseLevel: [...tempFilters.courseLevel, dataset.value],
        });
      }
      // Only update the filter for the time part
      if (classList.contains("time")) {
        setTempFilters({
          ...tempFilters,
          time: [...tempFilters.time, dataset.value],
        });
      }
      classList.add("active");
    } else {
      // Only update the filter for the language part
      if (classList.contains("language")) {
        setTempFilters({ ...tempFilters, taughtInEnglish: null });
      }
      // Only update the filter for the semester part
      if (classList.contains("semester")) {
        if (textContent === "Fall") {
          setTempFilters({ ...tempFilters, fall: null });
        }
        if (textContent === "Spring") {
          setTempFilters({ ...tempFilters, spring: null });
        }
      }
      // Only update the filter for the course level part
      if (classList.contains("courseLevel")) {
        const tempArray = Array.from(tempFilters.courseLevel).filter(
          (level) => {
            if (level !== dataset.value) return level;
          }
        );
        setTempFilters({
          ...tempFilters,
          courseLevel: tempArray,
        });
      }
      // Only update the filter for the time part
      if (classList.contains("time")) {
        const tempArray = Array.from(tempFilters.time).filter((item) => {
          if (item !== dataset.value) return item;
        });
        setTempFilters({
          ...tempFilters,
          time: tempArray,
        });
      }
      classList.remove("active");
    }
  };

  // If it is desktop then after selecting a filter immediately filter the results instead of pressing apply button like in the mobile and tablet view
  useEffect(() => {
    if (isDesktop) applyFilters();
  }, [tempFilters]);

  return (
    <section
      id="filter-modal"
      className={`${isFilterOpen ? "active" : null} ${className && className}`}
      onClick={(e) => handleFilter(e)}
    >
      <div className="container">
        <div className="close-btn">
          <FaTimes onClick={() => closeFilters()} />
        </div>
        <article className="header">
          <h1>
            {language === "English"
              ? filterTranslations[0].english
              : language === "Chinese" && filterTranslations[0].chinese}
          </h1>
        </article>
        {(isFilterOpen || isDesktop) &&
          searchFilters.map((filter, index) => {
            return (
              <article
                key={index}
                id={filter.name.toLowerCase()}
                className="single-filter active"
                onClick={(e) => openClose(e)}
              >
                <div className="header">
                  <h1>
                    {language === "English"
                      ? filter.name
                      : language === "Chinese" && filter.nameChinese}
                  </h1>
                  {isDesktop && (
                    <div className="open-close-btn">
                      <FaChevronUp />
                    </div>
                  )}
                </div>
                <ul>
                  {filter.options.map((option, index) => {
                    const { taughtInEnglish, fall, spring, courseLevel, time } =
                      selectedFilters;
                    return (
                      <li
                        key={index}
                        data-value={option.value}
                        className={`filter-option ${
                          filter.name === "Language"
                            ? "language"
                            : filter.name === "Semester"
                            ? "semester"
                            : filter.name === "Course Level"
                            ? "courseLevel"
                            : filter.name === "Course Time"
                            ? "time"
                            : null
                        } ${
                          // connect the filters state to the active class
                          (taughtInEnglish &&
                            (option.display === "Taught in English" ||
                              option.displayChinese === "英語授課") &&
                            "active") ||
                          (fall &&
                            (option.display === "Fall" ||
                              option.displayChinese === "秋季學期") &&
                            "active") ||
                          (spring &&
                            (option.display === "Spring" ||
                              option.displayChinese === "春季學期") &&
                            "active") ||
                          (courseLevel?.includes(option.value) && "active") ||
                          (time?.includes(option.value) && "active")
                        }`}
                      >
                        {language === "English"
                          ? option.display
                          : language === "Chinese" && option.displayChinese}
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        <article className="btn-container">
          <button onClick={() => closeFilters()}>
            {language === "English"
              ? filterTranslations[1].english
              : language === "Chinese" && filterTranslations[1].chinese}
          </button>
          <button onClick={() => applyFilters()}>
            {language === "English"
              ? filterTranslations[2].english
              : language === "Chinese" && filterTranslations[2].chinese}
          </button>
        </article>
      </div>
    </section>
  );
};

export default Filter;

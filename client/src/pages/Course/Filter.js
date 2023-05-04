import React, { useState, useEffect } from "react";
import { FaTimes, FaRegStar, FaChevronUp } from "react-icons/fa";

import { reviewFilters } from "../../assets/filters";
import { filterTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// The filter page / section for the course specific page to filter reviews
// Allows users to filter by different criteria it being, ratings, year, and semester
// If users are in mobile or tablet users must select and then apply the filters for courses to be filtered
// If users are in desktop just selecting is enough, filters will be applied automatically

const Filter = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedFilters,
  setSelectedFilters,
  refetch,
  className,
}) => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  // Refetch the data according to the filters selected
  const applyFilters = () => {
    refetch();
    setSelectedFilters({ ...tempFilters, saved: true });
    setIsFilterOpen(false);
  };

  const closeFilters = () => {
    if (!selectedFilters.saved) {
      setSelectedFilters({
        ...selectedFilters,
        rating: [],
        year: [],
        fall: null,
        spring: null,
        saved: false,
      });
    }
    setIsFilterOpen(false);
  };

  // Connecting the css to the states
  const handleFilter = (e) => {
    const { classList, textContent, dataset } = e.target;
    if (!classList.contains("filter-option")) return;
    if (!classList.contains("active")) {
      // Only update the filter for the course level part
      if (classList.contains("rating")) {
        setTempFilters({
          ...tempFilters,
          rating: [...tempFilters.rating, dataset.value],
        });
      }
      // Only update the filter for the time part
      if (classList.contains("year")) {
        setTempFilters({
          ...tempFilters,
          year: [...tempFilters.year, dataset.value],
        });
      }
      // Only update the filter for the semester part
      if (classList.contains("semester")) {
        if (textContent === "Fall" || textContent === "秋季學期") {
          setTempFilters({ ...tempFilters, fall: true });
        }
        if (textContent === "Spring" || textContent === "春季學期") {
          setTempFilters({ ...tempFilters, spring: true });
        }
      }
      classList.add("active");
    } else {
      // Only update the filter for the course level part
      if (classList.contains("rating")) {
        const tempArray = Array.from(tempFilters.rating).filter((rating) => {
          if (rating !== dataset.value) return rating;
        });
        setTempFilters({
          ...tempFilters,
          rating: tempArray,
        });
      }
      // Only update the filter for the time part
      if (classList.contains("year")) {
        const tempArray = Array.from(tempFilters.year).filter((year) => {
          if (year !== dataset.value) return year;
        });
        setTempFilters({
          ...tempFilters,
          year: tempArray,
        });
      }
      // Only update the filter for the semester part
      if (classList.contains("semester")) {
        if (textContent === "Fall" || textContent === "秋季學期") {
          setTempFilters({ ...tempFilters, fall: null });
        }
        if (textContent === "Spring" || textContent === "春季學期") {
          setTempFilters({ ...tempFilters, spring: null });
        }
      }
      classList.remove("active");
    }
  };

  // Controls the open and closing of single filters for the desktop view
  const openClose = (e) => {
    if (!e.target.classList.contains("open-close-btn")) return;
    const filter = e.target.parentElement.parentElement;
    filter.classList.toggle("active");
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
          reviewFilters.map((filter, index) => {
            return (
              <article
                key={index}
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
                    const { rating, year, fall, spring } = selectedFilters;
                    return (
                      <li
                        key={index}
                        data-value={option.value}
                        className={`filter-option ${
                          filter.name === "Rating"
                            ? "rating"
                            : filter.name === "Year"
                            ? "year"
                            : filter.name === "Semester"
                            ? "semester"
                            : null
                        } ${
                          // connect the filters state to the active class
                          (rating.includes(option.value) && "active") ||
                          (year.includes(option.value) && "active") ||
                          (fall &&
                            (option.display === "Fall" ||
                              option.displayChinese === "秋季學期") &&
                            "active") ||
                          (spring &&
                            (option.display === "Spring" ||
                              option.displayChinese === "春季學期") &&
                            "active")
                        }`}
                      >
                        {language === "English"
                          ? option.display
                          : language === "Chinese" && option.displayChinese}
                        {filter.name === "Rating" ? <FaRegStar /> : null}
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

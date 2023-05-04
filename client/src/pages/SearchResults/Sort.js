import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";

import { searchSort } from "../../assets/sort";
import { sortTranslations } from "./searchResultsTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// This is the sort page for the search results page for sorting the courses
// Allows users to sort reviews by default, courses with most reviews first, highest rated courses first, and most popular courses first
// If users are in mobile or tablet users must select and then apply the sorts for courses to be sorted
// If users are in desktop just selecting is enough, sorts will be applied automatically

const Sort = ({
  isSortOpen,
  setIsSortOpen,
  selectedSort,
  setSelectedSort,
  setPageNumber,
  className,
}) => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const formRef = useRef();
  const dropdownRef = useRef();
  const [tempSort, setTempSort] = useState(selectedSort);

  // Refetch the data according to the sort selected
  const applySort = () => {
    setPageNumber(0);
    setSelectedSort({ ...tempSort, saved: true });
    setIsSortOpen(false);
  };
  // Handles closing the sort page, and doesn't save any sorting method if it was not applied
  const closeSort = () => {
    if (!selectedSort.saved) {
      setSelectedSort({ ...selectedSort });
    }
    setIsSortOpen(false);
  };

  const handleSort = (e) => {
    if (e.target.dataset.value == null) return;
    if (isDesktop) {
      setTempSort({
        ...tempSort,
        sort: e.target.dataset.value,
        sortName: e.target.textContent,
      });
    } else {
      setTempSort({
        ...tempSort,
        sort: e.target.dataset.value,
      });
    }
  };

  // If it is desktop then after selecting a sort immediately sort the results instead of pressing apply button like in the mobile and tablet view
  useEffect(() => {
    if (isDesktop) applySort();
  }, [tempSort]);

  // Persist the previous state if sort was not applied
  useEffect(() => {
    if (!formRef.current) return;
    Array.from(formRef.current.children).some((child) => {
      console.log(selectedSort);
      if (child.id === selectedSort.sort.toString()) {
        child.children[0].checked = true;
      }
    });
  }, [isSortOpen]);

  // Opens dropdown when clicking on the input, only for desktop
  const openDropdown = (e) => {
    if (!isDesktop) return;
    if (!e.target.id === "sort" && !e.target?.classList.contains("icon"))
      return;
    dropdownRef.current.classList.toggle("active");
  };

  // closes the dropdown when clicked anywhere other than dropdown or input
  const closeDropdown = (e) => {
    if (!isDesktop) return;
    if (
      e.target.id === "sort" ||
      e.target.classList.contains("option") ||
      e.target.classList.contains("icon")
    )
      return;
    dropdownRef.current.classList.remove("active");
  };

  useEffect(() => {
    if (!isDesktop) return;
    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <section
      id="sort-modal"
      className={`${isSortOpen ? "active" : null} ${className && className}`}
    >
      <div className="container">
        <div className="close-btn">
          <FaTimes onClick={() => closeSort()} />
        </div>
        <article className="header">
          <h1>
            {language === "English"
              ? sortTranslations[0].english
              : language === "Chinese" && sortTranslations[0].chinese}
          </h1>
        </article>
        <form ref={formRef}>
          {isSortOpen &&
            searchSort.map((sort, index) => {
              return (
                <article key={index} id={sort.id} className="single-sort">
                  <input
                    type="radio"
                    name="sort"
                    id={sort.name}
                    data-value={sort.value}
                    onChange={(e) => handleSort(e)}
                  />
                  <label htmlFor={sort.name}>
                    {language === "English"
                      ? sort.name
                      : language === "Chinese" && sort.nameChinese}
                  </label>
                </article>
              );
            })}
        </form>
        {isDesktop && (
          <article className="sort-desktop">
            <p>
              {language === "English"
                ? sortTranslations[3].english
                : language === "Chinese" && sortTranslations[3].chinese}
            </p>
            <div className="field-container" onClick={(e) => openDropdown(e)}>
              <label htmlFor="sort">
                <TbArrowsSort />
              </label>
              <input
                type="text"
                className="input-field"
                value={selectedSort.sortName}
                id="sort"
                autoComplete="off"
                readOnly={true}
              />
              <div className="icon">
                <FaChevronDown />
              </div>
            </div>
            <ul className="dropdown-menu" ref={dropdownRef}>
              {searchSort.map((sort, index) => {
                return (
                  <li
                    key={index}
                    data-value={sort.value}
                    className="dropdown-option"
                    onClick={(e) => handleSort(e)}
                  >
                    {language === "English"
                      ? sort.name
                      : language === "Chinese" && sort.nameChinese}
                  </li>
                );
              })}
            </ul>
          </article>
        )}
        <article className="btn-container">
          <button onClick={() => closeSort()}>
            {language === "English"
              ? sortTranslations[1].english
              : language === "Chinese" && sortTranslations[1].chinese}
          </button>
          <button onClick={() => applySort()}>
            {language === "English"
              ? sortTranslations[2].english
              : language === "Chinese" && sortTranslations[2].chinese}
          </button>
        </article>
      </div>
    </section>
  );
};

export default Sort;

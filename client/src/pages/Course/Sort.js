import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";

import { reviewSort } from "../../assets/sort";
import { sortTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

const Sort = ({
  isSortOpen,
  setIsSortOpen,
  selectedSort,
  setSelectedSort,
  isDesktop,
  className,
}) => {
  const { language } = useLanguageContext();
  const formRef = useRef();
  const dropdownRef = useRef();
  const [tempSort, setTempSort] = useState(selectedSort);

  // Refetch the data according to the sort selected
  const applySort = () => {
    setSelectedSort({ ...tempSort, saved: true });
    setIsSortOpen(false);
  };

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

  // Persist the previous state if sort was not applied
  useEffect(() => {
    if (!formRef.current) return;
    Array.from(formRef.current.children).some((child) => {
      if (child.id === selectedSort.sort.toString()) {
        child.children[0].checked = true;
      }
    });
  }, [isSortOpen]);

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

  useEffect(() => {
    if (isDesktop) applySort();
  }, [tempSort]);

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
            reviewSort.map((sort, index) => {
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
              {reviewSort.map((sort, index) => {
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

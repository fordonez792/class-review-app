import React from "react";
import { FaComments, FaSlidersH, FaSearch, FaTimes } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";

import SingleReview from "../../components/SingleReview";
import Loading from "../../components/Loading";
import Sort from "./Sort";

import { reviewsSectionTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";

const ReviewsSection = ({
  search,
  setSearch,
  debouncedValue,
  status,
  reviews,
  refetch,
  isSortOpen,
  setIsSortOpen,
  selectedSort,
  setSelectedSort,
  setIsFilterOpen,
  selectedFilters,
  setSelectedFilters,
  isTablet,
  isDesktop,
}) => {
  const { language } = useLanguageContext();

  // Opens the searchbar applying the css animation
  const openSearchBar = (e) => {
    e.target?.classList.add("hide");
    e.target.parentElement.children[0]?.classList.add("active");
    e.target.parentElement.children[0].children[0].focus();
  };

  // Closes the searchbar applying the css animation
  const closeSearchBar = (e) => {
    if (search !== "") {
      setSearch("");
      return;
    }
    e.target.parentElement.parentElement?.classList.remove("active");
    e.target.parentElement.parentElement.parentElement.children[1]?.classList.remove(
      "hide"
    );
  };

  // Resets filters and search then refetches
  const resetFilters = () => {
    setSelectedFilters({
      ...selectedFilters,
      search: "",
      rating: [],
      year: [],
      fall: null,
      spring: null,
      saved: false,
    });
    setSearch("");
    refetch();
  };

  return (
    <article className="reviews-container">
      <div className="desktop-white">
        <div className="header">
          <FaComments />
          <h1>
            {language === "English"
              ? reviewsSectionTranslations[0].english
              : language === "Chinese" && reviewsSectionTranslations[0].chinese}
          </h1>
        </div>
        <div className="ratings-filter"></div>
        <div className="btn-container">
          <div className="contain">
            <form className="searchbar">
              <input
                name="search"
                type="text"
                placeholder={
                  language === "English"
                    ? reviewsSectionTranslations[1].english
                    : language === "Chinese" &&
                      reviewsSectionTranslations[1].chinese
                }
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label>
                <FaTimes className="clear" onClick={(e) => closeSearchBar(e)} />
              </label>
            </form>
            <button className="search" onClick={(e) => openSearchBar(e)}>
              <FaSearch />
            </button>
          </div>
          <button className="sort" onClick={() => setIsSortOpen(true)}>
            <TbArrowsSort />{" "}
            {isTablet && (
              <span>
                {language === "English"
                  ? reviewsSectionTranslations[2].english
                  : language === "Chinese" &&
                    reviewsSectionTranslations[2].chinese}
              </span>
            )}
          </button>
          <button className="filter" onClick={() => setIsFilterOpen(true)}>
            <FaSlidersH />{" "}
            {isTablet && (
              <span>
                {language === "English"
                  ? reviewsSectionTranslations[3].english
                  : language === "Chinese" &&
                    reviewsSectionTranslations[3].chinese}
              </span>
            )}
          </button>
          {isDesktop && (
            <>
              <form className="searchbar">
                <input
                  name="search"
                  type="text"
                  placeholder={
                    language === "English"
                      ? reviewsSectionTranslations[1].english
                      : language === "Chinese" &&
                        reviewsSectionTranslations[1].chinese
                  }
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <label>
                    <FaTimes className="clear" onClick={() => setSearch("")} />
                  </label>
                )}
              </form>
              <Sort
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                isSortOpen={isSortOpen}
                setIsSortOpen={setIsSortOpen}
                refetch={refetch}
                isDesktop={isDesktop}
                className="course"
              />
            </>
          )}
        </div>
      </div>
      <div className="reviews">
        {status === "success" ? (
          Array.from(reviews).length > 0 ? (
            Array.from(reviews).map((review, index) => {
              return (
                <SingleReview
                  key={index}
                  review={review}
                  debouncedValue={debouncedValue}
                  refetch={refetch}
                />
              );
            })
          ) : (
            <div className="no-reviews">
              <h1>
                {language === "English"
                  ? reviewsSectionTranslations[4].english
                  : language === "Chinese" &&
                    reviewsSectionTranslations[4].chinese}
              </h1>
              <button onClick={resetFilters}>
                {language === "English"
                  ? reviewsSectionTranslations[5].english
                  : language === "Chinese" &&
                    reviewsSectionTranslations[5].chinese}
              </button>
            </div>
          )
        ) : (
          status === "loading" && <Loading />
        )}
      </div>
    </article>
  );
};

export default ReviewsSection;

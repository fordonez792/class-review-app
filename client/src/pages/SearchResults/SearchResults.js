import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { FaAngleRight, FaAngleLeft, FaSlidersH } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";

import Sort from "./Sort";
import Filter from "./Filter";
import SingleCourse from "../../components/SingleCourse";
import SingleCourseSkeleton from "../../components/SingleCourseSekelton";
import ChatbotDesktop from "../Chatbot/ChatbotDesktop";
import Footer from "../../components/Footer";

import {
  chatbotRatings,
  chatbotCourseLevel,
  chatbotTime,
} from "../../assets/filters";
import { getDepartments, getCourses } from "../../api/coursesApi";
import { useLanguageContext } from "../../context/LanguageContext";
import { searchResultsTranslations } from "./searchResultsTranslations";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// This is the main page for the search results
// This page can be accessed by selecting a department, if this is the case, all other departments for the same college will also be displayed as related departments allowing users to easily choose a different department from the same college
// This page can also be accessed by using the searchbars and viewing all results that match the string, if this is the case, no related departments will be found, only the courses that match the search string
// The results in this page are also paginated meaning, if there are 20 results there will be 2 pages, each page displaying 10 courses
// From the results, courses can also be sorted or filtered by different criteria

const SearchResults = () => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const displayDepartmentsRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the search parameters passed onto this page
  const { search } = useParams();
  const collegeId = searchParams.get("collegeId");
  const departmentName = searchParams.get("department");
  const departmentId = searchParams.get("departmentId");
  const filter = searchParams.get("filter");

  const [displayDepartments, setDisplayDepartments] = useState();

  // States to control the selected sort by user
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    sort: 0,
    sortName:
      language === "English" ? "Default" : language === "Chinese" && "默認",
    saved: false,
  });
  // States to control the selected filters by user
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    departmentId,
    search,
    taughtInEnglish: null,
    fall: null,
    spring: null,
    courseLevel: chatbotCourseLevel.find((str) => str === filter)
      ? [filter]
      : [],
    time: chatbotTime.find((str) => str === filter) ? [filter] : [],
    rating: null,
    saved: false,
  });

  // Fetch courses with function defined in coursesApi file, either by departmentID or the search query
  const courses = useQuery(
    ["courses", selectedFilters, selectedSort],
    () => getCourses(selectedFilters, selectedSort.sort),
    { enabled: !!departmentId || !!search }
  );

  // Fetch departments with function defined in coursesApi file, for easier change of department for searching courses
  const departments = useQuery(
    ["departments", collegeId],
    () => getDepartments(collegeId),
    { enabled: !!collegeId }
  );

  // Updates departmentId if it has changed due to sidemenu selections
  useEffect(() => {
    setSelectedFilters({ ...selectedFilters, departmentId });
  }, [departmentId]);

  // Once a related department is clicked a new search for that department is done, and results are shown in the page immediately, also scroll to the left
  const handleSetParams = (e) => {
    displayDepartmentsRef.current.scroll({ left: 0, behavior: "smooth" });
    setSearchParams({
      collegeId,
      department: e.target.textContent,
      departmentId: e.target.id,
      filter,
    });
    setSelectedFilters({ ...selectedFilters, departmentId: e.target.id });
  };

  // Resets filters to their original state, everything empty
  const resetFilter = () => {
    setSelectedFilters({
      ...selectedFilters,
      taughtInEnglish: null,
      fall: null,
      spring: null,
      courseLevel: [],
      time: [],
      rating: null,
      saved: false,
    });
  };

  // Variables to control the pagination done
  const [pageNumber, setPageNumber] = useState(0);
  const resultsPerPage = 10;
  const pagesVisited = pageNumber * resultsPerPage;
  let displayResults;
  let pageCount;

  // Function to control the change of page for the pagination, and scroll to top
  const changePage = ({ selected }) => {
    setPageNumber(selected);
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  // Gets the max pages, and slices the data accordingly
  if (courses.data != null) {
    pageCount = Math.ceil(Array.from(courses?.data).length / resultsPerPage);
    displayResults = Array.from(courses.data).slice(
      pagesVisited,
      pagesVisited + resultsPerPage
    );
  }

  // Sort the departments to display selected one first after it is clicked
  useEffect(() => {
    if (departments.data == null) return;
    let selected;
    const tempArray = Array.from(departments?.data).filter((department) => {
      const { departmentEnglishName } = department;
      if (
        departmentEnglishName === departmentName ||
        department.departmentName === departmentName
      ) {
        selected = department;
      } else if (departmentEnglishName !== departmentName) return department;
    });
    tempArray.unshift(selected);
    setDisplayDepartments(tempArray);
  }, [setSearchParams, departments.data]);

  return (
    <>
      <section id="search-results">
        <div className="container">
          <article className="results-header">
            <div className="header">
              <h1>
                {departmentName
                  ? departmentName
                  : `${
                      language === "English"
                        ? searchResultsTranslations[0].english
                        : language === "Chinese" &&
                          searchResultsTranslations[0].chinese
                    } "${search}"`}
              </h1>
            </div>
            <div className="btn-container">
              <button className="sort" onClick={() => setIsSortOpen(true)}>
                <TbArrowsSort />{" "}
                <span>
                  {language === "English"
                    ? searchResultsTranslations[1].english
                    : language === "Chinese" &&
                      searchResultsTranslations[1].chinese}
                </span>
              </button>
              <button className="filter" onClick={() => setIsFilterOpen(true)}>
                <FaSlidersH />{" "}
                <span>
                  {language === "English"
                    ? searchResultsTranslations[2].english
                    : language === "Chinese" &&
                      searchResultsTranslations[2].chinese}
                </span>
              </button>
            </div>
          </article>
          <article className="results">
            <div className="related-departments">
              {departments.status === "success" && (
                <p ref={displayDepartmentsRef}>
                  {language === "English"
                    ? searchResultsTranslations[3].english
                    : language === "Chinese" &&
                      searchResultsTranslations[3].chinese}{" "}
                  {departments?.status === "success" &&
                    departments?.data &&
                    displayDepartments != null &&
                    displayDepartments != undefined &&
                    Array.from(displayDepartments)?.map((department, index) => {
                      const { departmentId, departmentEnglishName } =
                        department;
                      return (
                        <span
                          key={index}
                          id={departmentId}
                          className={
                            departmentEnglishName === departmentName ||
                            department.departmentName === departmentName
                              ? "active"
                              : null
                          }
                          onClick={(e) => handleSetParams(e)}
                        >
                          {language === "English"
                            ? departmentEnglishName
                            : language === "Chinese" &&
                              department.departmentName}
                        </span>
                      );
                    })}
                </p>
              )}
            </div>
            <div className="showing-p">
              <p>
                {courses.status === "success"
                  ? `${
                      language === "English"
                        ? searchResultsTranslations[4].english
                        : language === "Chinese" &&
                          searchResultsTranslations[4].chinese
                    } ${displayResults.length > 0 ? pagesVisited + 1 : 0}-${
                      courses?.data &&
                      pagesVisited + resultsPerPage >
                        Array.from(courses?.data).length
                        ? Array.from(courses?.data).length
                        : pagesVisited + resultsPerPage
                    } ${
                      language === "English"
                        ? searchResultsTranslations[5].english
                        : language === "Chinese" &&
                          searchResultsTranslations[5].chinese
                    } ${courses?.data && Array.from(courses?.data).length} ${
                      language === "English"
                        ? searchResultsTranslations[6].english
                        : language === "Chinese" &&
                          searchResultsTranslations[6].chinese
                    }`
                  : language === "English"
                  ? searchResultsTranslations[7].english
                  : language === "Chinese" &&
                    searchResultsTranslations[7].chinese}
              </p>
            </div>
            <div className="courses">
              {courses.status === "error" && (
                <div className="error">
                  <h1 className="error-msg">
                    {language === "English"
                      ? searchResultsTranslations[8].english
                      : language === "Chinese" &&
                        searchResultsTranslations[8].chinese}
                  </h1>
                  <button onClick={() => resetFilter()}>
                    {language === "English"
                      ? searchResultsTranslations[9].english
                      : language === "Chinese" &&
                        searchResultsTranslations[9].chinese}
                  </button>
                </div>
              )}
              {courses.status === "loading" &&
                [...Array(5).keys()].map((i) => {
                  return <SingleCourseSkeleton key={i} />;
                })}
              {courses.status === "success" ? (
                displayResults.length > 0 ? (
                  displayResults?.map((result, index) => {
                    const {
                      courseId,
                      courseName,
                      courseEnglishName,
                      teacher,
                      time,
                      taughtInEnglish,
                      numberOfReviews,
                      overallRecommend,
                    } = result;
                    return (
                      <SingleCourse
                        key={index}
                        courseId={courseId}
                        courseName={courseName}
                        courseEnglishName={courseEnglishName}
                        teacher={teacher}
                        time={time}
                        taughtInEnglish={taughtInEnglish}
                        numberOfReviews={numberOfReviews}
                        overallRecommend={overallRecommend}
                        className="search"
                      />
                    );
                  })
                ) : (
                  <div className="no-reviews">
                    <h1>
                      {language === "English"
                        ? searchResultsTranslations[8].english
                        : language === "Chinese" &&
                          searchResultsTranslations[8].chinese}
                    </h1>
                    <button onClick={resetFilter}>
                      {language === "English"
                        ? searchResultsTranslations[9].english
                        : language === "Chinese" &&
                          searchResultsTranslations[9].chinese}
                    </button>
                  </div>
                )
              ) : null}
              {isDesktop && (
                <>
                  <Filter
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    refetch={courses.refetch}
                    isDesktop={isDesktop}
                    setPageNumber={setPageNumber}
                    className={
                      departments.status !== "success"
                        ? "search no-dep"
                        : "search"
                    }
                  />
                  <Sort
                    selectedSort={selectedSort}
                    setSelectedSort={setSelectedSort}
                    isSortOpen={isSortOpen}
                    setIsSortOpen={setIsSortOpen}
                    refetch={courses.refetch}
                    setPageNumber={setPageNumber}
                    isDesktop={isDesktop}
                    className={
                      departments.status === "success" ? "search dep" : "search"
                    }
                  />
                </>
              )}
            </div>
          </article>
          {courses.status === "success"
            ? displayResults?.length > 0 && (
                <footer>
                  {pageCount != null && courses.status === "success" && (
                    <ReactPaginate
                      previousLabel={<FaAngleLeft />}
                      nextLabel={<FaAngleRight />}
                      pageCount={pageCount}
                      onPageChange={changePage}
                      containerClassName={"pagination-btns"}
                      activeClassName={"pagination-active"}
                      disabledClassName={"pagination-disabled"}
                    />
                  )}
                  <p>
                    {courses.status === "success"
                      ? `${pagesVisited + 1}-${
                          courses?.data &&
                          pagesVisited + resultsPerPage >
                            Array.from(courses?.data).length
                            ? Array.from(courses?.data).length
                            : pagesVisited + resultsPerPage
                        } ${
                          language === "English"
                            ? searchResultsTranslations[5].english
                            : language === "Chinese" &&
                              searchResultsTranslations[5].chinese
                        } ${
                          courses?.data && Array.from(courses?.data).length
                        } ${
                          language === "English"
                            ? searchResultsTranslations[6].english
                            : language === "Chinese" &&
                              searchResultsTranslations[6].chinese
                        }`
                      : language === "English"
                      ? searchResultsTranslations[7].english
                      : language === "Chinese" &&
                        searchResultsTranslations[7].chinese}
                  </p>
                </footer>
              )
            : null}
          {isDesktop && <ChatbotDesktop isDesktop={isDesktop} />}
        </div>
        <Footer />
      </section>
      {!isDesktop && (
        <>
          <Filter
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            refetch={courses.refetch}
            setPageNumber={setPageNumber}
          />
          <Sort
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            isSortOpen={isSortOpen}
            setIsSortOpen={setIsSortOpen}
            refetch={courses.refetch}
            setPageNumber={setPageNumber}
          />
        </>
      )}
    </>
  );
};

export default SearchResults;

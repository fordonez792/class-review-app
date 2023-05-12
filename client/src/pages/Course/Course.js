import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ReviewsSection from "./ReviewsSection";
import CourseInfoSection from "./CourseInfoSection";
import RatingsSection from "./RatingsSection";
import ChatbotDesktop from "../Chatbot/ChatbotDesktop";
import Filter from "./Filter";
import Sort from "./Sort";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import useDebounce from "../../hooks/useDebounce";

import { courseTranslations } from "./courseTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";
import { useAuthStateContext } from "../../context/AuthStateContext";
import { getReviews } from "../../api/reviewsApi";
import { increaseVisited, getCourseById } from "../../api/coursesApi";

// The course specific page, divided into 3 sections, 3 files for better organization
// Being the main file it contains all the states for the filtering and sorting of the reviews, and the querying for the course information and reviews is also done here
// From here the user can write a review for this course as well as read reviews and information about the course itself, as well as the rating given to this course by other users in different criterias

const Course = () => {
  const { authState } = useAuthStateContext();
  const { language } = useLanguageContext();
  const { isTablet, isDesktop } = useScreenSizeContext();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 1000);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    sort: 0,
    sortName:
      language === "English" ? "Default" : language === "Chinese" && "默認",
    saved: false,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    courseId: id,
    search: "",
    rating: [],
    year: [],
    fall: null,
    spring: null,
    saved: false,
  });

  // Gets the information for this course by id
  const course = useQuery(["course", id], () => getCourseById(id));

  // Gets all reviews for the course
  const reviews = useQuery(
    ["reviews", selectedFilters, selectedSort],
    () => getReviews(selectedFilters, selectedSort.sort),
    {
      enabled: !!course?.data?.id,
    }
  );

  // Set the search to be the debounced value to get the posts with keyword
  useEffect(() => {
    setSelectedFilters({ ...selectedFilters, search: debouncedValue });
  }, [debouncedValue]);

  // correctly set the courseId in the filters
  useEffect(() => {
    if (course.data?.id)
      setSelectedFilters({ ...selectedFilters, courseId: course.data?.id });
  }, [course.data?.id]);

  // Check if page is being navigated to, if yes then increase the visited
  useEffect(() => {
    if (location.state?.navigate) {
      increaseVisited(id);
      navigate(location.pathname, {});
    }
  }, []);

  return (
    <>
      <section id="course">
        <div className="container">
          {course.status === "loading" && <Loading />}
          {course.status === "success" && (
            <>
              <article className="course-header">
                <div className="header">
                  <h1>
                    {language === "English"
                      ? course?.data.courseEnglishName
                      : language === "Chinese" && course?.data.courseName}
                  </h1>
                  <h3>
                    {language === "English"
                      ? course?.data.Department.departmentEnglishName
                      : language === "Chinese" &&
                        course?.data.Department.departmentName}
                  </h3>
                  {authState.loggedIn && (
                    <button
                      onClick={() =>
                        navigate(`/write-review/${course?.data.courseId}`)
                      }
                    >
                      {language === "English"
                        ? courseTranslations[0].english
                        : language === "Chinese" &&
                          courseTranslations[0].chinese}
                    </button>
                  )}
                </div>
              </article>
              <div className="desktop-container">
                <RatingsSection
                  numberOfReviews={course?.data.numberOfReviews}
                  overallDifficulty={course?.data.overallDifficulty}
                  overallEffectiveness={course?.data.overallEffectiveness}
                  overallEngaging={course?.data.overallEngaging}
                  overallFairAssessments={course?.data.overallFairAssessments}
                  overallRecommend={course?.data.overallRecommend}
                  isDesktop={isDesktop}
                />
                <CourseInfoSection
                  courseId={course?.data.courseId}
                  teacher={course?.data.teacher}
                  credits={course?.data.credits}
                  time={course?.data.time}
                  fallSemester={course?.data.fallSemester}
                  springSemester={course?.data.springSemester}
                  taughtInEnglish={course?.data.taughtInEnglish}
                />
              </div>
              {course?.data.overallRecommend !== 0 && (
                <div className="desktop-reviews-container">
                  <ReviewsSection
                    search={search}
                    setSearch={setSearch}
                    debouncedValue={debouncedValue}
                    reviews={reviews?.data}
                    status={reviews?.status}
                    refetch={reviews?.refetch}
                    isSortOpen={isSortOpen}
                    setIsSortOpen={setIsSortOpen}
                    selectedSort={selectedSort}
                    setSelectedSort={setSelectedSort}
                    setIsFilterOpen={setIsFilterOpen}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    isTablet={isTablet}
                    isDesktop={isDesktop}
                  />
                  {isDesktop && (
                    <Filter
                      selectedFilters={selectedFilters}
                      setSelectedFilters={setSelectedFilters}
                      isFilterOpen={isFilterOpen}
                      setIsFilterOpen={setIsFilterOpen}
                      refetch={reviews?.refetch}
                      isDesktop={isDesktop}
                      className="course"
                    />
                  )}
                </div>
              )}
            </>
          )}
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
            refetch={reviews.refetch}
          />
          <Sort
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            isSortOpen={isSortOpen}
            setIsSortOpen={setIsSortOpen}
            refetch={reviews.refetch}
          />
        </>
      )}
    </>
  );
};

export default Course;

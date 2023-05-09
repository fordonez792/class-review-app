import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import SingleCourse from "../../components/SingleCourse";
import SingleReview from "../../components/SingleReview";
import Footer from "../../components/Footer";
import ChatbotDesktop from "../Chatbot/ChatbotDesktop";
import Loading from "../../components/Loading";

import luis from "../../assets/luis.jpg";
import reviewPic from "../../assets/review_pic.jpg";
import robotPic from "../../assets/robot_pic.jpg";
import homePic from "../../assets/home_pic.jpg";
import { images } from "../../assets/images";
import { homeTranslations } from "./homeTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useSearchContext } from "../../context/SearchContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";
import { getMostRecentReviews } from "../../api/reviewsApi";
import { getPopularCourses } from "../../api/coursesApi";

// This will be the home page of this website
// It includes the top 5 most popular courses at the moment, top 5 most recent reviews
// A small description of the purpose of this website, a small description of advice on writing a review, and a small description of the addition of the chatbot and its uses and purposes

const Home = () => {
  const navigate = useNavigate();
  const { setIsSearchOpen } = useSearchContext();
  const { language } = useLanguageContext();
  const { isTablet, isDesktop } = useScreenSizeContext();

  const [position, setPosition] = useState(1);

  // Gets top 5 most popular courses at the moment
  const popular = useQuery(["popularCourses"], () => getPopularCourses());

  // Gets top 5 most recent reviews
  const reviews = useQuery(["reviews"], () => getMostRecentReviews());

  // Handles infite scrolling of the most recent reviews for users in mobile devices
  const handleScroll = (e) => {
    if (e.target.classList.contains("left-btn")) {
      if (position - 1 < 1) setPosition(5);
      if (position - 1 >= 1) setPosition(position - 1);
    }
    if (e.target.classList.contains("right-btn")) {
      if (position + 1 > 5) setPosition(1);
      if (position + 1 <= 5) setPosition(position + 1);
    }
  };

  return (
    <section id="home" className="page" onClick={(e) => console.log(e.target)}>
      <div className="container">
        <article className="picture">
          <img src={images[0].source} alt="image" />
          <p className={language === "Chinese" ? "chinese" : null}>
            {language === "English"
              ? homeTranslations[0].english
              : language === "Chinese" && homeTranslations[0].chinese}
          </p>
          <form
            className="searchbar"
            onClick={() => {
              setIsSearchOpen(true);
              if (isDesktop) window.scrollTo({ top: 351, behavior: "smooth" });
            }}
          >
            <label>
              <FaSearch />
            </label>
            <input
              name="search"
              type="text"
              placeholder={
                language === "English"
                  ? homeTranslations[1].english
                  : language === "Chinese" && homeTranslations[1].chinese
              }
              disabled={isDesktop ? false : true}
              autoComplete="off"
            />
          </form>
        </article>
        <article className="recent-reviews">
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[2].english
                : language === "Chinese" && homeTranslations[2].chinese}
            </h1>
          </div>
          {reviews.status === "loading" && <Loading />}
          {reviews.status === "success" && (
            <div className="recent-container">
              <div className="left-btn" onClick={(e) => handleScroll(e)}>
                <FaChevronCircleLeft />
              </div>
              {Array.from(reviews?.data).map((review, index) => {
                return (
                  <SingleReview
                    key={index}
                    review={review}
                    position={position}
                    index={index + 1}
                    refetch={reviews.refetch}
                    isTablet={isTablet}
                  />
                );
              })}
              <div className="right-btn" onClick={(e) => handleScroll(e)}>
                <FaChevronCircleRight />
              </div>
            </div>
          )}
        </article>
        <article className="popular">
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[3].english
                : language === "Chinese" && homeTranslations[3].chinese}
            </h1>
          </div>
          <ul className="popular-courses">
            {popular.status === "error" &&
              (language === "English"
                ? homeTranslations[4].english
                : language === "Chinese" && homeTranslations[4].chinese)}
            {popular.status === "loading" && <Loading />}
            {popular.status === "success" &&
              Array.from(popular.data).map((course, index) => {
                const {
                  courseId,
                  courseEnglishName,
                  courseName,
                  overallRecommend,
                  numberOfReviews,
                  teacher,
                  time,
                  Department,
                } = course;
                const { departmentEnglishName, departmentName } = Department;
                if (!isDesktop) {
                  return (
                    <li
                      key={index}
                      onClick={() =>
                        navigate(`/course/${courseId}`, {
                          state: { navigate: true },
                        })
                      }
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
                } else {
                  return (
                    <SingleCourse
                      key={index}
                      courseId={courseId}
                      courseName={courseName}
                      courseEnglishName={courseEnglishName}
                      overallRecommend={overallRecommend}
                      numberOfReviews={numberOfReviews}
                      teacher={teacher}
                      time={time}
                    />
                  );
                }
              })}
          </ul>
        </article>
        <article className="our-website">
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[10].english
                : language === "Chinese" && homeTranslations[10].chinese}
            </h1>
          </div>
          <div className="picture">
            <img src={luis} alt="" />
          </div>
          <div className="paragraph">
            <p>
              {language === "English"
                ? homeTranslations[6].english
                : language === "Chinese" && homeTranslations[6].chinese}
            </p>
          </div>
        </article>
        <article className="write-a-review">
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[5].english
                : language === "Chinese" && homeTranslations[5].chinese}
            </h1>
          </div>
          <div className="picture">
            <img src={reviewPic} alt="" />
          </div>
          <div className="paragraph">
            <p>
              {language === "English"
                ? homeTranslations[7].english
                : language === "Chinese" && homeTranslations[7].chinese}
            </p>
          </div>
        </article>
        <article className="chatbot-section">
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[11].english
                : language === "Chinese" && homeTranslations[11].chinese}
            </h1>
          </div>
          <div className="picture">
            <img src={robotPic} alt="" />
          </div>
          <div className="paragraph">
            <p>
              {language === "English"
                ? homeTranslations[8].english
                : language === "Chinese" && homeTranslations[8].chinese}
            </p>
          </div>
        </article>
        {isDesktop && <ChatbotDesktop isDesktop={isDesktop} />}
      </div>
      <Footer />
    </section>
  );
};

export default Home;

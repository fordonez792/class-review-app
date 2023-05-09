import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  FaStar,
  FaStarHalf,
  FaUserCircle,
  FaRegThumbsUp,
  FaThumbsUp,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

import { singleReviewTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";
import { useAuthStateContext } from "../context/AuthStateContext";
import { useScreenSizeContext } from "../context/ScreenSizeContext";
import { voteReview } from "../api/helpfulVotesApi";
import { deleteReview } from "../api/reviewsApi";
import { reportReview } from "../api/reportVotesApi";

// The single review card used to display single reviews throughout the website
// Allows users to read about the review and view the rating, as well as report and like a review
// Only the owner of a review can delete the review
// If the single reviews are displayed on my account page or home page, there is option to navigate to the course specific page where this review lies

const SingleReview = ({ review, debouncedValue, position, index, refetch }) => {
  const { authState } = useAuthStateContext();
  const { language } = useLanguageContext();
  const { isTablet, isDesktop } = useScreenSizeContext();

  const navigate = useNavigate();
  const {
    Course,
    HelpfulVotes,
    User,
    id,
    title,
    description,
    year,
    semester,
    recommend,
    anonymous,
    createdAt,
    courseId,
  } = review;
  const { photoUrl, numberOfReviews, numberOfHelpfulVotes, username } = User;

  const menuRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set the amount of time since posted
  const updated = new Date(createdAt);
  const today = new Date();
  const seconds = (today - updated) / 1000;
  const date = Math.floor(seconds / 60 / 60 / 24);

  // Highlight the description where there is a match with search
  const highlightedDescription =
    debouncedValue !== ""
      ? description.replaceAll(
          new RegExp(debouncedValue, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        )
      : null;

  // Highlight the title where there is a match with search
  const highlightedTitle =
    debouncedValue !== ""
      ? title.replaceAll(
          new RegExp(debouncedValue, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        )
      : null;

  const navigateCourse = () => {
    if (!Course) return;
    navigate(`/course/${Course.courseId}`, {
      state: { navigate: true },
    });
  };

  // Handles like and unlike of a post
  const helpfulVoteMutation = useMutation({
    mutationFn: voteReview,
    onSuccess: () => refetch(),
    onError: (error) => console.log(error),
  });

  // The option to delete the review but only if the one that clicked the option is the owner of the review
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => refetch(),
    onError: (error) => console.log(error),
  });

  // The option to report a review
  const reportReviewMutation = useMutation({
    mutationFn: reportReview,
    onError: (error) => console.log(error),
  });

  // Allows closing of menu that holds the report and delete option
  const closeMenu = (e) => {
    if (window.location.pathname === "/") return;
    if (
      e.target.classList.contains("menu") ||
      e.target.classList.contains("option") ||
      e.target.classList.contains("icon")
    )
      return;
    else {
      menuRef.current.classList.remove("active");
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div
      id="single-review"
      className={
        position
          ? position === index
            ? "center"
            : index === position + 1 || index === position - 4
            ? "right"
            : index === position + 2 || index === position - 3
            ? "right-most"
            : index === position + 4 || index === position - 1
            ? "left"
            : index === position + 3 || index === position - 2
            ? "left-most"
            : null
          : null
      }
      title={
        Course &&
        `${
          language === "English"
            ? Course.courseEnglishName
            : language === "Chinese" && Course.courseName
        } - ${Course.courseId}`
      }
    >
      <article className="user-info">
        <div className="photo">
          {anonymous ? (
            <FaUserCircle />
          ) : photoUrl ? (
            <img src={photoUrl} alt="" />
          ) : (
            <FaUserCircle />
          )}
        </div>
        <div className="user">
          <h1>
            {anonymous
              ? language === "English"
                ? singleReviewTranslations[0].english
                : language === "Chinese" && singleReviewTranslations[0].chinese
              : username}
          </h1>
          {!anonymous && (
            <p>{`${numberOfReviews} ${
              numberOfReviews === 1
                ? language === "English"
                  ? singleReviewTranslations[1].english
                  : language === "Chinese" &&
                    singleReviewTranslations[1].chinese
                : language === "English"
                ? singleReviewTranslations[2].english
                : language === "Chinese" && singleReviewTranslations[2].chinese
            } | ${numberOfHelpfulVotes} ${
              language === "English"
                ? singleReviewTranslations[3].english
                : language === "Chinese" && singleReviewTranslations[3].chinese
            }`}</p>
          )}
        </div>
        {!position && (
          <div className="options">
            <div className="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <BsThreeDotsVertical />
            </div>
            <ul
              className={`menu ${isMenuOpen ? "active" : null}`}
              ref={menuRef}
            >
              <li
                className="option"
                onClick={() => reportReviewMutation.mutate({ id })}
              >
                <FaExclamationCircle />
                {language === "English"
                  ? singleReviewTranslations[22].english
                  : language === "Chinese" &&
                    singleReviewTranslations[22].chinese}
              </li>
              {(authState.username === username || authState.admin) && (
                <li
                  className="option delete"
                  onClick={() => deleteReviewMutation.mutate({ id, courseId })}
                >
                  <FaTrash />
                  {language === "English"
                    ? singleReviewTranslations[4].english
                    : language === "Chinese" &&
                      singleReviewTranslations[4].chinese}
                </li>
              )}
            </ul>
          </div>
        )}
      </article>
      <article className="stars-container">
        <div className="stars">
          {[...Array(5).keys()].map((i) => {
            return (
              <div
                key={i}
                className={
                  recommend <= 0.3 + i
                    ? null
                    : recommend <= 0.7 + i
                    ? "half"
                    : recommend <= 0.9 + i
                    ? "full"
                    : "full"
                }
              >
                <FaStar className="fullStar" />
                {recommend >= 0.3 + i && recommend < 0.9 + i && (
                  <FaStarHalf className="halfStar" />
                )}
              </div>
            );
          })}
        </div>
        <p>{`${year} - ${semester}`}</p>
      </article>
      <article className="review-info">
        <h1
          dangerouslySetInnerHTML={{
            __html: highlightedTitle || title,
          }}
        />
        <p
          className="description"
          dangerouslySetInnerHTML={{
            __html: highlightedDescription || description,
          }}
        />
        {position && (
          <p className="link" onClick={() => navigateCourse()}>
            {isTablet
              ? language === "English"
                ? singleReviewTranslations[5].english
                : language === "Chinese" && singleReviewTranslations[5].chinese
              : ""}
            {"("}
            {language === "English"
              ? Course.courseEnglishName
              : language === "Chinese" && Course.courseName}
            {" - "}
            {Course.courseId}
            {")"}
          </p>
        )}
        {window.location.pathname === "/account" && (
          <p className="link">
            {language === "English"
              ? Course.courseEnglishName
              : language === "Chinese" && Course.courseName}
            {" - "}
            {Course.courseId}
          </p>
        )}
      </article>
      <article className="footer">
        <span onClick={() => helpfulVoteMutation.mutate({ id })}>
          {HelpfulVotes.some((item) => item.UserId === User.id) ? (
            <FaThumbsUp />
          ) : (
            <FaRegThumbsUp />
          )}
          {`(${HelpfulVotes.length}) ${
            isTablet || isDesktop
              ? language === "English"
                ? singleReviewTranslations[6].english
                : language === "Chinese" && singleReviewTranslations[6].chinese
              : ""
          }`}
        </span>
        <p>
          {language === "English"
            ? singleReviewTranslations[7].english
            : language === "Chinese" && singleReviewTranslations[7].chinese}
          {date === 0
            ? seconds < 60
              ? seconds === 1
                ? ` ${Math.floor(seconds)} ${
                    language === "English"
                      ? singleReviewTranslations[8].english
                      : language === "Chinese" &&
                        singleReviewTranslations[8].chinese
                  }`
                : ` ${Math.floor(seconds)} ${
                    language === "English"
                      ? singleReviewTranslations[9].english
                      : language === "Chinese" &&
                        singleReviewTranslations[9].chinese
                  }`
              : seconds < 60 * 60
              ? Math.floor(seconds / 60) === 1
                ? ` ${Math.floor(seconds / 60)} ${
                    language === "English"
                      ? singleReviewTranslations[10].english
                      : language === "Chinese" &&
                        singleReviewTranslations[10].chinese
                  }`
                : ` ${Math.floor(seconds / 60)} ${
                    language === "English"
                      ? singleReviewTranslations[11].english
                      : language === "Chinese" &&
                        singleReviewTranslations[11].chinese
                  }`
              : Math.floor(seconds / 60 / 60) === 1
              ? ` ${Math.floor(seconds / 60 / 60)} ${
                  language === "English"
                    ? singleReviewTranslations[12].english
                    : language === "Chinese" &&
                      singleReviewTranslations[12].chinese
                }`
              : ` ${Math.floor(seconds / 60 / 60)} ${
                  language === "English"
                    ? singleReviewTranslations[13].english
                    : language === "Chinese" &&
                      singleReviewTranslations[13].chinese
                }`
            : date < 7
            ? Math.floor(date) === 1
              ? ` ${date} ${
                  language === "English"
                    ? singleReviewTranslations[14].english
                    : language === "Chinese" &&
                      singleReviewTranslations[14].chinese
                }`
              : ` ${date} ${
                  language === "English"
                    ? singleReviewTranslations[15].english
                    : language === "Chinese" &&
                      singleReviewTranslations[15].chinese
                }`
            : date < 31
            ? Math.floor(date / 7) === 1
              ? ` ${Math.floor(date / 7)} ${
                  language === "English"
                    ? singleReviewTranslations[16].english
                    : language === "Chinese" &&
                      singleReviewTranslations[16].chinese
                }`
              : ` ${Math.floor(date / 7)} ${
                  language === "English"
                    ? singleReviewTranslations[17].english
                    : language === "Chinese" &&
                      singleReviewTranslations[17].chinese
                }`
            : date < 365
            ? Math.floor(date / 30) === 1
              ? ` ${Math.floor(date / 30)} ${
                  language === "English"
                    ? singleReviewTranslations[18].english
                    : language === "Chinese" &&
                      singleReviewTranslations[18].chinese
                }`
              : ` ${Math.floor(date / 30)} ${
                  language === "English"
                    ? singleReviewTranslations[19].english
                    : language === "Chinese" &&
                      singleReviewTranslations[19].chinese
                }`
            : Math.floor(date / 365) === 1
            ? ` ${Math.floor(date / 365)} ${
                language === "English"
                  ? singleReviewTranslations[20].english
                  : language === "Chinese" &&
                    singleReviewTranslations[20].chinese
              }`
            : ` ${Math.floor(date / 365)} ${
                language === "English"
                  ? singleReviewTranslations[21].english
                  : language === "Chinese" &&
                    singleReviewTranslations[21].chinese
              }`}
        </p>
      </article>
    </div>
  );
};

export default SingleReview;

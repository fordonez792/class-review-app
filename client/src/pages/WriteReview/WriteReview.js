import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import ReviewSearch from "./ReviewSearch";
import Ratings from "./Ratings";
import ReviewInfo from "./ReviewInfo";

import { criteria } from "../../assets/criteria";
import { writeReviewTranslations } from "./writeReviewTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { postReview } from "../../api/reviewsApi";

const WriteReview = () => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [courseId, setCourseId] = useState(id);
  const progressBarRef = useRef();

  const [step, setStep] = useState(id ? 1 : 0);
  const [ratings, setRatings] = useState([
    { name: criteria[0], selection: 0 },
    { name: criteria[1], selection: 0 },
    { name: criteria[2], selection: 0 },
    { name: criteria[3], selection: 0 },
    { name: criteria[4], selection: 0 },
  ]);
  const [reviewInfo, setReviewInfo] = useState({
    title: "",
    description: "",
    year: "",
    semester: "",
    anonymous: false,
  });
  const [error, setError] = useState({ msg: "", classname: "" });

  // Clear the error msg and set step to 0 so that the ratings can be rendered
  const handlePrev = () => {
    setStep((step) => step - 1);
    setError({ msg: "", classname: "" });
  };

  // Make sure the ratings are all filled out before going to next
  const handleNext = () => {
    if (step === 0 && !courseId) {
      setError({
        ...error,
        msg:
          language === "English"
            ? writeReviewTranslations[4].english
            : language === "Chinese" && writeReviewTranslations[4].chinese,
      });
      return;
    }
    if (step === 0 && courseId) {
      setError({ msg: "", classname: "" });
      setStep(1);
      return;
    }
    if (step === 1 && courseId) {
      setError({ msg: "", classname: "" });
      const remaining = ratings.filter((rating) => {
        if (rating.selection === 0) return rating;
        return;
      });
      if (remaining.length > 0) {
        setError({
          ...error,
          msg:
            language === "English"
              ? writeReviewTranslations[5].english
              : language === "Chinese" && writeReviewTranslations[5].chinese,
        });
        return;
      }
      setStep(2);
    }
  };

  const createReviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess: (data) => {
      if (data.status === "FAILED") return;
      navigate(`/course/${courseId}`, { state: { navigate: true } });
    },
    onError: (error) => console.log(error),
  });

  // Make sure every input is filled before submitting
  const handleSubmit = (e) => {
    e.preventDefault();
    if (reviewInfo.title === "") {
      setError({
        ...error,
        msg:
          language === "English"
            ? writeReviewTranslations[6].english
            : language === "Chinese" && writeReviewTranslations[6].chinese,
      });
      return;
    }
    if (reviewInfo.description === "") {
      setError({
        ...error,
        msg:
          language === "English"
            ? writeReviewTranslations[7].english
            : language === "Chinese" && writeReviewTranslations[7].chinese,
      });
      return;
    }
    if (reviewInfo.semester === "") {
      setError({
        ...error,
        msg:
          language === "English"
            ? writeReviewTranslations[8].english
            : language === "Chinese" && writeReviewTranslations[8].chinese,
      });
      return;
    }
    if (reviewInfo.year === 0) {
      setError({
        ...error,
        msg:
          language === "English"
            ? writeReviewTranslations[9].english
            : language === "Chinese" && writeReviewTranslations[9].chinese,
      });
    }
    createReviewMutation.mutate({ ratings, reviewInfo, courseId });
  };

  useEffect(() => {
    if (step === 0) {
      progressBarRef.current.style.setProperty("--progress", "0%");
    }
    if (step === 1) {
      progressBarRef.current.style.setProperty("--progress", "33%");
    }
    if (step === 2) {
      progressBarRef.current.style.setProperty("--progress", "66%");
    }
  }, [step, setStep]);

  // Clear the error msg after 3 seconds
  useEffect(() => {
    if (error.msg === "") return;
    const timeout = setTimeout(
      () => setError({ msg: "", classname: "" }),
      3000
    );

    return () => clearTimeout(timeout);
  }, [error, setError]);

  // Prevents users that are not logged in from coming to this page
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <section id="write-review">
      <div className="container">
        <div className="progress-bar" ref={progressBarRef}></div>
        <article className={`header ${step === 0 && "less"}`}>
          <h1>
            {language === "English"
              ? writeReviewTranslations[0].english
              : language === "Chinese" && writeReviewTranslations[0].chinese}
          </h1>
        </article>
        {step === 0 && (
          <ReviewSearch
            courseId={courseId}
            setCourseId={setCourseId}
            setStep={setStep}
            error={error}
            setError={setError}
          />
        )}
        {step === 1 && <Ratings ratings={ratings} setRatings={setRatings} />}
        {step === 2 && (
          <ReviewInfo
            reviewInfo={reviewInfo}
            setReviewInfo={setReviewInfo}
            error={error}
            setError={setError}
          />
        )}
        {step === 1 && (
          <div className="error-container">
            {error !== "" && (
              <span className={error.classname}>{error.msg}</span>
            )}
          </div>
        )}
        <article className="btn-container">
          <button
            className={step === 0 ? "hide" : null}
            onClick={() => handlePrev()}
          >
            {language === "English"
              ? writeReviewTranslations[1].english
              : language === "Chinese" && writeReviewTranslations[1].chinese}
          </button>
          <button
            className={step === 0 ? "bottom" : null}
            onClick={step === 2 ? (e) => handleSubmit(e) : () => handleNext()}
          >
            {step === 2
              ? language === "English"
                ? writeReviewTranslations[2].english
                : language === "Chinese" && writeReviewTranslations[2].chinese
              : language === "English"
              ? writeReviewTranslations[3].english
              : language === "Chinese" && writeReviewTranslations[3].chinese}
          </button>
        </article>
      </div>
    </section>
  );
};

export default WriteReview;

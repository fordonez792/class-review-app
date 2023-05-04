import React from "react";
import { FaStar } from "react-icons/fa";

// The loading stage of the single course cards, displays a skeleton of the single course, only used when loading the single course data

const SingleCourseSkeleton = () => {
  return (
    <article id="skeleton-single-course">
      <div className="header skeleton"></div>
      <div className="reviews">
        <div className="stars">
          {[...Array(5).keys()].map((i) => {
            return (
              <div key={i}>
                <FaStar className="fullStar" />
              </div>
            );
          })}
        </div>
        <div className="review skeleton"></div>
      </div>
      <div className="class-info">
        <div className="courseID skeleton"></div>
        <div className="teacher skeleton"></div>
      </div>
      <div className="btn-container">
        <div className="btn skeleton"></div>
        <div className="btn skeleton"></div>
      </div>
    </article>
  );
};

export default SingleCourseSkeleton;

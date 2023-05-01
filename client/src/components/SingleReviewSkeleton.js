import React from "react";
import { FaStar, FaThumbsUp } from "react-icons/fa";

const SingleReviewSkeleton = () => {
  return (
    <div id="skeleton-single-review">
      <article className="user-info">
        <div className="photo skeleton"></div>
        <div className="user">
          <div className="username skeleton"></div>
          <div className="contributions skeleton"></div>
        </div>
      </article>
      <article className="stars-container">
        <div className="stars">
          {[...Array(5).keys()].map((i) => {
            return (
              <div key={i}>
                <FaStar className="fullStar" />
              </div>
            );
          })}
        </div>
        <div className="year skeleton"></div>
      </article>
      <article className="review-info">
        <div className="title skeleton"></div>
        <div className="description">
          <div className="description-line skeleton"></div>
          <div className="description-line skeleton"></div>
          <div className="description-line skeleton"></div>
          <div className="description-line skeleton"></div>
          <div className="description-line skeleton"></div>
        </div>
      </article>
      <article className="footer">
        <span>
          <FaThumbsUp />
          <div className="helpful-votes skeleton"></div>
        </span>
        <div className="date skeleton"></div>
      </article>
    </div>
  );
};

export default SingleReviewSkeleton;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaInfoCircle } from "react-icons/fa";

import SingleReview from "../../components/SingleReview";
import SingleReviewSkeleton from "../../components/SingleReviewSkeleton";
import Footer from "../../components/Footer";

import { useAuthStateContext } from "../../context/AuthStateContext";
import { getReportedReviews, getAllReviews } from "../../api/reviewsApi";
import { getAllUsers } from "../../api/usersApi";
import { getNumberOfCoursesWithReviews } from "../../api/coursesApi";

// Admin page specific for the single admin user, only accessible to him
// Has access some server and database information, such as the number of users that signed up, total number of reviews, total number of courses with reviews, and most importantly all reviews that have 10 or more report votes
// Admin has the power to moderate this reviews and decide if they should be deleted

const Admin = () => {
  const navigate = useNavigate();
  const { authState } = useAuthStateContext();

  // Returns all reviews that have 10 or more report votes
  const reportedReviews = useQuery(["reportedReviews"], () =>
    getReportedReviews()
  );

  // Gets the total number of reviews that have been submitted to the db
  const totalNumberOfReviews = useQuery(["totalNumberOfReviews"], () =>
    getAllReviews()
  );

  // Gets the total number of users that have signed up to use the website
  const totalNumberOfUsers = useQuery(["totalNumberOfUsers"], () =>
    getAllUsers()
  );

  // Gets the total number of courses that have reviews written to them
  const totalNumberOfCoursesWithReviews = useQuery(
    ["totalNumberOfCoursesWithReviews"],
    () => getNumberOfCoursesWithReviews()
  );

  // Only allows for the admin to navigate to this page, if not admin then redirected to the home page
  useEffect(() => {
    if (!authState) return;
    if (!localStorage.getItem("accessToken")) navigate("/");
    if (authState.id === 0 || authState.username === "") navigate("/");
    if (!authState.admin) navigate("/");
  }, [authState, authState.admin]);

  return (
    <section id="admin">
      <div className="container">
        <article className="header">
          <h1>Admin Panel</h1>
        </article>
        <article className="database-info">
          <div className="header">
            <FaInfoCircle />
            <h1>Database Info</h1>
          </div>
          <ul className="info">
            <li>
              <span>Total Number of Reviews:</span>
              <span>{totalNumberOfReviews?.data}</span>
            </li>
            <li>
              <span>Total Number of Users:</span>
              <span>{totalNumberOfUsers?.data}</span>
            </li>
            <li>
              <span>Courses With Reviews:</span>
              <span>{totalNumberOfCoursesWithReviews?.data}</span>
            </li>
          </ul>
        </article>
        <article className="reported-reviews">
          <div className="header">
            <h1>Reported Reviews</h1>
          </div>
          <div className="reviews">
            {reportedReviews?.status === "loading" &&
              [...Array(5).keys()].map((i) => {
                return <SingleReviewSkeleton key={i} />;
              })}
            {reportedReviews?.status === "success" &&
            Array.from(reportedReviews?.data)?.length > 0 ? (
              Array.from(reportedReviews?.data)?.map((review, index) => {
                return (
                  <SingleReview
                    key={index}
                    review={review}
                    refetch={reportedReviews?.refetch}
                  />
                );
              })
            ) : (
              <div className="no-reviews">
                <h1>No Reviews Found</h1>
              </div>
            )}
          </div>
        </article>
      </div>
      <Footer />
    </section>
  );
};

export default Admin;

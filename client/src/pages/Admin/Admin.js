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

const Admin = () => {
  const navigate = useNavigate();
  const { authState } = useAuthStateContext();

  const reportedReviews = useQuery(["reportedReviews"], () =>
    getReportedReviews()
  );

  const totalNumberOfReviews = useQuery(["totalNumberOfReviews"], () =>
    getAllReviews()
  );

  const totalNumberOfUsers = useQuery(["totalNumberOfUsers"], () =>
    getAllUsers()
  );

  const totalNumberOfCoursesWithReviews = useQuery(
    ["totalNumberOfCoursesWithReviews"],
    () => getNumberOfCoursesWithReviews()
  );

  useEffect(() => {
    if (!authState) return;
    if (!localStorage.getItem("accessToken")) navigate("/");
    if (authState.id === 0 || authState.username === "") return;
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

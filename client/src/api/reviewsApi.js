import axios from "axios";

// Exclusive for signed up users, creates a review in the db
export const postReview = ({ ratings, reviewInfo, courseId }) => {
  return axios
    .post(
      `${process.env.REACT_APP_URL}reviews/create`,
      { ratings, reviewInfo, courseId },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )
    .then((res) => res.data);
};

// Gets all reviews that correspond to a course
export const getReviewsByCourseId = (courseId) => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/get-by-courseId/${courseId}`)
    .then((res) => res.data);
};

// Gets all reviews for a course that match the filter and sorting criteria set up by the user
export const getReviews = (selectedFilters, selectedSort) => {
  const { courseId, search, rating, year, fall, spring } = selectedFilters;
  return axios
    .get(
      `${
        process.env.REACT_APP_URL
      }reviews/filter/?courseId=${courseId}&search=${search}&rating=${Array.from(
        rating
      ).join(".")}&year=${Array.from(year).join(
        "."
      )}&fall=${fall}&spring=${spring}&sort=${selectedSort}`
    )
    .then((res) => res.data);
};

// Gets the 5 most recent reviews written
export const getMostRecentReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/recent`)
    .then((res) => res.data);
};

// Allows the admin or the user that wrote the review to delete it
export const deleteReview = ({ id, courseId }) => {
  return axios
    .delete(`${process.env.REACT_APP_URL}reviews/delete/${id}/${courseId}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

// Only for admin, gets all reviews that have more than 10 reports from different users, allowing for admin to moderate the reviews
export const getReportedReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/reported`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

// Only for admin, gets the total number of reviews that have been submitted to the db by users
export const getAllReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/number-of-reviews`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

import axios from "axios";

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

export const getReviewsByCourseId = (courseId) => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/get-by-courseId/${courseId}`)
    .then((res) => res.data);
};

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

export const getMostRecentReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/recent`)
    .then((res) => res.data);
};

export const deleteReview = ({ id, courseId }) => {
  return axios
    .delete(`${process.env.REACT_APP_URL}reviews/delete/${id}/${courseId}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

export const getReportedReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/reported`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

export const getAllReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}reviews/number-of-reviews`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

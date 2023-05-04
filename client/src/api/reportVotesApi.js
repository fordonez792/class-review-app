import axios from "axios";

// Allows users to report a review
export const reportReview = ({ id }) => {
  return axios
    .post(
      `${process.env.REACT_APP_URL}report-votes`,
      { reviewId: id },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((res) => res.data);
};

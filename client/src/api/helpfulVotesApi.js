import axios from "axios";

// Allows user to give a helpful vote a review and store in db
export const voteReview = ({ id }) => {
  return axios
    .post(
      `${process.env.REACT_APP_URL}helpful-votes`,
      { reviewId: id },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((res) => res.data);
};

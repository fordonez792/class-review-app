import axios from "axios";

export const voteReview = ({ id }) => {
  return axios
    .post(
      `${process.env.REACT_APP_URL}helpful-votes`,
      { reviewId: id },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((res) => res.data);
};

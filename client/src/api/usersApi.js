import axios from "axios";

// Allows signed up users to view their reviews and account info
export const getAccount = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}users/account`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

// Only for admin, returns the total number of users signed up for the website service
export const getAllUsers = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}users/number-of-users`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

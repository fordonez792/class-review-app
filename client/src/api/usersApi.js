import axios from "axios";

export const getAccount = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}users/account`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

export const getAllUsers = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}users/number-of-users`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};

import React from "react";
import { Navigate } from "react-router-dom";

import Loading from "../components/Loading";

const ProtectedRouteAdmin = ({ admin, loggedIn, children }) => {
  if (admin === null || loggedIn === null) return <Loading />;
  if (admin === false || loggedIn === false) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRouteAdmin;

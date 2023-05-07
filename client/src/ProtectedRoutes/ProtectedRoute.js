import React from "react";
import { Navigate } from "react-router-dom";

import Loading from "../components/Loading";

const ProtectedRoute = ({ loggedIn, children }) => {
  if (loggedIn === null) return <Loading />;
  if (loggedIn === false) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;

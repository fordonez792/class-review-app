import "./style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import EmailVerification from "./components/EmailVerification";
import Error from "./pages/Error/Error";
import Navbar from "./components/Navbar";
import Chatbot from "./pages/Chatbot/Chatbot";
import SearchResults from "./pages/SearchResults/SearchResults";
import WriteReview from "./pages/WriteReview/WriteReview";
import Course from "./pages/Course/Course";
import Account from "./pages/Account/Account";
import Admin from "./pages/Admin/Admin";

import { useScreenSizeContext } from "./context/ScreenSizeContext";

// This file contains all the routes for this website

const App = () => {
  const { isDesktop } = useScreenSizeContext();

  return (
    <Router>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/search/:search" element={<SearchResults />} />
          <Route
            path="/search/:departmentID/:collegeID/:filter"
            element={<SearchResults />}
          />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/write-review/:id" element={<WriteReview />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route
          exact
          path="/email-verification/:id/:token"
          element={<EmailVerification />}
        />
        {!isDesktop && <Route exact path="/chatbot" element={<Chatbot />} />}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;

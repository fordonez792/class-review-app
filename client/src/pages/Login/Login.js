import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import axios from "axios";

import { useAuthStateContext } from "../../context/AuthStateContext";
import { useLanguageContext } from "../../context/LanguageContext";
import { loginTranslations } from "./loginTranslations";

// This is the login page for users
// Allows for login using google verification services as well as local accounts
// If user wants to log in regardless of the method, ndhu email address must be used, only ndhu students are allowed to create accounts in this website
// If user signed up locally but never verified their email address, they must verify it before they can be logged in
// Users can also navigate to the sign up page to create an account locally if they prefer

const Login = () => {
  const { language } = useLanguageContext();
  const { setAuthState, googleSignIn } = useAuthStateContext();

  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [field, setField] = useState("");
  const [error, setError] = useState({ msg: "", classname: "" });
  const [viewPassword, setViewPassword] = useState(false);

  useEffect(() => {
    if (usernameOrEmail.split("@", 2)[1]) setField("EMAIL");
    else setField("USERNAME");
  }, [usernameOrEmail]);

  // Resets the error message after 10 seconds
  useEffect(() => {
    setTimeout(() => setError(""), 10000);
  }, [error, setError]);

  // Handles google sign in allowing only for ndhu email domains and then passing data to server to add a user to db
  // Returns an access token that is later used to persist the login and verify the user
  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    setError({
      msg:
        language === "English"
          ? loginTranslations[8].english
          : language === "Chinese" && loginTranslations[8].chinese,
      classname: "green",
    });
    googleSignIn()
      .then((res) => {
        const { displayName, uid, email, photoURL } = res.user.providerData[0];
        // Check if the email the user choose to authenticate with google is an NDHU email, if not then can't accept
        if (email.split("@", 2)[1] !== "gms.ndhu.edu.tw") {
          setError({
            ...error,
            msg:
              language === "English"
                ? loginTranslations[9].english
                : language === "Chinese" && loginTranslations[9].chinese,
          });
          return;
        }
        // If the email is NDHU email then input the data into database
        axios
          .post(`${process.env.REACT_APP_URL}users/signup-google`, {
            username: displayName,
            email,
            photoUrl: photoURL,
          })
          .then((res) => {
            if (res.data.status === "FAILED")
              setError({ msg: res.data.message, classname: null });
            // If success then set the authState to logged in
            if (res.data.status === "SUCCESS") {
              setAuthState({
                username: displayName,
                id: uid,
                loggedIn: true,
              });
            }
          })
          .catch((error) => console.log(error));

        // Now set the accessToken in the localstorage and navigate to home
        res.user
          .getIdToken()
          .then((accessToken) => {
            localStorage.setItem("accessToken", accessToken);
            navigate("/");
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  // Handles local account login, after data is verified with server, user can proceed logged in, if user never verified their email, another email will be sent so they can verify
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send data to backend to store in database
    axios
      .post(`${process.env.REACT_APP_URL}users/login`, {
        field,
        usernameOrEmail,
        password,
      })
      .then((res) => {
        if (res.data.status === "FAILED")
          setError({ msg: res.data.message, classname: null });
        // Second step is to verify the email that user used
        if (res.data.status === "VERIFY_EMAIL") {
          setError({ msg: res.data.message, classname: "green" });
          setUsernameOrEmail("");
          setPassword("");
        }
        // Third step is to set the authState to loggedIn and the accessToken in the localstorage
        if (res.data.status === "SUCCESS") {
          localStorage.setItem("accessToken", res.data.accessToken);
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            loggedIn: true,
          });
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="page" id="login">
      <div className="container">
        <article className="login-container">
          <div className="header">
            <h1>
              {language === "English"
                ? loginTranslations[0].english
                : language === "Chinese" && loginTranslations[0].chinese}
            </h1>
          </div>
          <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
            <div className="error-container">
              {error !== "" && (
                <span className={error.classname}>{error.msg}</span>
              )}
            </div>

            <div className="field-container">
              <label>
                <FaUserAlt />
              </label>
              <input
                autoComplete="off"
                name="username"
                placeholder={
                  language === "English"
                    ? loginTranslations[1].english
                    : language === "Chinese" && loginTranslations[1].chinese
                }
                className="input-field"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>

            <div className="field-container">
              <label>
                <FaLock />
              </label>
              <input
                autoComplete="off"
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder={
                  language === "English"
                    ? loginTranslations[2].english
                    : language === "Chinese" && loginTranslations[2].chinese
                }
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className={`view-password ${password && "active"}`}
                onClick={() => setViewPassword(!viewPassword)}
              >
                {viewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
            <button type="submit" onSubmit={(e) => handleSubmit(e)}>
              {language === "English"
                ? loginTranslations[0].english
                : language === "Chinese" && loginTranslations[0].chinese}
            </button>
            <div className="or">
              <div></div>
              <p>
                {language === "English"
                  ? loginTranslations[4].english
                  : language === "Chinese" && loginTranslations[4].chinese}
              </p>
              <div></div>
            </div>
            <button
              className="googleBtn"
              onClick={(e) => handleGoogleSignIn(e)}
            >
              <FaGoogle />
            </button>
          </form>
        </article>
        <article className="new-here">
          <div className="header">
            <h1>
              {language === "English"
                ? loginTranslations[5].english
                : language === "Chinese" && loginTranslations[5].chinese}
            </h1>
          </div>
          <p>
            {language === "English"
              ? loginTranslations[6].english
              : language === "Chinese" && loginTranslations[6].chinese}
          </p>
          <button onClick={() => navigate("/signup")}>
            {language === "English"
              ? loginTranslations[7].english
              : language === "Chinese" && loginTranslations[7].chinese}
          </button>
        </article>
      </div>
    </section>
  );
};

export default Login;

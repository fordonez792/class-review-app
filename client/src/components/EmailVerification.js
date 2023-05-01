import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

import { useLanguageContext } from "../context/LanguageContext";
import { emailVerificationTranslations } from "../assets/componentsTranslations";

const EmailVerification = () => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const { id, token } = useParams();

  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_URL}email-verification/verify-token`, {
        id,
        token,
      })
      .then((res) => {
        if (res.data.status === "FAILED") setVerified(false);
        if (res.data.status === "SUCCESS") setVerified(true);
        setMessage(res.data.message);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <section className="page" id="email-verification">
      <div className="container">
        <article className="status">
          <div className={`icon ${verified ? "success" : "error"}`}>
            {verified ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="header">
            <h1>
              {verified
                ? language === "English"
                  ? emailVerificationTranslations[0].english
                  : language === "Chinese" &&
                    emailVerificationTranslations[0].chinese
                : language === "English"
                ? emailVerificationTranslations[1].english
                : language === "Chinese" &&
                  emailVerificationTranslations[1].chinese}
            </h1>
          </div>
        </article>
        <article className="status-message">
          {verified ? (
            <p>
              {language === "English"
                ? emailVerificationTranslations[2].english
                : language === "Chinese" &&
                  emailVerificationTranslations[2].chinese}
            </p>
          ) : (
            <p>
              {language === "English"
                ? emailVerificationTranslations[3].english
                : language === "Chinese" &&
                  emailVerificationTranslations[3].chinese}
            </p>
          )}
          <button onClick={() => navigate("/login")}>
            {verified
              ? language === "English"
                ? emailVerificationTranslations[4].english
                : language === "Chinese" &&
                  emailVerificationTranslations[4].chinese
              : language === "English"
              ? emailVerificationTranslations[5].english
              : language === "Chinese" &&
                emailVerificationTranslations[5].chinese}
          </button>
        </article>
      </div>
    </section>
  );
};

export default EmailVerification;

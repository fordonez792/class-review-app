import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

import Footer from "../../components/Footer";
import SingleReviewSkeleton from "../../components/SingleReviewSkeleton";
import SingleReview from "../../components/SingleReview";
import ChatbotDesktop from "../Chatbot/ChatbotDesktop";

import { getAccount } from "../../api/usersApi";
import { accountTranslations } from "./accountTranslations";
import { useLanguageContext } from "../../context/LanguageContext";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// This is the Account page, displays the main information for a user, username, photo if one, number of contributions, and number of helpful votes received in all their reviews
// Also all their reviews will be displayed in this page, with the option of navigating to the specific course page that a review belongs to

const Account = () => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();
  const navigate = useNavigate();

  // Gets the account information including the information specific to the user logged in, as well as all the reviews this user has written
  const {
    status,
    data: account,
    refetch,
  } = useQuery(["account"], () => getAccount());

  // Prevents users that are not logged in from coming to this page
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <section id="account">
      <div className="container">
        {status === "loading" && (
          <article className="profile-skeleton">
            <div className="picture skeleton"></div>
            <div className="header skeleton"></div>
            <div className="info skeleton"></div>
          </article>
        )}
        {status === "success" && (
          <article className="profile">
            <div className="picture">
              {account?.user?.photoUrl ? (
                <img src={account?.user?.photoUrl} alt="" />
              ) : (
                <FaUserAlt />
              )}
            </div>
            <div className="header">
              <h1>{account?.user?.username}</h1>
            </div>
            <div className="info">
              <p>
                <span>{account?.user?.numberOfReviews}</span>{" "}
                {language === "English"
                  ? accountTranslations[0].english
                  : language === "Chinese" &&
                    accountTranslations[0].chinese}{" "}
                | <span>{account?.user?.numberOfHelpfulVotes}</span>{" "}
                {language === "English"
                  ? accountTranslations[1].english
                  : language === "Chinese" && accountTranslations[1].chinese}
              </p>
            </div>
          </article>
        )}
        <article className="my-reviews">
          <div className="header">
            {status === "loading" && <div className="title skeleton"></div>}
            {status === "success" && (
              <h1>
                {language === "English"
                  ? accountTranslations[2].english
                  : language === "Chinese" && accountTranslations[2].chinese}
              </h1>
            )}
          </div>
          <div className="reviews">
            {status === "loading" &&
              [...Array(5).keys()].map((i) => {
                return <SingleReviewSkeleton key={i} />;
              })}
            {status === "success" &&
            Array?.from(account?.reviews)?.length > 0 ? (
              Array?.from(account?.reviews)?.map((review, index) => {
                return (
                  <SingleReview key={index} review={review} refetch={refetch} />
                );
              })
            ) : (
              <div className="no-reviews">
                <h1>
                  {language === "English"
                    ? accountTranslations[3].english
                    : language === "Chinese" && accountTranslations[3].chinese}
                </h1>
                <button onClick={() => navigate("/write-review")}>
                  {language === "English"
                    ? accountTranslations[4].english
                    : language === "Chinese" && accountTranslations[4].chinese}
                </button>
              </div>
            )}
          </div>
        </article>
        {isDesktop && <ChatbotDesktop isDesktop={isDesktop} />}
      </div>
      <Footer />
    </section>
  );
};

export default Account;

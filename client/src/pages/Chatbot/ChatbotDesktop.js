import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

import { useLanguageContext } from "../../context/LanguageContext";
import { chatbotTranslations } from "./chatbotTranslations";

import Chatbot from "./Chatbot";

const ChatbotDesktop = ({ isDesktop }) => {
  const { language } = useLanguageContext();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const closeMessage = (e) => {
    e.target.parentElement.style.display = "none";
  };

  return (
    <>
      {!isChatbotOpen && (
        <article id="chatbot-desktop">
          <div onClick={() => setIsChatbotOpen(true)}>
            <FaRobot />
          </div>
          <p
            onClick={(e) => {
              if (e.target.classList.contains("close")) return;
              setIsChatbotOpen(true);
            }}
          >
            <FaTimes className="close" onClick={(e) => closeMessage(e)} />
            <span>
              {language === "English"
                ? chatbotTranslations[0].english
                : language === "Chinese" && chatbotTranslations[0].chinese}
            </span>
          </p>
        </article>
      )}
      {isChatbotOpen && (
        <Chatbot isDesktop={isDesktop} setIsChatbotOpen={setIsChatbotOpen} />
      )}
    </>
  );
};

export default ChatbotDesktop;

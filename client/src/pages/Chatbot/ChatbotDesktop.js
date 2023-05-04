import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

import { useLanguageContext } from "../../context/LanguageContext";
import { chatbotTranslations } from "./chatbotTranslations";

import Chatbot from "./Chatbot";

// The container for the chatbot when the screen is desktop size
// This container is visible in most of the pages of the website, on click it opens the chatbot and user can start interacting with it
// User also has the option of closing the chatbot and reseting the chat

const ChatbotDesktop = () => {
  const { language } = useLanguageContext();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Closes the message that asks the user if they need help
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
      {isChatbotOpen && <Chatbot setIsChatbotOpen={setIsChatbotOpen} />}
    </>
  );
};

export default ChatbotDesktop;

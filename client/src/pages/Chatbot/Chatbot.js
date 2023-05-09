import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronRight } from "react-icons/fa";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { userOptions } from "../../assets/chatbotOptions";
import {
  sendMessage,
  getCoursesWithChatbot,
  getCoursesByNameOrIdChatbot,
} from "../../api/chatbotApi";
import { useScreenSizeContext } from "../../context/ScreenSizeContext";

// The page that allows users to interact with the chatbot
// Users can only send predetermined messages to the chatbot for the most part
// If user knows the course id or name of a course they are able to type it in, or users can also type their interests, and the chatbot will find the appropriate department that matches users interests
// Chatbot can then filter out courses by 3 methods, time, rating and course level
// From there the chatbot will send specific messages allowing the user to click on the message to be redirected to the course specific page or the search results
// If user chose incorrectly they can also click cancel and the previous message and options will again appear

const Chatbot = ({ setIsChatbotOpen }) => {
  const { isDesktop } = useScreenSizeContext();

  const navigate = useNavigate();
  const resizeRef = useRef();
  const scrollBottomRef = useRef();
  const buttonRef = useRef();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [parameters, setParameters] = useState({});
  const [step, setStep] = useState(1);

  // Handles query by name or id
  const sendNameOrIdMutation = useMutation({
    mutationFn: getCoursesByNameOrIdChatbot,
    onSuccess: (data) => {
      setMessageList((prev) => [
        ...prev,
        {
          message: data.message,
          author: data.author,
          courseId: data.courseId,
          query: data.query,
        },
      ]);
    },
    onError: (error) => console.log(error),
  });

  // Handles getting the amount of courses found with the filters placed
  const getCoursesMutation = useMutation({
    mutationFn: getCoursesWithChatbot,
    onSuccess: (data) => {
      setMessageList((prev) => [
        ...prev,
        {
          message: data.message,
          author: data.author,
          departmentId: data.departmentId,
          department: data.department,
          collegeId: data.collegeId,
          courseId: data.courseId,
          filter: data.filter,
        },
      ]);
    },
    onError: (error) => console.log(error),
  });

  // Handles sending a message to chatbot and backend
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      // Sets the message and if it is a link then also sets the parameters on the message
      setMessageList((prev) => [
        ...prev,
        {
          message: data.message,
          author: data.author,
          departmentId: data.departmentId,
          department: data.department,
          collegeId: data.collegeId,
          filter: data.filter,
        },
      ]);
      if (
        data.message.toLowerCase().includes("sorry") ||
        data.message.toLowerCase().includes("missed")
      ) {
        setStep((step) => step - 1);
      } else {
        if (step === 3 || step === 5 || step === 6 || step === 7) {
          setParameters(data.parameters);
        }
        setIsTyping(false);
      }
    },
    onError: (error) => console.log(error),
  });

  // Gets the amount of courses found with the filters chosen
  useEffect(() => {
    if (!parameters || Object.keys(parameters).length === 0) return;
    getCoursesMutation.mutate(parameters);
  }, [parameters]);

  // Navigates to the results of the query done through the chatbot
  const navigateResults = (e) => {
    if (!e.target.classList.contains("navigate")) return;
    const departmentId = e.target.dataset.department;
    const filter = e.target.dataset.filter;
    const collegeId = e.target.dataset.college;
    const department = e.target.dataset.departmentname;
    const courseId = e.target.dataset.course;
    const query = e.target.dataset.query;

    // If user inputs courseId then go to the course specific page
    if (courseId) {
      navigate(`/course/${courseId}`, { state: { navigate: true } });
      return;
    }
    // If it is a query string then display results for the query string
    if (query) {
      navigate(`/search/${query}`);
      return;
    }
    // If done by filtering then go to results with the following parameters
    navigate({
      pathname: "/search/",
      // Search parameters for the courses
      search: createSearchParams({
        collegeId,
        department,
        departmentId,
        filter,
      }).toString(),
    });
  };

  // Handles sending a typed message to the chatbot and backend
  const sendResponse = (e) => {
    e.preventDefault();
    setMessageList((prev) => [...prev, { message, author: "user" }]);
    setMessage("");
    resizeRef.current.textContent = "";
    // If user is inputing a course name or id
    if (
      (step === 3 &&
        messageList[messageList.length - 1].message.includes(
          "Please input course name"
        )) ||
      messageList[messageList.length - 2].message.includes(
        "Please input course name"
      ) ||
      messageList[messageList.length - 1].message.includes(
        "Course name or id should be at least"
      ) ||
      messageList[messageList.length - 2].message.includes(
        "Course name or id should be at least"
      )
    ) {
      sendNameOrIdMutation.mutate({ query: message });
      return;
    }
    sendMessageMutation.mutate({ message, sessionId: "123" });
    setStep((step) => step + 1);
  };

  // Handles selecting an option and sending it as a message
  const selectOption = (e) => {
    if (e.target.classList.contains("message")) return;
    setMessageList((prev) => [
      ...prev,
      { message: e.target.textContent, author: "user" },
    ]);
    sendMessageMutation.mutate({
      message: e.target.textContent.toString(),
      sessionId: "123",
    });
    // If it is cancel go back to the previous step and display previous options
    if (e.target.textContent.toString().toLowerCase() === "cancel") {
      if (
        messageList[messageList.length - 1].message.includes(
          "Ok, we will search by"
        ) ||
        messageList[messageList.length - 2].message.includes(
          "Ok, we will search by"
        ) ||
        messageList[messageList.length - 1].message.includes(
          "Below are the results for"
        ) ||
        messageList[messageList.length - 2].message.includes(
          "Below are the results for"
        )
      )
        setStep(4);
      else setStep((step) => step - 1);
    } else if (
      e.target.textContent.toString().toLowerCase() === "search by time"
    ) {
      setStep(6);
    } else if (
      e.target.textContent.toString().toLowerCase() === "search by course level"
    ) {
      setStep(7);
      // Keep same options as before for steps 5, 6, and 7
    } else if (step === 5 || step === 6 || step === 7) {
    } else {
      setStep((step) => step + 1);
    }
  };

  // Scroll to the bottom of the message options always
  useEffect(() => {
    scrollBottomRef.current.scrollIntoView(false, {
      block: "end",
      behavior: "smooth",
      inline: "end",
    });
  }, [sendMessageMutation.isSuccess, messageList]);

  // Send first message automatically creating an intro message from the chatbot
  useEffect(() => {
    setIsTyping(true);
    sendMessageMutation.mutate({ message: "hi", sessionId: "123" });
  }, []);

  // useEffect will prevent empty messages from being sent, styling appropriately once there is at least 1 character in the input box
  useEffect(() => {
    if (message === "") {
      if (isDesktop) {
        resizeRef.current.style.width = "calc(98% - 20px)";
      } else {
        resizeRef.current.style.width = "calc(90% - 20px)";
      }
      buttonRef.current.style.opacity = "0";
      buttonRef.current.style.pointerEvents = "none";
    } else {
      if (isDesktop) {
        resizeRef.current.style.width = "calc(86% - 20px)";
      } else {
        resizeRef.current.style.width = "calc(78% - 20px)";
      }
      buttonRef.current.style.opacity = "1";
      buttonRef.current.style.pointerEvents = "all";

      scrollBottomRef.current.scrollIntoView(false, {
        block: "end",
        behavior: "smooth",
        inline: "end",
      });
    }
  }, [message]);

  return (
    <section id="chatbot">
      <div className="container">
        <div
          className="close-btn"
          onClick={() => {
            if (isDesktop) {
              setIsChatbotOpen(false);
            } else {
              navigate("/");
            }
          }}
        >
          <FaTimes />
        </div>
        <article className="header">
          <h1>Chatbot</h1>
        </article>
        <article className="chat-container" onClick={(e) => navigateResults(e)}>
          {messageList.map((message, index) => {
            return (
              <div
                key={index}
                className={`message ${
                  message.author === "chatbot"
                    ? "chatbot"
                    : message.author === "chatbot-click" && "chatbot btn"
                }`}
              >
                <p
                  className={`content ${
                    message.author === "chatbot-click" && "navigate"
                  }`}
                  data-department={message.departmentId}
                  data-filter={message.filter}
                  data-college={message.collegeId}
                  data-departmentname={message.department}
                  data-course={message.courseId}
                  data-query={message.query}
                >
                  {message.message}
                </p>
              </div>
            );
          })}
          {(isTyping || sendMessageMutation.isLoading) && (
            <div className="typing content">
              <div className="typing-container">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {sendMessageMutation.isSuccess && (
            <div className="options" onClick={(e) => selectOption(e)}>
              {userOptions
                .find((item) => item.step === step)
                .options.map((option, index) => {
                  return (
                    <div key={index} className="message option">
                      <p className="content">{option}</p>
                    </div>
                  );
                })}
            </div>
          )}
          <div className="scroll-to" ref={scrollBottomRef}></div>
        </article>
        <article
          className={`send-message ${
            sendMessageMutation.isSuccess && step === 3 && "active"
          }`}
        >
          <form
            className="form-container"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendResponse(e);
              }
            }}
          >
            <div
              ref={resizeRef}
              className="message-input"
              contentEditable="true"
              value={message}
              onInput={(e) => setMessage(e.target.textContent)}
            ></div>
            <button ref={buttonRef} onClick={(e) => sendResponse(e)}>
              <FaChevronRight />
            </button>
          </form>
        </article>
      </div>
    </section>
  );
};

export default Chatbot;

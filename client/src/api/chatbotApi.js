import axios from "axios";

// Handles sending message to chatbot and getting a response back
export const sendMessage = ({ message, sessionId }) => {
  return axios
    .post(`${process.env.REACT_APP_URL}chatbot/send-message`, {
      language: "en",
      message,
      sessionId,
    })
    .then((res) => res.data);
};

// Gets the amount of courses found with the parameters placed by user
export const getCoursesWithChatbot = (parameters) => {
  return axios
    .post(`${process.env.REACT_APP_URL}chatbot/get-courses`, {
      department:
        parameters?.department?.stringValue ||
        parameters?.Department?.stringValue,
      rating: parameters?.Ratings?.stringValue,
      time: parameters?.Time?.stringValue,
      courseLevel: parameters?.Course_Level?.stringValue,
    })
    .then((res) => res.data);
};

// Handles query into the database to find courses matching a query string
export const getCoursesByNameOrIdChatbot = ({ query }) => {
  return axios
    .post(`${process.env.REACT_APP_URL}chatbot/find/?query=${query}`)
    .then((res) => res.data);
};

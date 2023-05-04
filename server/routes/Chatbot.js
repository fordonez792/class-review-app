require("dotenv").config();

const express = require("express");
const { Courses, Departments, Sequelize } = require("../models");
const { detectIntent } = require("../services/Chatbot");

const router = express.Router();

// This file handles everything to do with the Chatbot including sending and receiving messages from the chatbot, filtering and finding courses with the help of the chatbot

// Handles sending a message to the chatbot and getting the response
router.post("/send-message", async (req, res) => {
  const { language, message, sessionId } = req.body;

  const response = await detectIntent(language, message, sessionId);

  res.send(response);
});

const isQueryParam = async (param) => {
  if (
    !param ||
    param == undefined ||
    param === "null" ||
    param === "undefined" ||
    param === ""
  ) {
    return false;
  }
  return true;
};

// Handles filtering the courses with the filters chosen by the user through the chatbot
router.post("/get-courses", async (req, res) => {
  const { department, rating, time, courseLevel } = req.body;
  const Op = Sequelize.Op;
  const where = {};

  const selectedDepartment = await Departments.findOne({
    where: { departmentEnglishName: department },
  });

  if (!selectedDepartment) {
    res.status(404).json({
      status: "FAILED",
      message: "Department selected not found",
    });
    return;
  }

  where.departmentId = selectedDepartment.departmentId;

  if (await isQueryParam(rating)) {
    // Most Recommended Courses means overallRecommend rating >= 4
    if (rating === "overallRecommend") where.overallRecommend = { [Op.gte]: 4 };
    // Most Engaging Courses means overallEngaging rating >=4
    if (rating === "overallEngaging") where.overallEngaging = { [Op.gte]: 4 };
    // Most Effective Courses means overallEffectiveness rating >= 4
    if (rating === "overallEffectiveness")
      where.overallEffectiveness = { [Op.gte]: 4 };
    // Courses with Fair Assessments means overallFairAssessments rating >= 4
    if (rating === "overallFairAssessments")
      where.overallFairAssessments = { [Op.gte]: 4 };
    // Most Difficult Courses means overallDifficulty rating >= 4
    if (rating === "overallMostDifficult")
      where.overallDifficulty = { [Op.gte]: 4 };
    // Least Difficult Courses means overallDifficulty rating <= 2
    if (rating === "overallLeastDifficult")
      where.overallDifficulty = { [Op.lte]: 2 };
    // if (rating === "visited") where.visited = {};
  }
  if (await isQueryParam(time)) {
    where.time = { [Op.substring]: time };
  }
  if (await isQueryParam(courseLevel)) {
    where.courseYear = courseLevel;
  }

  Courses.findAll({ where })
    .then((courses) => {
      // If only 1 course is found, user can navigate to course specific page
      if (Array.from(courses).length === 1) {
        res.json({
          message: `Only course matching your criteria: ${courses[0].courseEnglishName} - ${courses[0].courseId}`,
          author: "chatbot-click",
          courseId: courses[0].courseId,
        });
        // If many courses are found then navigate to search results page
      } else {
        res.json({
          message: `${Array.from(courses).length} courses found`,
          parameters: {},
          author: "chatbot-click",
          collegeId: selectedDepartment.collegeId,
          departmentId: selectedDepartment.departmentId,
          department: selectedDepartment.departmentEnglishName,
          filter: rating || time || courseLevel || "none",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while searching for courses with chatbot",
      });
      return;
    });
});

// Handles query with course name or id with the chatbot
router.post("/find", async (req, res) => {
  const { query } = req.query;
  const Op = Sequelize.Op;

  if (!query || query.length < 3) {
    res.json({
      message:
        "Course name or id should be at least 3 characters long. Please input again.",
      author: "chatbot",
    });
    return;
  }

  // Query can be targetted towards courseId, courseName or courseEnglishName
  Courses.findAll({
    where: {
      [Op.or]: [
        { courseId: { [Op.substring]: query } },
        { courseName: { [Op.substring]: query } },
        { courseEnglishName: { [Op.substring]: query } },
      ],
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: Departments,
  })
    .then((courses) => {
      // If only one course found then navigate to course specific page
      if (Array.from(courses).length === 1) {
        res.json({
          message: `Navigate to ${courses[0].courseEnglishName} - ${courses[0].courseId}`,
          parameters: {},
          author: "chatbot-click",
          courseId: courses[0].courseId,
        });
        return;
      }
      // Otherwise navigate to search results page
      res.json({
        message: `${
          Array.from(courses).length
        } courses found matching "${query}"`,
        parameters: {},
        author: "chatbot-click",
        query,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message:
          "An error occured while looking for the courses by name with chatbot",
      });
    });
});

module.exports = router;

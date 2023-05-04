require("dotenv").config();

const axios = require("axios");
const express = require("express");
const { Users, Colleges } = require("../models");
const { getTranslation } = require("../services/Translation");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

// This file contains all routes that have to do with colleges
// This includes admin posting colleges to db, getting colleges by id, english and chinese name, and getting all colleges from the db

const getColleges = (year) => {
  return axios
    .get(`https://web.ndhu.edu.tw/INC/CourseApi/api/SubjColleges?syear=${year}`)
    .then((res) => res.data);
};

// Post colleges into database while adding the translated english name, only admin is allowed to do this
router.post("/post", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't post colleges",
    });
    return;
  }

  const { year } = req.body;
  const colleges = await getColleges(year);
  const newColleges = Array.from(colleges).map((college) => {
    // First three numbers of the college id are for the year so remove
    const collegeId = parseInt(college.collegeid.toString().slice(3));

    // Get translation from function
    const collegeEnglishName = getTranslation(college.collegename, "COLLEGE");

    const newCollege = {
      collegeId,
      collegeName: college.collegename,
      collegeEnglishName,
    };

    // Add row to database
    Colleges.create(newCollege);

    return newCollege;
  });

  res.status(200).json({
    status: "SUCCESS",
    message: "Colleges uploaded to database successfully",
    colleges: newColleges,
  });
});

// Find college by Id
router.get("/get-by-id/:id", async (req, res) => {
  const { id } = req.params;
  let collegeId;

  if (id == null) return;
  if (id.toString().length === 7) {
    collegeId = parseInt(id.toString().slice(3));
  }
  if (id.toString().length === 4) {
    collegeId = id;
  }

  Colleges.findOne({
    where: { collegeId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((college) => {
      if (!college || college.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No college found",
        });
        return;
      }
      res.status(200).json(college);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve college",
      });
      return;
    });
});

// Find college by chinese name
router.get("/get-by-name/:collegeName", async (req, res) => {
  const { collegeName } = req.params;

  Colleges.findAll({
    where: { collegeName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((college) => {
      if (!college || college.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No college found",
        });
        return;
      }
      res.status(200).json(college);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve college",
      });
      return;
    });
});

// Find college by English Name
router.get("/get-by-english-name/:collegeEnglishName", async (req, res) => {
  const { collegeEnglishName } = req.params;

  Colleges.findAll({
    where: { collegeEnglishName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((college) => {
      if (!college || college.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No college found",
        });
        return;
      }
      res.status(200).json(college);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve college",
      });
      return;
    });
});

// Returns all colleges found in the database
router.get("/get-all", async (req, res) => {
  Colleges.findAll()
    .then((colleges) => {
      if (!colleges || colleges.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No colleges found",
        });
        return;
      }
      res.status(200).json(colleges);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve colleges",
      });
      return;
    });
});

module.exports = router;

require("dotenv").config();

const axios = require("axios");
const express = require("express");
const { Users, Departments, Colleges } = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");
const { getTranslation } = require("../services/Translation");

const router = express.Router();

// This file contains all routes that have to do with departments
// This include posting departments, exclusive for the admin, as well as finding departments by id and english or chinese name, as well as getting all departments in the db and also all departments belonging to a college

const getCollegesId = async () => {
  const collegesId = await Colleges.findAll({
    attributes: ["collegeId"],
    raw: true,
  });
  return Array.from(collegesId);
};

const getDepartments = (year, collegeId) => {
  return axios
    .get(
      `https://web.ndhu.edu.tw/INC/CourseApi/api/SubjDepartments?syear=${year}&collegeid=${year}${collegeId}`
    )
    .then((res) => res.data);
};

// Allows for all departments to be posted, exclusive for the admin
router.post("/post", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't post departments",
    });
    return;
  }

  const { year } = req.body;
  const allDepartments = [];

  const collegesId = await getCollegesId();

  for (const i in collegesId) {
    const { collegeId } = collegesId[i];
    const departments = await getDepartments(year, collegeId);
    Array.from(departments).map((department) => {
      // First three numbers of the college id are for the year so remove
      const departmentId = parseInt(department.depid.toString().slice(3));

      // Get translation from function
      const departmentEnglishName = getTranslation(
        department.depname,
        "DEPARTMENT"
      );

      const newDepartment = {
        departmentId,
        departmentName: department.depname,
        departmentEnglishName,
        collegeId,
      };

      // Add row to database
      Departments.create(newDepartment);
      // Add row to array to return as a json object in the res
      allDepartments.push(newDepartment);
    });
  }
  res.status(200).json({
    status: "SUCCESS",
    message: "Departments uploaded to database successfully",
    allDepartments,
  });
});

// Get all departments in the database
router.get("/get-all", async (req, res) => {
  Departments.findAll()
    .then((departments) => {
      if (!departments || departments.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No departments found",
        });
        return;
      }
      res.status(200).json(departments);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve departments",
      });
      return;
    });
});

// Find Department by id
router.get("get-by-id/:id", async (req, res) => {
  const { id } = req.params;
  let departmentId;

  if (id.toString().length === 7) {
    departmentId = parseInt(id.toString().slice(3));
  }
  if (id.toString().length === 4) {
    departmentId = id;
  }

  Departments.findOne({
    where: { departmentId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((department) => {
      if (!department || department.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No department found",
        });
        return;
      }
      res.status(202).json(department);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve department",
      });
      return;
    });
});

// Find all departments by english name
router.get("/get-by-english-name/:departmentEnglishName", async (req, res) => {
  const { departmentEnglishName } = req.params;

  Departments.findOne({
    where: { departmentEnglishName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((department) => {
      if (!department || department.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No department found",
        });
        return;
      }
      res.status(200).json(department);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve department",
      });
      return;
    });
});

// Find all departments by chinese name
router.get("/get-by-english-name/:departmentName", async (req, res) => {
  const { departmentName } = req.params;

  Departments.findOne({
    where: { departmentName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((department) => {
      if (!department || department.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No department found",
        });
        return;
      }
      res.status(200).json(department);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve department",
      });
      return;
    });
});

// Find all departments for a college by college Id
router.get("/get-by-college-id/:id", async (req, res) => {
  const { id } = req.params;
  let collegeId;

  if (id == null || id == 0) return;
  if (id.toString().length === 7) {
    collegeId = parseInt(id.toString().slice(3));
  }
  if (id.toString().length === 4) {
    collegeId = id;
  }

  Departments.findAll({
    where: { collegeId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((departments) => {
      if (!departments || departments.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No departments found",
        });
        return;
      }
      res.status(200).json(departments);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve departments",
      });
      return;
    });
});

module.exports = router;

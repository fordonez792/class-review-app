require("dotenv").config();

const axios = require("axios");
const express = require("express");
const { authenticateToken } = require("../middleware/AuthMiddleware");
const { Users, Courses, Departments, Sequelize } = require("../models");

const router = express.Router();

// This file contains all the routes that have to do with courses
// This includes posting courses only allowed for admin, getting courses by id, english and chinese name, by department, courses that fit the filtering criteria, and matching courses id or english or chinese name to a string, as well as top 5 most popular courses
// Also increases the visited variable in the db that tracks how many times the course specific page has been visited, therefore knowing which courses are more popular than others
// Lastly, reserved only for the admin, get the number of courses that have reviews

// Get all department Ids only
const getDepartmentsId = async () => {
  const departmentsId = await Departments.findAll({
    attributes: ["departmentId"],
    raw: true,
  });
  return Array.from(departmentsId);
};

// Get courses from original course api
const getCourses = (year, semester, departmentId) => {
  return axios
    .get(
      `https://web.ndhu.edu.tw/INC/CourseApi/api/SubjCourses?syear=${year}&sseme=${semester}&depid=${year}${departmentId}`
    )
    .then((res) => res.data);
};

// Posts all classes that are not already in the database by year and semester
router.post("/post", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't post courses",
    });
    return;
  }

  const { year, semester } = req.body;
  let newCourses = [];

  const departmentsId = await getDepartmentsId();

  // For every id in the departments Id array
  for (const i in departmentsId) {
    const { departmentId } = departmentsId[i];
    // Get all courses for that specific department
    const courses = await getCourses(year, semester, departmentId);
    for (const j in courses) {
      const teacher = Array.from(courses[j]._teacher).join(", ");
      const time = Array.from(courses[j]._subjtime).join(", ");

      // Create object with correct keys for database
      const newCourse = {
        courseId: courses[j].subjid,
        courseName: courses[j].subjname,
        courseEnglishName: courses[j].subjename,
        credits: courses[j].score,
        requiredCourse: courses[j].subjmust,
        taughtInEnglish: courses[j].subjeng === "否" ? false : true,
        courseYear: courses[j].subjlevel,
        teacher,
        time,
        fallSemester: parseInt(semester) === 1 && true,
        springSemester: parseInt(semester) === 2 && true,
        departmentId,
      };

      // Try to find the course first in the database, if it does not exist post
      const [course, created] = await Courses.findOrCreate({
        where: { courseId: courses[j].subjid, departmentId },
        defaults: newCourse,
      });
      // Check if course is taught in both fall and spring semesters
      if (!created && parseInt(semester) === 1 && !course.fallSemester) {
        await course.update({ fallSemester: true });
      }
      if (!created && parseInt(semester) === 2 && !course.springSemester) {
        await course.update({ springSemester: true });
      }
      // Only return the new courses that have been added to database
      if (created) {
        newCourses.push(course);
      }
    }
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "Departments uploaded to database successfully",
    length: newCourses.length,
    newCourses,
  });
});

// Get a course just by the course ID
router.get("/get-by-id/:courseId", async (req, res) => {
  const { courseId } = req.params;

  if (courseId == null) return;
  Courses.findOne({
    where: { courseId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: Departments,
  })
    .then((course) => {
      if (!course || course.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No course found",
        });
        return;
      }
      res.status(200).json(course);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve course",
      });
      return;
    });
});

// Get courses by chinese name
router.get("/get-by-name/:courseName", async (req, res) => {
  const { courseName } = req.params;

  Courses.findAll({
    where: { courseName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((courses) => {
      if (!courses || courses.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No courses found",
        });
        return;
      }
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve courses",
      });
      return;
    });
});

// Find all courses that have the same english name
router.get("/get-by-english-name/:courseEnglishName", async (req, res) => {
  const { courseEnglishName } = req.params;

  Courses.findAll({
    where: { courseEnglishName },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((courses) => {
      if (!courses || courses.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No courses found",
        });
        return;
      }
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve courses",
      });
      return;
    });
});

// Get all courses for the given department
router.get("/get-by-department-id/:id", async (req, res) => {
  const { id } = req.params;
  let departmentId;

  if (id == null) return;
  if (id.toString().length === 7) {
    departmentId = parseInt(id.toString().slice(3));
  }
  if (id.toString().length === 4) {
    departmentId = id;
  }

  Courses.findAll({
    where: { departmentId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((courses) => {
      if (!courses || courses.length === 0) {
        res.status(404).json({
          status: "FAILED",
          message: "No courses found",
        });
        return;
      }
      res.status(200).json({
        length: Array.from(courses).length,
        courses,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Failed to retrieve courses",
      });
      return;
    });
});

// Function to help see if a search param is null or not
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

// Finds all courses that go with the filter criteria
router.get("/filter/", async (req, res) => {
  const {
    id,
    search,
    taughtInEnglish,
    fall,
    spring,
    courseLevel,
    time,
    sort,
    rating,
  } = req.query;
  const Op = Sequelize.Op;
  let departmentId;
  let where = {};
  let order = [];

  if (id == null && (search == null || search.length === 0)) return;

  // Check parameters to see if they are null or empty
  if (await isQueryParam(id)) {
    if (id.toString().length === 7) {
      departmentId = parseInt(id.toString().slice(3));
      where.departmentId = departmentId;
    }
    if (id.toString().length === 4) {
      departmentId = id;
      where.departmentId = departmentId;
    }
  }
  if (await isQueryParam(search)) {
    where = {
      [Op.or]: [
        { courseId: { [Op.substring]: search } },
        { courseName: { [Op.substring]: search } },
        { courseEnglishName: { [Op.substring]: search } },
      ],
    };
  }
  if (await isQueryParam(taughtInEnglish)) {
    // query returns strings instead of booleans so need to check and adjust
    let correct;
    if (taughtInEnglish === "true") correct = true;
    if (taughtInEnglish === "false") correct = false;
    where.taughtInEnglish = correct;
  }
  if (await isQueryParam(fall)) {
    let correct;
    if (fall === "true") correct = true;
    if (fall === "false") correct = false;
    where.fallSemester = correct;
  }
  if (await isQueryParam(spring)) {
    let correct;
    if (spring === "true") correct = true;
    if (spring === "false") correct = false;
    where.springSemester = correct;
  }
  if (await isQueryParam(courseLevel)) {
    const courseLvl = courseLevel.split(".");
    where.courseYear = { [Op.in]: courseLvl };
  }
  if (await isQueryParam(time)) {
    const correct = time.split(".");
    const andArray = [];
    correct.forEach((item) => {
      andArray.push({ [Op.substring]: item });
    });
    where.time = { [Op.or]: andArray };
  }
  if (await isQueryParam(sort)) {
    // Default
    if (parseInt(sort) === 0) {
      order.push(["createdAt", "ASC"]);
    }
    // Most Reviews
    if (parseInt(sort) === 1) {
      order.push(["numberOfReviews", "DESC"]);
    }
    // Highest Rating
    else if (parseInt(sort) === 3) {
      order.push(["overallRecommend", "DESC"]);
    }
    // Most Popular
    else if (parseInt(sort) === 4) {
      order.push(["visited", "DESC"]);
    }
  } else {
    order.push(["createdAt", "ASC"]);
  }
  // Adjust for the rating chosen by the user using the chatbot
  if (await isQueryParam(rating)) {
    if (rating === "overallRecommend") where.overallRecommend = { [Op.gte]: 4 };
    if (rating === "overallEngaging") where.overallEngaging = { [Op.gte]: 4 };
    if (rating === "overallEffectiveness")
      where.overallEffectiveness = { [Op.gte]: 4 };
    if (rating === "overallFairAssessments")
      where.overallFairAssessments = { [Op.gte]: 4 };
    if (rating === "overallMostDifficult")
      where.overallDifficulty = { [Op.gte]: 4 };
    if (rating === "overallLeastDifficult")
      where.overallDifficulty = { [Op.lte]: 2 };
    // if (rating === "visited") where.visited = {};
  }

  Courses.findAll({
    where,
    order,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((courses) => {
      if (!courses || courses.length === 0) {
        res.json({
          status: "FAILED",
          message: "No courses found with that filter criteria",
        });
        return;
      }
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "An error occured while looking for the courses",
      });
    });
});

// Find courses that match the query string or start with it
router.get("/find/", async (req, res) => {
  const { query } = req.query;
  const Op = Sequelize.Op;

  if (!query || query.length < 3) return;

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
    limit: 10,
  })
    .then((courses) => {
      if (!courses || courses.length === 0) {
        res.json({
          status: "FAILED",
          message: "No courses found that match the query string",
        });
        return;
      }
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "An error occured while looking for the courses",
      });
    });
});

// Everytime the page for a course is visited, increase the visited value
router.put("/increase-visited/:courseId", async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) return;

  Courses.findOne({ where: { courseId } })
    .then((course) => {
      if (!course) {
        res.status(404).json({
          status: "FAILED",
          message: "No course found",
        });
        return;
      }
      course.update({ visited: course.visited + 1 });
      res.json({
        status: "SUCCESS",
        message: "Visited updated successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Could not update visited",
      });
    });
});

// Get the top 5 most popular courses by the visited value
router.get("/popular", async (req, res) => {
  Courses.findAll({
    limit: 5,
    order: [["visited", "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: Departments,
  })
    .then((courses) => {
      if (!courses) {
        res.status(404).json({
          status: "FAILED",
          message: "No courses found",
        });
        return;
      }
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "An error occured when fetching",
      });
    });
});

router.get("/with-reviews", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't get number of courses with reviews",
    });
    return;
  }

  const Op = Sequelize.Op;

  Courses.findAll({ where: { numberOfReviews: { [Op.gte]: 1 } } })
    .then((courses) => {
      res.status(200).json(courses.length);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while looking for total number of courses",
      });
    });
});

module.exports = router;

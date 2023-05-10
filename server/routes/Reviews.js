require("dotenv").config();

const express = require("express");
const {
  Reviews,
  Courses,
  Users,
  HelpfulVotes,
  ReportVotes,
  Sequelize,
} = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

// This file contains all routes that have to do with reviews
// It contains creating a review reserved for signed up users only, get all reviews for one course, get reviews by filtered and sorted criteria, get the 5 most recent reviews, deletion of reviews by either the creator or the admin, getting the total number of reviews exclusive for admin, and get all reviews that have 10 or more report votes also exclusive for admin

// Creates a new review and updates the information for the course reviewed
router.post("/create", authenticateToken, async (req, res) => {
  const { ratings, reviewInfo, courseId } = req.body;
  const { title, description, year, semester, anonymous } = reviewInfo;
  let semesterValue;
  if (semester === "Fall") semesterValue = 1;
  if (semester === "Spring") semesterValue = 2;

  if (!courseId) {
    res.status(404).json({
      status: "FAILED",
      message: "No id was given",
    });
    return;
  }

  const course = await Courses.findOne({ where: { courseId } });
  const user = await Users.findOne({ where: { id: req.user.id } });

  if (!course) {
    res.status(404).json({
      status: "FAILED",
      message: "No course was found with the id",
    });
    return;
  }

  Reviews.create({
    title,
    description,
    year,
    semester: semesterValue,
    difficulty: ratings[0].selection,
    engaging: ratings[1].selection,
    effectiveness: ratings[2].selection,
    fairAssessments: ratings[3].selection,
    recommend: ratings[4].selection,
    anonymous,
    creator: req.user.id,
    courseId: course.id,
  })
    .then(async (review) => {
      const reviews = course.numberOfReviews;
      const overallDifficulty = course.overallDifficulty;
      const overallEngaging = course.overallEngaging;
      const overallEffectiveness = course.overallEffectiveness;
      const overallFairAssessments = course.overallFairAssessments;
      const overallRecommend = course.overallRecommend;
      // Update the number of reviews and all overall ratings for the course
      course.numberOfReviews = reviews + 1;

      course.overallDifficulty =
        (overallDifficulty * reviews + review.difficulty) /
        course.numberOfReviews;

      course.overallEngaging =
        (overallEngaging * reviews + review.engaging) / course.numberOfReviews;

      course.overallEffectiveness =
        (overallEffectiveness * reviews + review.effectiveness) /
        course.numberOfReviews;

      course.overallFairAssessments =
        (overallFairAssessments * reviews + review.fairAssessments) /
        course.numberOfReviews;

      course.overallRecommend =
        (overallRecommend * reviews + review.recommend) /
        course.numberOfReviews;
      course.save({
        fields: [
          "numberOfReviews",
          "overallDifficulty",
          "overallEngaging",
          "overallEffectiveness",
          "overallFairAssessments",
          "overallRecommend",
        ],
      });

      // Update the number of reviews the user has submitted
      user.numberOfReviews = user.numberOfReviews + 1;
      user.save({ fields: ["numberOfReviews"] });

      res.json({
        status: "SUCCESS",
        review,
      });
      return;
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while creating the review",
      });
      return;
    });
});

// Get all reviews corresponding to the course
router.get("/get-by-courseId/:courseId", async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) return;

  Reviews.findAll({
    where: { courseId },
    include: [{ model: Users }, { model: HelpfulVotes }],
  })
    .then((reviews) => {
      if (!reviews) {
        res.json({
          status: "FAILED",
          message: "No reviews found for this course",
        });
        return;
      }
      res.json(reviews);
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Some error occured when looking for the reviews",
      });
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

// Filter all courses by the given criteria
router.get("/filter/", async (req, res) => {
  const { courseId, search, rating, year, fall, spring, sort } = req.query;
  const Op = Sequelize.Op;
  let where = {};
  let order = [];

  if (await isQueryParam(courseId)) {
    where.courseId = courseId;
  }
  if (await isQueryParam(search)) {
    where = {
      [Op.or]: [
        { description: { [Op.substring]: search } },
        { title: { [Op.substring]: search } },
      ],
    };
  }
  if ((await isQueryParam(fall)) || (await isQueryParam(spring))) {
    const array = [];
    if (fall === "true") array.push(1);
    if (spring === "true") array.push(2);
    where.semester = { [Op.in]: array };
  }
  if (await isQueryParam(rating)) {
    where.recommend = { [Op.in]: rating.split(".") };
  }
  if (await isQueryParam(year)) {
    where.year = { [Op.in]: year.split(".") };
  }
  if (await isQueryParam(sort)) {
    // Default
    if (parseInt(sort) === 0) {
      order.push(["createdAt", "ASC"]);
    }
    // Newest
    if (parseInt(sort) === 1) {
      order.push(["createdAt", "DESC"]);
    }
    // Most Helpful
    else if (parseInt(sort) === 2) {
      order.push(["numberOfHelpfulVotes", "DESC"]);
    }
    // Highest Rating
    else if (parseInt(sort) === 3) {
      order.push(["recommend", "DESC"]);
    }
    // Lowest Rating
    else if (parseInt(sort) === 4) {
      order.push(["recommend", "ASC"]);
    }
  } else {
    order.push(["createdAt", "ASC"]);
  }

  Reviews.findAll({
    where,
    order,
    attributes: { exclude: ["updatedAt"] },
    include: [
      { model: Users },
      { model: HelpfulVotes },
      { model: ReportVotes },
    ],
  })
    .then((reviews) => {
      if (!reviews || reviews.length === 0) {
        res.json({
          status: "FAILED",
          message: "No reviews found with that filter criteria",
        });
        return;
      }
      res.status(200).json(reviews);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "An error occured while looking for the reviews",
      });
    });
});

// Get the top 5 most recent reviews submitted
router.get("/recent", async (req, res) => {
  Reviews.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["updatedAt"] },
    include: [{ model: Users }, { model: HelpfulVotes }, { model: Courses }],
  })
    .then((reviews) => {
      if (!reviews) {
        res.status(404).json({
          status: "FAILED",
          message: "No reviews found",
        });
        return;
      }
      res.status(200).json(reviews);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "An error occured when fetching reviews",
      });
    });
});

// Handles deletion of a review either by the owner of the review or by the admin himself, also updates other information on the users page and course page such as ratings
router.delete("/delete/:id/:courseId", authenticateToken, async (req, res) => {
  const { id, courseId } = req.params;

  const userClicked = await Users.findOne({ where: { id: req.user.id } });

  if (!id) {
    res.status(404).json({
      status: "FAILED",
      message: "No id was passed on to delete review",
    });
    return;
  }

  if (!courseId) {
    res.status(404).json({
      status: "FAILED",
      message: "No id was passed on to look for course",
    });
    return;
  }

  const review = await Reviews.findOne({
    where: { id },
    include: HelpfulVotes,
  });

  if (review.creator !== userClicked.id && !userClicked.admin) {
    res.json({
      status: "FAILED",
      message: "You are not allowed to delete this review",
    });
    return;
  }

  const user = await Users.findOne({ where: { id: review.creator } });
  const course = await Courses.findOne({ where: { id: courseId } });

  Reviews.destroy({ where: { id } })
    .then(() => {
      // Update the number of Reviews for the user and number of helpful votes
      user.numberOfReviews = user.numberOfReviews - 1;
      user.numberOfHelpfulVotes =
        user.numberOfHelpfulVotes - review.HelpfulVotes.length;

      // Save changes made to user account
      user.save({ fields: ["numberOfReviews", "numberOfHelpfulVotes"] });

      // Update ratings and number of reviews removing the deleted review ratings

      if (course.numberOfReviews - 1 === 0) {
        course.overallDifficulty = 0;
        course.overallEffectiveness = 0;
        course.overallEngaging = 0;
        course.overallFairAssessments = 0;
        course.overallRecommend = 0;
      } else {
        course.overallDifficulty =
          (course.overallDifficulty * course.numberOfReviews -
            review.difficulty) /
          (course.numberOfReviews - 1);

        course.overallEffectiveness =
          (course.overallEffectiveness * course.numberOfReviews -
            review.effectiveness) /
          (course.numberOfReviews - 1);

        course.overallEngaging =
          (course.overallEngaging * course.numberOfReviews - review.engaging) /
          (course.numberOfReviews - 1);

        course.overallFairAssessments =
          (course.overallFairAssessments * course.numberOfReviews -
            review.fairAssessments) /
          (course.numberOfReviews - 1);

        course.overallRecommend =
          (course.overallRecommend * course.numberOfReviews -
            review.recommend) /
          (course.numberOfReviews - 1);
      }

      course.numberOfReviews = course.numberOfReviews - 1;

      // Save changes made to course
      course.save({
        fields: [
          "overallDifficulty",
          "overallEffectiveness",
          "overallEngaging",
          "overallFairAssessments",
          "overallRecommend",
          "numberOfReviews",
        ],
      });

      res.status(200).json({
        status: "SUCCESS",
        message: "Review deleted successfully and Course and User updated",
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Some error occured while trying to delete the review",
      });
    });
});

// Returns all reviews that have 10 or more report votes, exclusive for the admin
router.get("/reported", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't get the list of reported reviews",
    });
    return;
  }

  const Op = Sequelize.Op;

  Reviews.findAll({
    where: { numberOfReportVotes: { [Op.gte]: 10 } },
    include: [{ model: Users }, { model: HelpfulVotes }],
  })
    .then((reviews) => {
      if (!reviews) {
        res.status(404).json({
          status: "SUCCESS",
          message: "No reported reviews found",
        });
        return;
      }
      res.status(200).json(reviews);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while looking for reported reviews",
      });
    });
});

// Returns the total number of reviews, exclusive for the admin
router.get("/number-of-reviews", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't get the list of reported reviews",
    });
    return;
  }

  Reviews.findAll()
    .then((reviews) => {
      res.status(200).json(reviews.length);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while looking for total number of reviews",
      });
    });
});

module.exports = router;

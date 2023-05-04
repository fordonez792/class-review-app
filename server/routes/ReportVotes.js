const express = require("express");
const { ReportVotes, Reviews } = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");
const { verifyReportedReview } = require("../services/Email");

const router = express.Router();

// This file contains all routes to do with reportvotes
// Users can only report once, but once they report it can't be unreported
// If number of report votes for a review reaches 10 or more an email is automatically sent to the admin to moderate the review

// Controls the reporting of a review
router.post("/", authenticateToken, async (req, res) => {
  const { reviewId } = req.body;

  const found = await ReportVotes.findOne({
    where: { ReviewId: reviewId, UserId: req.user.id },
  });

  const review = await Reviews.findOne({ where: { id: reviewId } });

  if (!found) {
    ReportVotes.create({ ReviewId: reviewId, UserId: req.user.id })
      .then(() => {
        review.numberOfReportVotes += 1;
        review.save({ fields: ["numberOfReportVotes"] });

        if (review.numberOfReportVotes >= 10) {
          verifyReportedReview(reviewId);
        }

        res.status(200).json({
          status: "SUCCESS",
          message: "Post reported successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "Some error occured while reporting post",
        });
        return;
      });
  }
});

module.exports = router;

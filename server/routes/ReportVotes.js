const express = require("express");
const { ReportVotes, Reviews } = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");
const { verifyReportedReview } = require("../services/Email");

const router = express.Router();

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

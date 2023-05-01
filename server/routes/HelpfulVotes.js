const express = require("express");
const { HelpfulVotes, Users, Reviews } = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const { reviewId } = req.body;

  const found = await HelpfulVotes.findOne({
    where: { ReviewId: reviewId, UserId: req.user.id },
  });
  const user = await Users.findOne({ where: { id: req.user.id } });
  const review = await Reviews.findOne({ where: { id: reviewId } });

  if (found) {
    HelpfulVotes.destroy({ where: { ReviewId: reviewId, UserId: req.user.id } })
      .then(() => {
        user.numberOfHelpfulVotes -= 1;
        user.save({ fields: ["numberOfHelpfulVotes"] });

        review.numberOfHelpfulVotes -= 1;
        review.save({ fields: ["numberOfHelpfulVotes"] });

        res.status(200).json({
          status: "SUCCESS",
          message: "Helpful vote destroyed successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "Some error occured while destroying the helpful vote",
        });
        return;
      });
  } else {
    HelpfulVotes.create({ ReviewId: reviewId, UserId: req.user.id })
      .then(() => {
        user.numberOfHelpfulVotes += 1;
        user.save({ fields: ["numberOfHelpfulVotes"] });

        review.numberOfHelpfulVotes += 1;
        review.save({ fields: ["numberOfHelpfulVotes"] });

        res.status(200).json({
          status: "SUCCESS",
          message: "Helpful vote created successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "Some error occured while creating the helpful vote",
        });
        return;
      });
  }
});

module.exports = router;

require("dotenv").config();

const express = require("express");
const { verify } = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Users } = require("../models");

const router = express.Router();

router.post("/verify-token", async (req, res) => {
  const { id, token } = req.body;

  const user = await Users.findByPk(id);

  if (!user) {
    res.json({
      status: "FAILED",
      message: "Invalid link, no user found",
    });
    return;
  }

  if (!token) {
    res.json({
      status: "FAILED",
      message: "Invalid link, no token found",
    });
    return;
  }

  try {
    verify(token, process.env.EMAIL_TOKEN_SECRET);
    Users.update({ verified: true }, { where: { username: user.username } })
      .then(() => {
        res.json({
          status: "SUCCESS",
          message: "Email verified successfully",
        });
        return;
      })
      .catch((error) => {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "Database failed to update successfully",
        });
        return;
      });
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "Email token verification failed",
    });
    return;
  }
});

module.exports = router;

require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const { Users, Reviews, HelpfulVotes, Courses } = require("../models");
const { authenticateToken } = require("../middleware/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { verifyEmail } = require("../services/Email");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  const emailAlready = await Users.findOne({ where: { email } });
  const usernameAlready = await Users.findOne({ where: { username } });

  // Email is already in use
  if (emailAlready) {
    res.json({
      status: "FAILED",
      message: "Email is already used",
    });
    return;
  }

  // Username is already in use
  if (usernameAlready) {
    res.json({
      status: "FAILED",
      message: "Username is already used",
    });
    return;
  }

  // Firstly hash the password given
  bcrypt
    .hash(password, 10)
    .then(async (hash) => {
      // Create the user inside the database using the Users model
      const user = await Users.create({
        username,
        password: hash,
        email,
        verified: false,
      });

      // Create an email token later used to verify the email
      const emailToken = sign(
        { username, id: user.id },
        process.env.EMAIL_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Send an email to the email address provided to verify it
      verifyEmail(user.id, email, emailToken);
      res.json({
        status: "SUCCESS",
        message: "An email was sent to your account, please verify",
      });
    })
    .catch((error) => console.log(error));
});

router.post("/signup-google", async (req, res) => {
  const { email, username, photoUrl } = req.body;

  const emailAlready = await Users.findOne({ where: { email } });

  // If user is returning after already signin up in the database
  if (emailAlready != null) {
    if (username !== emailAlready.username) {
      emailAlready.username = username;
      emailAlready.save({ fields: ["username"] });
    }

    if (photoUrl !== emailAlready.photoUrl) {
      emailAlready.photoUrl = photoUrl;
      emailAlready.save({ fields: ["photoUrl"] });
    }
    res.json({
      status: "SUCCESS",
      message: "Logged in successfully",
    });
    return;
  }

  // Email is already in use
  if (emailAlready) {
    res.json({
      status: "FAILED",
      message: "Email is already used",
    });
    return;
  }

  // User is new and a new account is created in the database
  Users.create({
    username,
    email,
    verified: true,
    photoUrl,
    googleSignIn: true,
  })
    .then((user) => {
      console.log(user);
      res.json({
        status: "SUCCESS",
        message: "Data stored successfully in the database",
      });
      return;
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Some error occurred while storing data in database",
      });
      return;
    });
});

router.post("/login", async (req, res) => {
  const { field, usernameOrEmail, password } = req.body;

  let user;

  // Allows users to login in with either email or username
  if (field === "EMAIL") {
    user = await Users.findOne({ where: { email: usernameOrEmail } });
  }
  if (field === "USERNAME") {
    user = await Users.findOne({ where: { username: usernameOrEmail } });
  }

  // User is non existent
  if (!user) {
    res.json({
      status: "FAILED",
      message: "User does not exist",
    });
    return;
  }

  // User email has not been verified, meaining, email was never verified, so new email will be sent, as only verified accounts are allowed in the website
  if (!user.verified) {
    const emailToken = sign(
      { username: user.username, id: user.id },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    verifyEmail(user.id, user.email, emailToken);
    res.json({
      status: "VERIFY_EMAIL",
      message: "An email was sent to your account, please verify",
    });
    return;
  }

  // Password inputed is compared to the one stored in the database, and then user is logged in
  bcrypt
    .compare(password, user.password)
    .then(async (match) => {
      // If not the same then incorrect password
      if (!match) {
        res.json({
          status: "FAILED",
          message: "Username or email and password don't match",
        });
        return;
      }
      const accessToken = sign(
        { username: user.username, id: user.id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({
        status: "SUCCESS",
        message: "Login Successful",
        id: user.id,
        username: user.username,
        accessToken,
      });
      return;
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "An error occured while verifying password",
      });
      return;
    });
});

router.get("/auth", authenticateToken, async (req, res) => {
  res.json(req.user);
});

router.get("/account", authenticateToken, async (req, res) => {
  const reviews = await Reviews.findAll({
    where: { creator: req.user.id },
    include: [{ model: Users }, { model: HelpfulVotes }, { model: Courses }],
    order: [["createdAt", "DESC"]],
  });
  Users.findOne({
    where: { id: req.user.id },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          status: "FAILED",
          message: "No user found",
        });
        return;
      }
      res.status(200).json({ user, reviews });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while getting user",
      });
      return;
    });
});

router.get("/number-of-users", authenticateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user.admin || user.username !== "admin") {
    res.json({
      status: "FAILED",
      message: "You can't get number of users",
    });
    return;
  }

  Users.findAll()
    .then((users) => {
      res.status(200).json(users.length - 1);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        status: "FAILED",
        message: "Some error occured while looking for total number of users",
      });
    });
});

module.exports = router;

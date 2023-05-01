const { verify } = require("jsonwebtoken");
const firebase = require("firebase-admin");
const { Users } = require("../models");

const authenticateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (accessToken == null) {
    res.json({
      status: "FAILED",
      message: "User is not logged in",
    });
    return;
  }

  // Check if user logged in with google
  try {
    const firebaseUser = await firebase.auth().verifyIdToken(accessToken);
    if (firebaseUser) {
      const dbUser = await Users.findOne({
        where: { email: firebaseUser.email },
        raw: true,
      });
      req.user = dbUser;
      next();
      return;
    }
  } catch (errorGoogle) {
    // Check if user is local
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error || !user) {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "Access denied local",
        });
        return;
      }
      req.user = user;
      next();
    });
  }
};

module.exports = { authenticateToken };

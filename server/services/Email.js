require("dotenv").config();

const nodemailer = require("nodemailer");

// This file contains all sending email functions
// Within are email to admin when a review has been reported 10 times, and email to verify a users email address

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Sends email to admin when a review has reached 10 report votes, admin can then be notified and moderate the reviews
const verifyReportedReview = (reviewId) => {
  const emailOptions = {
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "Reported Review",
    html: `<p>Review with id: ${reviewId} has reached 10 report votes. Please check the review and decide if it should be deleted.</p>`,
  };

  transporter.sendMail(emailOptions).catch((error) => {
    console.log(error);
    return;
  });
};

// Sends email to user that is creating an account, so that they can verify their email address
const verifyEmail = (id, email, token) => {
  const url = process.env.REACT_APP_URL;

  const emailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup process into your account.</p>
    <p>This link <b>expires in 60 minutes</b>. </p>
    <p>Press <a href=${`${url}email-verification/${id}/${token}/`}>here</a> to proceed.</p>`,
  };

  transporter.sendMail(emailOptions).catch((error) => {
    console.log(error);
    return;
  });
};

module.exports = { verifyEmail, verifyReportedReview };

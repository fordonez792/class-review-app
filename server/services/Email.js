require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const verifyReportedReview = (reviewId) => {
  const emailOptions = {
    from: process.env.EMAIL,
    to: "fordonez792@gmail.com",
    subject: "Reported Review",
    html: `<p>Review with id: ${reviewId} has reached 10 report votes. Please check the review and decide if it should be deleted.</p>`,
  };

  transporter.sendMail(emailOptions).catch((error) => {
    console.log(error);
    return;
  });
};

const verifyEmail = (id, email, token) => {
  const url = "http://localhost:3000/";

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

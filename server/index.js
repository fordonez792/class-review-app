const express = require("express");
const http = require("http");
const cors = require("cors");
const firebase = require("firebase-admin");
const firebaseCredentials = require("./FirebaseCredentials.json");
const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCredentials),
});

const db = require("./models");

const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);
const reviewsRouter = require("./routes/Reviews");
app.use("/reviews", reviewsRouter);
const emailVerificationRouter = require("./routes/EmailVerification");
app.use("/email-verification", emailVerificationRouter);
const helpfulVotesRouter = require("./routes/HelpfulVotes");
app.use("/helpful-votes", helpfulVotesRouter);
const reportVotesRouter = require("./routes/ReportVotes");
app.use("/report-votes", reportVotesRouter);
const chatbotRouter = require("./routes/Chatbot");
app.use("/chatbot", chatbotRouter);

const collegesRouter = require("./routes/Colleges");
app.use("/colleges", collegesRouter);
const departmentsRouter = require("./routes/Departments");
app.use("/departments", departmentsRouter);
const coursesRouter = require("./routes/Courses");
app.use("/courses", coursesRouter);

db.sequelize.sync().then(() => {
  server.listen("3001", () => {
    console.log("server running");
  });
});

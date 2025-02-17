require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const app = express();
const LoginRouter = require("./routes/LoginRouter");
const registerRouter = require("./routes/registerRouter");
const { specs, swaggerUi } = require('./swagger');

const cors = require("cors");

const PORT = process.env.PORT || 80;
const date = new Date();
mongoose
  .connect(process.env.MONGO_URI)
  .then((data) => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

  app.all("*", (req, res, next) => {
    const date = new Date();
    console.log(
      `--> url:${req.url} status:${res.statusCode} ${date.toLocaleTimeString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
          hour12: false, // Use 24-hour format
          weekday: "short", // Show abbreviated weekday name
          year: "numeric", // Show full year
          month: "short", // Show abbreviated month name
          day: "numeric", // Show day of the month
          hour: "2-digit", // Show hours in 2-digit format
          minute: "2-digit", // Show minutes in 2-digit format
          second: "2-digit", // Show seconds in 2-digit format
        }
      )}`
    );
    next();
  });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/static")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "connected to server successfully" });
//   // res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

app.get("/", (req, res) => {
  console.log("from home");
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login/", (req, res) => {
  console.log("from login");
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register/", (req, res) => {
  console.log("from register");
  res.sendFile(path.join(__dirname, "views", "regsiter.html"));
});

app.use("/api/auth", LoginRouter);

app.use("/api/register", registerRouter);


app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log("server running " + ` http://localhost:` + PORT + "/");
});

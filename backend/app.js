const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const path = require("path");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

app.use(express.static(path.join(__dirname, "/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});




module.exports = app;


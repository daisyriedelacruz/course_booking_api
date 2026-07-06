const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

// Routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  // origin that is allowed to send requests
  origin: ["http://localhost:3000", "https://course-booking-jade.vercel.app/"],
  // allows credentials like authorization headers
  credentials: true,
  // Provides status code for successful request
  optionsSuccessStatus: 200,
  // methods: ["GET", "POST"]
};

app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use("/users", userRoutes);
app.use("/courses", courseRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online at port ${process.env.PORT || 3000}`);
  });
}

module.exports = { app, mongoose };

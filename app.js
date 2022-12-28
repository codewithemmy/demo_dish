require("dotenv").config();
require("express-async-errors");
const mongoose = require('mongoose')
mongoose.set("strictQuery", true);

// extra security packages
// const helmet = require('helmet');
const cors = require("cors");
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
// const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//serve exprss json
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/auth", authRouter);

//serve exprss json
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

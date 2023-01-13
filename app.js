require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const passport = require("passport");

const session = require("express-session");
app.use(
  session({
    secret: "cats",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload({ useTempFiles: true }));

// extra security packages
// const helmet = require('helmet');
const cors = require("cors");
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const connectDB = require("./db/connect");
// const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const passportRouter = require("./routes/passportRoutes");
const partnerRouter = require("./routes/partner");
const businessInfoRouter = require("./routes/businessInfoRoute");
const storeDetailsRouter = require("./routes/storeDetailsRoute");
const documentsUploadRouter = require("./routes/documentsRoutes");
const menuRouter = require("./routes/menuRoute");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//serve exprss json
app.use(express.json());
app.use(cors());

// routes
// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.use("", passportRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", partnerRouter);
app.use("/api/v1", businessInfoRouter);
app.use("/api/v1", storeDetailsRouter);
app.use("/api/v1", documentsUploadRouter);
app.use("/api/v1", menuRouter);

//serve exprss json
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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

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

// extra security packages
// const helmet = require('helmet');
const cors = require("cors");
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');
app.use(fileUpload({ useTempFiles: true }));

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const customerAuthRouter = require("./routes/customerAuth");
const customerOrderRouter = require("./routes/customerOrderRoute");
const customerMenuRouter = require("./routes/customerMenu");
const customerDeliveryRouter = require("./routes/customerDelivery");
const customerStoreRouter = require("./routes/customerStore");
const authRouter = require("./routes/auth");
const passportRouter = require("./routes/passportRoutes");
const partnerRouter = require("./routes/partner");
const businessInfoRouter = require("./routes/businessInfoRoute");
const storeDetailsRouter = require("./routes/storeDetailsRoute");
const documentsUploadRouter = require("./routes/documentsRoutes");
const menuRouter = require("./routes/menuRoute");
const foodRouter = require("./routes/foodRoutes");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//serve exprss json
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    '<h1>Afrlish</h1><a href="https://documenter.getpostman.com/view/23195379/2s8Z73xWKH#2e837a54-f4af-4e6d-8ea7-ff81fd8acf7b">Documentation</a>'
  );
});

app.use("", passportRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customer", customerAuthRouter);
app.use("/api/v1/customer", customerOrderRouter);
app.use("/api/v1/customer", customerMenuRouter);
app.use("/api/v1/customer", customerDeliveryRouter);
app.use("/api/v1/customer", customerStoreRouter);
app.use("/api/v1", partnerRouter);
app.use("/api/v1", businessInfoRouter);
app.use("/api/v1", storeDetailsRouter);
app.use("/api/v1", documentsUploadRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", foodRouter);

//serve exprss json
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// const start = async () => {
//   try {
//     await mongoose
//       .connect(process.env.MONGO_URI)
//       .then((result) => console.log(`db is connectded`))
//       .catch((err) => console.log(`error ${err}`));

//     app.listen(port, () => {
//       console.log(`listening at render port ${port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();

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

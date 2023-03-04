const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const CustomerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      minlength: 2,
      maxlength: 50,
    },
    surname: {
      type: String,
      required: [true, "Please provide your last name"],
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    passwordToken: {
      type: String,
    },
    location: { type: String },
    lng: { type: Number, float: true },
    lat: { type: Number, float: true },
    passwordTokenExpirationDate: {
      type: Date,
    },
    orders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      firstName: this.firstName,
      surname: this.surname,
      email: this.email,
    },
    process.env.CUSTOMER_JWT_SECRET,
    {
      expiresIn: process.env.CUSTOMER_JWT_LIFETIME,
    }
  );
};

CustomerSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Customer", CustomerSchema);

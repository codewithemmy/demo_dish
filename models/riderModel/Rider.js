const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const RiderSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please provide your full name"],
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpirationDate: {
      type: Date,
    },
    verificationToken: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

RiderSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      fullname: this.fullname,
      phonenumber: this.phonenumber,
      email: this.email,
    },
    process.env.RIDER_JWT_SECRET,
    {
      expiresIn: process.env.RIDER_JWT_LIFETIME,
    }
  );
};

RiderSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Rider", RiderSchema);

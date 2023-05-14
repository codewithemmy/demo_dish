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
    location: { type: String },
    image: { type: String },
    location: {
      type: { type: String },
      coordinates: [],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    passwordToken: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    resetTokenExpirationDate: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    ratings: { type: Number },
    longitude: { type: Number },
    latitude: { type: Number },
    serviceAvailable: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

RiderSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

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

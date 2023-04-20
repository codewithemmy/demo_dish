const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const CustomerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your first name"],
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
      minlength: 3,
    },
    passwordToken: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    address: { type: String },
    image: { type: String },
    location: {
      type: { type: String },
      coordinates: [],
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
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

CustomerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      fullName: this.fullName,
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

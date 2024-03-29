const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const SellarSchema = new mongoose.Schema(
  {
    floor: { type: String },
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      minlength: 3,
      maxlength: 50,
    },
    surname: {
      type: String,
      required: [true, "Please provide your surname"],
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
    wallet: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
    },
    currency: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    image: {
      type: String,
    },
    storeType: {
      type: String,
    },
    numberOfLocation: {
      type: Number,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
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

SellarSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

SellarSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      firstName: this.firstName,
      surname: this.surname,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

SellarSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Sellar", SellarSchema);

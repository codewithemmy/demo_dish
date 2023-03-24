const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    suggestion: {
      type: Boolean,
      default: false,
    },
    inquiry: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);

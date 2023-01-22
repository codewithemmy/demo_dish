const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    items: [
      {
        food: {
          type: mongoose.Schema.ObjectId,
          ref: "Food",
          required: [true, "provide food ID"],
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paymentResponse: { type: String },
    orderStatus: { type: String, enum: ["pending", "paid", "success"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

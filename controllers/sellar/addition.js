const { StatusCodes } = require("http-status-codes");
const Order = require("../../models/customerModel/CustomerOrder");

// get pending order for seller
const getPendingOrder = async (socket, sellar) => {
  try {
    const orders = await Order.find({
      sellarId: sellar.userId,
      orderStatus: "pending",
    })
      .populate({
        path: "orderedBy",
        select: "firstName surname _id",
      })
      .populate("items.food");

    if (orders.length > 0) {
      // Send the orders to the client through the socket
      socket.emit("pendingOrders", orders);
    } else {
      // Send an empty array to the client through the socket
      socket.emit("pendingOrders", []);
    }
  } catch (err) {
    // Send an error message to the client through the socket
    socket.emit("error", "Error getting orders");
  }
};


/// currency api

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define schema and model for storing country and its currency symbol
const countrySchema = new mongoose.Schema({
  name: String,
  currency: String,
});

const Country = mongoose.model("Country", countrySchema);

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Define endpoint for getting currency symbol of a country and storing it in the database
app.post("/currency", async (req, res) => {
  const { name } = req.body;

  try {
    // Call REST API to get currency data of the country
    const response = await axios.get(
      `https://restcountries.com/v2/name/${name}?fullText=true`
    );
    const { currencies } = response.data[0];

    // Store country and currency symbol in the database
    const country = new Country({ name, currency: currencies[0].symbol });
    await country.save();

    // Send currency symbol as response
    res.send(currencies[0].symbol);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting currency data");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

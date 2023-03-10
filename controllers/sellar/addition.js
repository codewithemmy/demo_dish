// const { StatusCodes } = require("http-status-codes");
// const Order = require("../../models/customerModel/CustomerOrder");

// // get pending order for seller
// const getPendingOrder = async (socket, sellar) => {
//   try {
//     const orders = await Order.find({
//       sellarId: sellar.userId,
//       orderStatus: "pending",
//     })
//       .populate({
//         path: "orderedBy",
//         select: "firstName surname _id",
//       })
//       .populate("items.food");

//     if (orders.length > 0) {
//       // Send the orders to the client through the socket
//       socket.emit("pendingOrders", orders);
//     } else {
//       // Send an empty array to the client through the socket
//       socket.emit("pendingOrders", []);
//     }
//   } catch (err) {
//     // Send an error message to the client through the socket
//     socket.emit("error", "Error getting orders");
//   }
// };

// /// currency api

// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const mongoose = require("mongoose");

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/myapp", { useNewUrlParser: true });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

// // Define schema and model for storing country and its currency symbol
// const countrySchema = new mongoose.Schema({
//   name: String,
//   currency: String,
// });

// const Country = mongoose.model("Country", countrySchema);

// // Initialize express app
// const app = express();
// app.use(bodyParser.json());

// // Define endpoint for getting currency symbol of a country and storing it in the database
// app.post("/currency", async (req, res) => {
//   const { name } = req.body;

//   try {
//     // Call REST API to get currency data of the country
//     const response = await axios.get(
//       `https://restcountries.com/v2/name/${name}?fullText=true`
//     );
//     const { currencies } = response.data[0];

//     // Store country and currency symbol in the database
//     const country = new Country({ name, currency: currencies[0].symbol });
//     await country.save();

//     // Send currency symbol as response
//     res.send(currencies[0].symbol);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error getting currency data");
//   }
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// /**create an endpoint in node js express js that will store riders account, create a wallet, and send money to their bank account automatically */
// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const axios = require("axios");

// // Set up middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Endpoint for creating a rider's account and wallet
// app.post("/createRider", async (req, res) => {
//   try {
//     // Get the rider's details from the request body
//     const { name, email, phone } = req.body;

//     // TODO: Store the rider's details in your database

//     // Create a wallet for the rider using your payment gateway's API
//     const wallet = await axios.post(
//       "https://payment-gateway.com/wallet/create",
//       {
//         name,
//         email,
//         phone,
//       }
//     );

//     // TODO: Store the rider's wallet information in your database

//     // Send a success response to the client
//     res
//       .status(200)
//       .json({ message: "Rider account and wallet created successfully." });
//   } catch (error) {
//     // Handle errors
//     console.log(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });

// // Endpoint for sending money from a rider's wallet to their bank account
// app.post("/sendMoney", async (req, res) => {
//   try {
//     // Get the rider's wallet ID and bank account details from the request body
//     const { walletId, accountNumber, bankCode, amount } = req.body;

//     // TODO: Retrieve the rider's wallet information from your database

//     // Send the specified amount to the rider's bank account using your payment gateway's API
//     const transaction = await axios.post(
//       "https://payment-gateway.com/transaction/send",
//       {
//         walletId,
//         accountNumber,
//         bankCode,
//         amount,
//       }
//     );

//     // TODO: Update the rider's wallet balance in your database

//     // Send a success response to the client
//     res.status(200).json({ message: "Money sent successfully." });
//   } catch (error) {
//     // Handle errors
//     console.log(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

// /**modify the above code to use cron job in sending money to bank account every week */

// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const cron = require("node-cron");

// // Set up middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Endpoint for creating a rider's account and wallet
// app.post("/createRider", async (req, res) => {
//   try {
//     // Get the rider's details from the request body
//     const { name, email, phone } = req.body;

//     // TODO: Store the rider's details in your database

//     // Create a wallet for the rider using your payment gateway's API
//     const wallet = await axios.post(
//       "https://payment-gateway.com/wallet/create",
//       {
//         name,
//         email,
//         phone,
//       }
//     );

//     // TODO: Store the rider's wallet information in your database

//     // Send a success response to the client
//     res
//       .status(200)
//       .json({ message: "Rider account and wallet created successfully." });
//   } catch (error) {
//     // Handle errors
//     console.log(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });

// // Cron job for sending money to a rider's bank account every week
// cron.schedule("0 0 * * 0", async () => {
//   try {
//     // TODO: Retrieve a list of all riders from your database

//     // Loop through the list of riders
//     for (const rider of riders) {
//       // TODO: Retrieve the rider's wallet and bank account information from your database

//       // Send the specified amount to the rider's bank account using your payment gateway's API
//       const transaction = await axios.post(
//         "https://payment-gateway.com/transaction/send",
//         {
//           walletId,
//           accountNumber,
//           bankCode,
//           amount,
//         }
//       );

//       // TODO: Update the rider's wallet balance and transaction history in your database
//     }

//     console.log("Money sent to all riders successfully.");
//   } catch (error) {
//     console.log(error);
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

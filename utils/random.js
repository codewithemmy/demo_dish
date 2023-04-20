

// const express = require("express");
// const axios = require("axios");

// const DVLA_API_KEY = "YOUR_DVLA_API_KEY";

// app.get("/car-details/:license", async (req, res) => {
//   const license = req.params.license;
//   const url = `https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles/${license}`;
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "x-api-key": DVLA_API_KEY,
//       },
//     });
//     const data = response.data;
//     const carDetails = {
//       make: data.make,
//       model: data.model,
//       color: data.colour,
//       year: data.yearOfManufacture,
//       registration: data.registrationNumber,
//     };
//     res.send(carDetails);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving car details");
//   }
// });


// app.get("/check-license/:licenseNumber", async (req, res) => {
//   const licenseNumber = req.params.licenseNumber;
//   const url = `https://driver-vehicle-licensing.api.gov.uk/driving-entitlement/${licenseNumber}`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "x-api-key": YOUR_API_KEY_HERE,
//       },
//     });

//     const licenseData = response.data;
//     res.json(licenseData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error checking license" });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });


// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });
// const randomNumberGenerator = () => {
//     let random = Math.floor(Math.random() * 10000);

//     return random;
//   };

//   module.exports = { randomNumberGenerator };

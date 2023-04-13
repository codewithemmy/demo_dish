const axios = require("axios");

// Define endpoint for getting currency symbol of a country and storing it in the database

const currency = async (country) => {
  try {
    // Call REST API to get currency data of the country
    const response = await axios.get(
      `https://restcountries.com/v2/name/${country}?fullText=true`
    );
    const { currencies } = response.data[0];

    const result = currencies[0].symbol;

    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { currency };

const express = require("express");

const exphbs = require("express-handlebars");

const app = express(); // Generate the email template with Handlebars

// Configure Handlebars as the template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const templateData = {
  imageUrl: "https://example.com/signup-image.jpg", // Replace with the URL of your signup image
};

const emailHtml = app.renderView("email-template", templateData); // Render the Handlebars template

module.exports = emailHtml;

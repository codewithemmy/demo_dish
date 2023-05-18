const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
handlebars.registerHelper("eq", (a, b) => a == b);

const source = fs.readFileSync(
  path.join(__dirname, `../templates/emailTemplate.hbs`),
  "utf8"
);

const compiledTemplate = handlebars.compile(source);


module.exports = compiledTemplate;

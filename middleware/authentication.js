const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ msg: "Token not found" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the routes
    req.user = {
      userId: payload.userId,
      fisrtname: payload.firstName,
      surname: payload.surname,
      email: payload.email,
    };
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ msg: "Authentication invalid" });
  }
};

module.exports = auth;

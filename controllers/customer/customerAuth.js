const Customer = require("../../models/customerModel/Customer");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

//register sellar
const register = async (req, res) => {
  const { fullName, email } = req.body;

  const emailAlreadyExists = await Customer.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "Email already exist" });
  }

  const customer = await Customer.create({
    ...req.body,
    orders: [],
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: email, // list of receivers
    subject: "AFRILISH REGISTRATION SUCCESSFUL", // Subject line
    html: `Hello, ${fullName}, welcome to the best cuisine delicacies. Your registration with Afrilish is success.</h4>`, // html body
  });

  return res.status(StatusCodes.CREATED).json({
    msg: "Resgisration Successful",
    customer,
  });
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide email or password" });
  }
  const customer = await Customer.findOne({ email });

  if (!customer) {
    return res
      .status(404)
      .json({ msg: "Cusotmer not found. Register to login" });
  }

  //compare password
  const isPasswordCorrect = await customer.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password is not valid" });
  }

  //create token
  let token = customer.createJWT();

  return res
    .status(200)
    .json({ msg: "Login Successful", userId: customer._id, token: token });
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please provide valid email" });
  }

  const customer = await Customer.findOne({ email });

  if (customer) {
    const passwordToken = crypto.randomBytes(2).toString("hex");

    // send email
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: email,
      subject: "AFRILISH: Reset you account",
      html: `Hi, kindly reset your password with this token: <h4>${passwordToken}</h4>`,
    });

    //set otp timeout to 60 ten minutes
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    customer.passwordToken = passwordToken;
    customer.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await customer.save();
  }

  return res.status(StatusCodes.OK).json({
    msg: "Please check your email to reset password",
  });
};

//reset password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword) {
    return res.status(400).json({ msg: "Please provide all values" });
  }
  const customer = await Customer.findOne({ email });

  if (customer) {
    const currentDate = new Date();

    if (
      customer.passwordToken === token &&
      customer.passwordTokenExpirationDate > currentDate
    ) {
      customer.password = newPassword;
      customer.passwordToken = "";
      customer.passwordTokenExpirationDate = "";
      await customer.save();

      return res
        .status(200)
        .json({ msg: "your password is sucessfully reset" });
    }
    return res.status(400).json({ msg: "unable to reset password" });
  }
};

//change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (req.user) {
    const customer = await Customer.findOne({ _id: req.user.userId });
    if (!customer) {
      return res.status(404).json({ msg: `unable to find user` });
    }

    //compare password
    const isPasswordCorrect = await customer.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ msg: `old password does not match with current password` });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await customer.updateOne({ password: hash });

    return res.status(200).json({ msg: `Password Successfully changed` });
  }

  return res.status(400).json({ msg: `unable to change password` });
};

//export modules
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};

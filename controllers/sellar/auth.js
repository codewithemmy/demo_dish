const Sellar = require("../../models/sellarModel/Sellar");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

const { currency } = require("../../utils/currency");

//register sellar
const register = async (req, res) => {
  const { country, email, firstName } = req.body;
  let symbol = await currency(country);

  const emailAlreadyExists = await Sellar.findOne({ email });

  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "Email already exist" });
  }

  const verificationToken = crypto.randomBytes(2).toString("hex");
  const hastToken = createHash(verificationToken);
  const sellar = await Sellar.create({
    ...req.body,
    currency: symbol,
    verificationToken: hastToken,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: email, // list of receivers
    subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
    html: `Hello, ${firstName}, kindly verify your account with this token:<h4>${verificationToken}</h4>`, // html body
  });

  let token = sellar.createJWT();

  return res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    sellar,
    token,
  });
};

//verify user
const verifyEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationToken } = req.body;
  const sellar = await Sellar.findOne({ _id: id });

  if (!verificationToken) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Kindly input your token" });
  }

  if (!sellar) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Sellar not found" });
  }

  const hastToken = createHash(verificationToken);

  if (sellar.verificationToken !== hastToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Verification Failed" });
  }

  (sellar.isVerified = true), (sellar.verified = Date.now());
  sellar.verificationToken = "";

  await sellar.save();

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: sellar.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: `<h4> Hello, ${sellar.firstName}</h4> <h2>Congrats</h2> you are now verified,you can login now`, // html body
  });

  return res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide username or password" });
  }
  const sellar = await Sellar.findOne({ email });

  if (!sellar) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Sellar not found" });
  }

  const isPasswordCorrect = await sellar.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password is not valid" });
  }

  if (!sellar.isVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please verify your account" });
  }

  let token = sellar.createJWT();

  return res.status(StatusCodes.OK).json({
    msg: "Login Successful",
    userId: sellar._id,
    token: token,
  });
};

//user logout
// const logout = async (req, res) => {
//   res.cookie("token", "logout", {
//     httpOnly: true,
//     expires: new Date(Date.now() + 1000),
//   });
//   res.status(StatusCodes.OK).json({ msg: "user logged out!" });
// };

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide valid email" });
  }

  const sellar = await Sellar.findOne({ email });

  if (sellar) {
    const passwordToken = crypto.randomBytes(2).toString("hex");

    // send email
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: email,
      subject: "Reset you account",
      html: `Hi, kindly reset your password with this token: <h4>${passwordToken}</h4>`,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    sellar.passwordToken = createHash(passwordToken);
    sellar.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await sellar.save();
  }

  return res.status(StatusCodes.OK).json({
    msg: "Please check your email to reset password",
  });
};

//reset password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all values" });
  }
  const sellar = await Sellar.findOne({ email });

  if (sellar) {
    const currentDate = new Date();

    if (
      sellar.passwordToken === createHash(token) &&
      sellar.passwordTokenExpirationDate > currentDate
    ) {
      sellar.password = newPassword;
      sellar.passwordToken = null;
      sellar.passwordTokenExpirationDate = null;
      await sellar.save();
    }
  }
  return res
    .status(StatusCodes.OK)
    .json({ msg: "your password is sucessfully reset" });
};

//change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (req.user) {
    const sellar = await Sellar.findOne({ _id: req.user.userId });
    if (!sellar) {
      return res.status(404).json({ msg: `unable to find sellar` });
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

    await sellar.updateOne({ password: hash });

    return res.status(200).json({ msg: `Password Successfully changed` });
  }

  return res.status(400).json({ msg: `unable to change password` });
};

//export modules
module.exports = {
  register,
  login,
  // logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};

const Rider = require("../../models/riderModel/Rider");
const crypto = require("crypto");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");
// const { randomNumberGenerator } = require("../../utils/random");

//register Rider
const register = async (req, res) => {
  const { fullname, email, phonenumber, password } = req.body;

  const emailAlreadyExists = await Rider.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "Email already exist" });
  }

  const verificationToken = crypto.randomBytes(2).toString("hex");
  const hastToken = createHash(verificationToken);
  const rider = await Rider.create({
    ...req.body,
    verificationToken: hastToken,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Aflilish" <afrilish@afrilish.com>', // sender address
    to: email, // list of receivers
    subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
    html: `Hello, ${fullname}, kindly verify your account with this otp:<h4>${verificationToken}</h4>`, // html body
  });

  let token = rider.createJWT();

  return res.status(200).json({
    msg: "Success! Please check your email to verify account",
    rider: rider._id,
  });
};

//login Rider
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ msg: "Please provide username or password" });
  }

  const rider = await Rider.findOne({ email });

  const isPasswordCorrect = await rider.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Password is not valid" });
  }

  if (!rider.isVerified) {
    return res.status(400).json({ msg: "please verify your account" });
  }

  let token = rider.createJWT();

  return res.status(200).json({
    msg: "Login Successful",
    userId: rider._id,
    token: token,
  });
};

//verify user
const verifyEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationToken } = req.body;
  const rider = await Rider.findOne({ _id: id });

  if (!verificationToken) {
    return res.status(404).json({ msg: "Kindly input your token" });
  }

  if (!rider) {
    return res.status(404).json({ msg: "Rider not found" });
  }

  const hastToken = createHash(verificationToken);

  if (rider.verificationToken !== hastToken) {
    return res.status(400).json({ msg: "Verification Failed" });
  }

  (rider.isVerified = true), (rider.verified = Date.now());
  rider.verificationToken = "";

  await rider.save();

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: rider.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: `<h4> Hello, ${rider.fullname}</h4> <h2>Congrats</h2> you are now verified,you can login now`, // html body
  });

  return res.status(200).json({ msg: "Email Verified" });
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please provide valid email" });
  }

  const rider = await Rider.findOne({ email });

  if (rider) {
    const passwordToken = crypto.randomBytes(2).toString("hex");

    // send email
    mailTransport.sendMail({
      from: '"Afrilish" <Afrilish@gmail.com>', // sender address
      to: email,
      subject: "Reset Your Account",
      html: `Hi, kindly reset your password with this token: <h4>${passwordToken}</h4>`,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    rider.passwordToken = createHash(passwordToken);
    rider.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await rider.save();
  }

  return res.status(200).json({
    msg: "Please check your email to reset password",
  });
};

//reset password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword) {
    return res.status(200).json({ msg: "Please provide all values" });
  }
  const rider = await Rider.findOne({ email });

  if (rider) {
    const currentDate = new Date();

    if (
      rider.passwordToken === createHash(token) &&
      rider.passwordTokenExpirationDate > currentDate
    ) {
      rider.password = newPassword;
      rider.passwordToken = null;
      rider.passwordTokenExpirationDate = null;
      await rider.save();
    }
  }
  return res.status(200).json({ msg: "your password is sucessfully reset" });
};

const riderAvailable = async (req, res) => {
  const rider = req.user.userId;
  if (rider) {
    const verifyRider = await Rider.findOne({
      _id: rider,
    });
    if (!verifyRider) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `not a verified rider` });
    }

    verifyRider.serviceAvailable = !verifyRider.serviceAvailable;
    const result = await verifyRider.save();

    return res.status(200).json({ msg: `rider is now available` });
  }
};

//change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (req.user) {
    const rider = await Rider.findOne({ _id: req.user.userId });
    if (!rider) {
      return res.status(404).json({ msg: `unable to find rider` });
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

    await rider.updateOne({ password: hash });

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
  riderAvailable,
  changePassword,
};

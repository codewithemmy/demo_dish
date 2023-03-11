const Rider = require("../../models/riderModel/Rider");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
// const { randomNumberGenerator } = require("../../utils/random");

//register Rider
const register = async (req, res) => {
  const { fullname, email, phonenumber, password } = req.body;

  const emailAlreadyExists = await Rider.findOne({ email });
  if (emailAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email already exist" });
  }

  const verificationToken = crypto.randomBytes(2).toString("hex");
  const hastToken = createHash(verificationToken);
  const rider = await Rider.create({
    fullname,
    email,
    phonenumber,
    password,
    verificationToken: hastToken,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Aflilish" <Afrilish@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
    html: `Hello, ${fullname}, kindly verify your account with this otp:<h4>${verificationToken}</h4>`, // html body
  });

  let token = rider.createJWT();

  return res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    rider,
    token,
  });
};

//verify user
const verifyEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationToken } = req.body;
  const rider = await Rider.findOne({ _id: id });

  if (!verificationToken) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Kindly input your token" });
  }

  if (!rider) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Rider not found" });
  }

  const hastToken = createHash(verificationToken);

  if (rider.verificationToken !== hastToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Verification Failed" });
  }

  (rider.isVerified = true), (rider.verified = Date.now());
  rider.verificationToken = "";

  await rider.save();

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <Afrilish@gmail.com>', // sender address
    to: Rider.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: `<h4> Hello, ${rider.fullname}</h4> <h2>Congrats</h2> you are now verified,you can login now`, // html body
  });

  return res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

//user login
const riderLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide username or password" });
  }
  const rider = await Rider.findOne({ email });

  if (!rider) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "rider not found" });
  }

  const isPasswordCorrect = await Rider.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password is not valid" });
    s;
  }

  if (!rider.isVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please verify your account" });
  }

  let token = Rider.createJWT();

  return res.status(StatusCodes.OK).json({
    msg: "Login Successful",
    userId: rider._id,
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
  return res
    .status(StatusCodes.OK)
    .json({ msg: "your password is sucessfully reset" });
};

//export modules
module.exports = {
  register,
  riderLogin,
  // logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

const Rider = require("../../models/riderModel/Rider");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const { randomNumberGenerator } = require("../../utils/random");

//register sellar
const register = async (req, res) => {
  const { fullname, email, phonenumber } = req.body;
  const emailAlreadyExists = await Rider.findOne({ email });
  if (emailAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email already exist" });
  }

  const rider = await Rider.create({
    fullname,
    email,
    phonenumber,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrlish@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "AFRILISH RIDER REGISTRATION SUCCESSFUL", // Subject line
    html: `Hello, Mr. ${fullname}. We are gladly ready to work with you.</h4>`, // html body
  });

  return res.status(StatusCodes.CREATED).json({
    msg: "Rider Resgistration Successful",
    userId: rider._id,
    fullname: fullname,
    emal: email,
    phone: phonenumber,
  });
};

const riderLogin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide email" });
  }
  const rider = await Rider.findOne({ email });

  if (!rider) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid username" });
  }

  const twentyMinutes = 1000 * 60 * 20;
  const resetTokenExpirationDate = new Date(Date.now() + twentyMinutes);

  // const hastToken = createHash(randomNumberGenerator());
  const otp = randomNumberGenerator();

  rider.resetTokenExpirationDate = resetTokenExpirationDate;
  (rider.verificationToken = otp), await rider.save();

  let token = rider.createJWT();
  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrlish@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "OTP FOR LOGIN", // Subject line
    html: `Hello, Mr. ${rider.fullname}, your verification token is: ${otp}. We are gladly ready to work with you.</h4>`, // html body
  });

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Login Successful, verify you login", token: token });
};

//verify token
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
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "rider not found" });
  }

  if (rider.verificationToken !== verificationToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Verification Failed, or token not thesame" });
  }
  if (rider.resetTokenExpirationDate < Date.now()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Time Out, you can resend" });
  }

  rider.isVerified = true;
  rider.verificationToken = "";

  await rider.save();

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <Afrilish@gmail.com>', // sender address
    to: rider.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: `<h4> Hello, ${rider.fullname}</h4> <h2>Congrats</h2> you are now verified`, // html body
  });

  return res.status(StatusCodes.OK).json({ msg: "Token verified" });
};

//logout
const logout = async (req, res) => {
  const { id: user } = req.params;
  const rider = await Rider.findOne({ _id: user });
  rider.isVerified = false;
  await rider.save();
  return res.status(200).json({ msg: `logout successful` });
};

//export modules
module.exports = {
  register,
  verifyEmail,
  riderLogin,
  logout,
};

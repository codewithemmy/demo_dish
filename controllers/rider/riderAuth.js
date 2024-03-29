const Rider = require("../../models/riderModel/Rider");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");
const otpGenerator = require("../../utils/random");

const compiledTemplate = require("../../utils/email");

//register Rider
const register = async (req, res) => {
  const { fullname, email } = req.body;

  const emailAlreadyExists = await Rider.findOne({ email });

  if (emailAlreadyExists) {
    return res
      .status(400)
      .json({ msg: "Email already exist, you can login as a user" });
  }

  const verificationToken = otpGenerator();

  const templateData = {
    welcome: `We are delighted to have you on board`,
    welcome2: `Please use the following One Time Password`,
    name: fullname,
    verificationToken: `(OTP): ${verificationToken}`,
    imageUrl:
      "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
  };

  const hastToken = createHash(verificationToken);
  const rider = await Rider.create({
    ...req.body,
    verificationToken: hastToken,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: email, // list of receivers
    subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
    html: compiledTemplate(templateData),
  });

  let token = rider.createJWT();

  return res.status(200).json({
    msg: "Success! Please check your email to verify account",
    rideId: rider._id,
    token,
  });
};

//send verify mail
const sendVerifyMail = async (req, res) => {
  const riderId = req.params.id;

  if (riderId) {
    const rider = await Rider.findOne({ _id: riderId });

    if (!rider) {
      return res.status(400).json({ msg: `rider params id not found` });
    }

    const verificationToken = otpGenerator();

    const templateData = {
      welcome: `We are delighted to have you on board`,
      welcome2: `Please use the following One Time Password`,
      name: rider.fullname,
      verificationToken: `(OTP): ${verificationToken}`,
      imageUrl:
        "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
    };

    const hastToken = createHash(verificationToken);
    rider.verificationToken = hastToken;
    await rider.save();
    //send Mail
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: rider.email, // list of receivers
      subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
      html: compiledTemplate(templateData), // html body
    });

    return res.status(200).json({
      msg: "Success! Please check your email to verify account",
    });
  }

  return res.status(400).json({
    msg: "unable to send otp for verification",
  });
};

//login Rider
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ msg: "Please provide username or password" });
  }

  const rider = await Rider.findOne({ email });

  if (!rider) {
    return res.status(404).json({ msg: "Rider not found" });
  }

  const isPasswordCorrect = await rider.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Password is not valid" });
  }

  if (!rider.isVerified) {
    return res
      .status(400)
      .json({ msg: "you are not a verified rider. To login, Get verified." });
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

  const templateData = {
    welcome: ` Congrats!!! you are now verified, you can login now`,
    // welcome2: `Please use the following One Time Password`,
    name: rider.fullname,
    // verificationToken: verificationToken,
    imageUrl:
      "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
  };

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: rider.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: compiledTemplate(templateData),
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
    const passwordToken = otpGenerator();

    const templateData = {
      welcome2: `Please use the following One Time Password`,
      name: rider.fullname,
      verificationToken: `(OTP): ${passwordToken}`,
      imageUrl:
        "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
    };

    // send email
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: email,
      subject: "RESET YOUR PASSWORD",
      html: compiledTemplate(templateData),
    });

    //set otp timeout to 60 ten minutes
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    rider.passwordToken = passwordToken;
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
    return res.status(400).json({ msg: "Please provide all values" });
  }
  const rider = await Rider.findOne({ email });

  if (rider) {
    const currentDate = new Date();

    if (
      rider.passwordToken === token &&
      rider.passwordTokenExpirationDate > currentDate
    ) {
      rider.password = newPassword;
      rider.passwordToken = "";
      rider.passwordTokenExpirationDate = "";
      await rider.save();

      return res
        .status(200)
        .json({ msg: "your password is sucessfully reset" });
    }
    return res.status(400).json({ msg: "unable to reset password" });
  }
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
    const isPasswordCorrect = await rider.comparePassword(oldPassword);
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
  sendVerifyMail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  riderAvailable,
  changePassword,
};

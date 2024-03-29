const Sellar = require("../../models/sellarModel/Sellar");
const createHash = require("../../utils/createHash");
const { mailTransport } = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");
const otpGenerator = require("../../utils/random");
const compiledTemplate = require("../../utils/email");

//register sellar
const register = async (req, res) => {
  const { email, firstName } = req.body;

  const emailAlreadyExists = await Sellar.findOne({ email });

  if (emailAlreadyExists) {
    return res
      .status(400)
      .json({ msg: "Email already exist, you can login as a user" });
  }

  const verificationToken = otpGenerator();

  const templateData = {
    welcome: `We are delighted to have you on board`,
    welcome2: `Please use the following One Time Password`,
    name: firstName,
    verificationToken: `(OTP): ${verificationToken}`,
    imageUrl:
      "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
  };

  const hastToken = createHash(verificationToken);
  const sellar = await Sellar.create({
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

  let token = sellar.createJWT();

  return res.status(201).json({
    msg: "Success! Please check your email to verify account",
    sellarId: sellar._id,
    token,
  });
};

//send verify mail
const sendVerifyMail = async (req, res) => {
  const sellarId = req.params.id;

  if (sellarId) {
    const sellar = await Sellar.findOne({ _id: sellarId });

    if (!sellar) {
      return res.status(400).json({ msg: `seller params id not found` });
    }

    const verificationToken = otpGenerator();

    const templateData = {
      // welcome: `We are delighted to have you on board`,
      welcome2: `Please use the following One Time Password`,
      name: sellar.fullname,
      verificationToken: `(OTP): ${verificationToken}`,
      imageUrl:
        "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
    };

    const hastToken = createHash(verificationToken);
    sellar.verificationToken = hastToken;
    await sellar.save();

    //send Mail
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: sellar.email, // list of receivers
      subject: "VERIFY YOUR EMAIL ACCOUNT", // Subject line
      html: compiledTemplate(templateData),
    });

    return res.status(200).json({
      msg: "Success! Please check your email to verify account",
    });
  }

  return res.status(400).json({
    msg: "unable to send otp for verification",
  });
};

//verify user
const verifyEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationToken } = req.body;
  const sellar = await Sellar.findOne({ _id: id });

  if (!verificationToken) {
    return res.status(404).json({ msg: "Kindly input your token" });
  }

  if (!sellar) {
    return res.status(404).json({ msg: "Sellar not found" });
  }

  const hastToken = createHash(verificationToken);

  if (sellar.verificationToken !== hastToken) {
    return res.status(400).json({ msg: "Verification Failed" });
  }

  (sellar.isVerified = true), (sellar.verified = Date.now());
  sellar.verificationToken = "";

  await sellar.save();

  const templateData = {
    welcome: `Congrats!! you are now verified,you can login now`,
    // welcome2: `Please use the following One Time Password`,
    name: sellar.fullname,
    // verificationToken: `(OTP): ${verificationToken}`,
    imageUrl:
      "https://res.cloudinary.com/dn6eonkzc/image/upload/v1684420375/DEV/vlasbjyf9antscatbgzt.webp",
  };

  //send Mail
  mailTransport.sendMail({
    from: '"Afrilish" <afrilish@afrilish.com>', // sender address
    to: sellar.email, // list of receivers
    subject: "MAIL IS VERIFIED", // Subject line
    html: compiledTemplate(templateData),
  });

  return res.status(200).json({ msg: "Email Verified" });
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ msg: "Please provide username or password" });
  }
  const sellar = await Sellar.findOne({ email });

  if (!sellar) {
    return res.status(404).json({ msg: "Sellar not found" });
  }

  const isPasswordCorrect = await sellar.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Password is not valid" });
  }

  if (!sellar.isVerified) {
    return res
      .status(400)
      .json({ msg: "You are not verified. To login, get verified" });
  }

  let token = sellar.createJWT();

  return res.status(200).json({
    msg: "Login Successful",
    userId: sellar._id,
    token: token,
  });
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please provide valid email" });
  }

  const sellar = await Sellar.findOne({ email });

  if (sellar) {
    const passwordToken = otpGenerator();

    const templateData = {
      // welcome: `Congrats!! you are now verified,you can login now`,
      welcome2: `Please use the following One Time Password`,
      // name: sellar.fullname,
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

    sellar.passwordToken = passwordToken;
    sellar.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await sellar.save();
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
  const sellar = await Sellar.findOne({ email });

  if (sellar) {
    const currentDate = new Date();

    if (
      sellar.passwordToken === token &&
      sellar.passwordTokenExpirationDate > currentDate
    ) {
      sellar.password = newPassword;
      sellar.passwordToken = "";
      sellar.passwordTokenExpirationDate = "";
      await sellar.save();

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
    const sellar = await Sellar.findOne({ _id: req.user.userId });
    if (!sellar) {
      return res.status(404).json({ msg: `unable to find sellar` });
    }

    //compare password
    const isPasswordCorrect = await sellar.comparePassword(oldPassword);
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
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  sendVerifyMail,
};

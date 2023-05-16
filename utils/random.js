const otpGenerator = () => {
  let random = Math.floor(Math.random() * 899999);

  return random;
};

module.exports = otpGenerator;

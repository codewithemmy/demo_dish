const randomNumberGenerator = () => {
  let random = Math.floor(Math.random() * 1000000);

  return random;
};

module.exports = { randomNumberGenerator };

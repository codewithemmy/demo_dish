  const randomNumberGenerator = () => {
    let random = Math.floor(Math.random() * 10000);

    return random;
  };

  module.exports = { randomNumberGenerator };

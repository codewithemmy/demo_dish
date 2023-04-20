


const genRandomNumber = () => {
  const random = `${Math.floor(Math.random() * 89999) + 1000}`;
  return random;
};

module.exports = { genRandomNumber };

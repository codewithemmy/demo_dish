const Registration = require("../../models/riderModel/Registration");

const createReg = async (req, res) => {
  const user = req.user;
  if (user) {
    await Registration.create({
      ...req.body,
      rider: user.userId,
    });

    return res.status(200).json({ msg: `successful` });
  }
  return res.status(400).json({ msg: `unable to register` });
};

module.exports = { createReg };

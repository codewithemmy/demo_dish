const BankDetails = require("../../models/sellarModel/BankDetails");
const Sellar = require("../../models/sellarModel/Sellar");
const SellarTransaction = require("../../models/sellarModel/SellarTransaction");
const { stripeTransfer } = require("../../utils/stripeTransfer");

const getWallet = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const sellarWallet = await Sellar.findOne({ _id: sellar });

    return res.status(200).json({ walletBalance: sellarWallet.wallet });
  }
  return res.status(404).json({ msg: `unable to get wallet` });
};

const sellarWithdrawal = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const { amount } = req.body;

    const transaction = await SellarTransaction.create({
      amount: amount,
      sellar: req.user.userId,
    });

    const bank = await BankDetails.findOne({ sellar: sellar });

    await stripeTransfer(
      bank.bankname,
      bank.accountnumber,
      bank.accountname,
      bank.sortcode,
      amount,
      bank.accounttype
    );

    return res.status(200).json({ msg: `Successful`, transaction });
  }
  return res.status(400).json({ msg: `unable to withdraw` });
};

const sellarTransaction = async (req, res) => {
  const sellarId = req.user.userId;
  if (sellarId) {
    const history = await SellarTransaction.find({ sellar: sellarId });
    return res.status(200).json({ msg: `successful`, history });
  }
  return res.status(400).json({ msg: `unable to get history` });
};

module.exports = {
  getWallet,
  sellarWithdrawal,
  sellarTransaction,
};

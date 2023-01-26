// const mongoose = require("mongoose");
const md5 = require("md5");
// const moment = require("moment-timezone");

// const { PROVIDE_URL } = require("../../serverConf");
// const serverConf = require("../../serverConf");
// const { Sessions, Users, BankTypes } = require("../models");
// const axios = require("axios");
// exports.ObjectId = (id) => {
//   try {
//     return new mongoose.Types.ObjectId(id);
//   } catch (error) {
//     console.log("ObjectId", id);
//   }
// };
// // gamebalance
// exports.getMyAllBalance = async (username) => {
//   const data = await Users.findOne({ username });
//   return data.balance;
// };
// exports.formatMyAllBalance = async (username) => {
//   const data = await Users.findOneAndUpdate(
//     { username },
//     { balance: { MYR: 0 } }
//   );
//   return data;
// };
// exports.updateMyAllBalance = async (username, balance) => {
//   const data = await Users.findOneAndUpdate(
//     { username },
//     { balance: { MYR: balance } }
//   );
//   return data;
// };
// exports.withdrawMyAllBalance = async (username) => {
//   const withdrawData = {
//     username: username,
//     api_account: serverConf.api_account,
//     code: md5(serverConf.api_account + username + serverConf.code),
//   };
//   const { data } = await axios.post(
//     `${serverConf.PROVIDE_URL}goapi/alluserblance`,
//     withdrawData
//   );
//   console.log(data, "========>data");
//   if (data.code === 0) {
//     const result = await Users.findOneAndUpdate(
//       { username },
//       { balance: { MYR: data.data.userblance } }
//     );
//     return result;
//   } else {
//     return "error";
//   }
// };
// // gamebalance

exports.createToken = (req, res, userId) => {
  try {
    if (userId) {
      const expiration = getSessionTime();
      const Token = md5(userId + expiration);
      return { Token };
    }
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
const getSessionTime = () => {
  const time = new Date(new Date().valueOf() + parseInt(process.env.SESSION));
  return time;
  //   return moment.tz(time, process.env.TIME_ZONE);
};
// // withdraw from prvider
// exports.getAllBalance = async () => {};
// // BanksTypes
// exports.loadBankTypes = async (req, res) => {
//   const data = await BankTypes.find({});
//   return res.json(data);
// };

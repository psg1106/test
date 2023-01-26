const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const md5 = require("md5");

const mainConf = require("../../config");
// const bcrypt = require("bcrypt-nodejs");
const UsersSchema = new Schema(
  {
    name: { type: String, required: true, unique: false },
    email: { type: String, required: false, unique: false },
    birthday: { type: String, default: "" },
    country: { type: String },
    phoneNumber: { type: String },
    avatar: { type: String, default: mainConf.USERS.baseAvatarImage },
    password: { type: String, required: true },
    
    permission: {
      type: Schema.Types.ObjectId,
      default : mainConf.USERS.player
    },
    walletAddress: { type: String, required: true, unique: false },
    // walletAddress: { type: String, required: true, unique: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
UsersSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.id = this._id;
    this.password = md5(this.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

UsersSchema.methods.comparePassword = function (password) {
  return this.password == md5(password);
};

const Users = model("tbl_users", UsersSchema);
module.exports = Users;

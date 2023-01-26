const { Schema, model } = require("mongoose");
const CryptoSchema = new Schema(
  {
    coinName: {
      type: String,
      required: true,
    },
    coinSymbol: {
      type: String,
    },
    status: {
      type: Boolean
    }
  }
);

const CryptoLists = model("tbl-crypto-lists", CryptoSchema);
module.exports = CryptoLists;

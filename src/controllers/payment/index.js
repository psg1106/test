const { Users, Sessions, UserBanks, Deposit, CryptoLists } = require("../../models");
// const CryptoConvert = require("crypto-convert");
const axios = require("axios");

exports.addPayment = async (coin, tx) => {

  const getCoinValue = await axios.get(`https://api.coinconvert.net/convert/${coin}/usd?amount=${tx.value / 10 ** 18}`);
  await Users.findOneAndUpdate(
    { walletAddress: tx.from },
    {
      $inc: {
        amount: getCoinValue.data.USD
      },
    }
  );
};

exports.getCoinList = async (req, res) => {

  const coinList = await CryptoLists.find({ status: true });
  if (coinList.length == 0) {
    const newCoinList = [
      {
        coinName: "Ethereum",
        coinSymbol: "ETH",
        status: true
      },
      {
        coinName: "Tether",
        coinSymbol: "USDT",
        status: true
      },
      {
        coinName: "Binance",
        coinSymbol: "BNB",
        status: true
      },
      {
        coinName: "Ripple",
        coinSymbol: "XRP",
        status: true
      },
      {
        coinName: "Binance",
        coinSymbol: "BUSD",
        status: true
      },
      {
        coinName: "Tron",
        coinSymbol: "TRX",
        status: true
      },

    ];
    await CryptoLists.insertMany(newCoinList);
  }
  return res.json(coinList);

}

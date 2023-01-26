module.exports = {
  // DB_CONECT_URL:
  // "mongodb+srv://bets24_dbuser:PasswordBets24@bets24db.ivwxskx.mongodb.net/bets24_casino?retryWrites=true&w=majority",
  DB_CONECT_URL: "mongodb://localhost:27017/bets24_casino",
  ServerPort: 1995,
  BASEURL: __dirname + "/upload/",
  DIR: __dirname,
  session: {
    expiretime: 1000 * 60 * 60,
  },
  // game provider
  PROVIDER_URL: "https://game-int.alg4u.com",
  Secret: "e638281b-4281-4e9c-8e34-5c66fe8a",
  API_Public: "1gkcs14dtpjfj7l5m3jdg",
  API_Salt: "1gkcs14dthgiiii2ete6e",
  session: {
    expiretime: 1000 * 60 * 60,
    // expiretime: 1000,
  },
  // send Grid
  SEND_API_KEY: "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"
};

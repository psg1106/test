const Users = require("./users");
const Sessions = require("./users/sessions");
const CryptoLists = require("./cryptoes");
const games = require("./games");
module.exports = {
  Users,
  Sessions,
  CryptoLists,
  ...games,
};

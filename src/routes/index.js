const routerx = require("express-promise-router");
const users = require("./users");
const games = require("./games");
const crypto = require("./crypto");

const router = routerx();
router.use("/users", users);
router.use("/games", games);
router.use("/crypto", crypto);

module.exports = router;

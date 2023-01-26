const routerx = require("express-promise-router");
const TokenMiddleware = require("../../middlewares/token");
// const multer = require("multer");
// const { Validator, V }  = require('../../middlewares/validation');
const {
  loadGameTypes,
  getGames,
  openGame,
} = require("../../controllers/games");
const router = routerx();

// const loginLimiter= rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
router.post("/loadGameTypes", loadGameTypes);
router.post("/getGames", getGames);
router.post("/openGame", openGame);
module.exports = router;

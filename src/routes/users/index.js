const routerx = require("express-promise-router");
// const rateLimit = require("express-rate-limit");
const TokenMiddleware = require("../../middlewares/token");
const multer = require("multer");
// const { Validator, V }  = require('../../middlewares/validation');
const { signup, signin, signout,forgetPassword } = require("../../controllers/users");
const router = routerx();
// const serverConf = require("../../../serverConf");

// const loginLimiter= rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/forgetPassword", forgetPassword);

module.exports = router;

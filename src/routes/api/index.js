const routerx = require("express-promise-router");
const router = routerx();
const { Users } = require("../../models");

// const loginLimiter= rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
router.post("/authentication", async (req, res) => {
  const user = await Users.findById(req.body.userKey);
  const data = {
    token: req.body.token,
    uid: req.body.userKey,
    username: user.name,
    balance: user.amount,
    currency: user.currency,
    errorCode: 0,
  };
  return res.json(data);
});
router.post("*", (req, res) => {
  console.log(req.body);
  console.log("Here is POST Area");
  return res.json(req.body);
});
router.get("*", (req, res) => {
  console.log(req.body);
  console.log("Here is Get Area");
  return res.json(req.body);
});
module.exports = router;

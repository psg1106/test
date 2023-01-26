const routerx = require("express-promise-router");
const { getCoinList } = require("../../controllers/payment");
const router = routerx();

router.post("/getCoinList", getCoinList);
module.exports = router;
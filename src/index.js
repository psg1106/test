require("dotenv/config");
const cors = require("cors");
const { ethers } = require("ethers");
const {
  ETHWebSocketURL,
  BNBWebSocketURL,
  ADMIN_WALLET,
  USDTURL,
  USDTADDRESS,
  BUSDURL,
  BUSDADDRESS,
  XRPADDRESS
} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
// const session = require("express-session");
const useragent = require("express-useragent");
const methodOverride = require("method-override");
const { createStream } = require("rotating-file-stream");
const routes = require("./routes");
const endpoint = require("./routes/api");
const games = require("./middlewares/game");
const { addPayment, getCoinList } = require("./controllers/payment");
const { busdABI, usdtABI, xrpABI } = require("./ABI");
const config = require("../serverConf");
const socket = require("./socket");
const app = express();
const accessLogStream = createStream("access.log", {
  interval: "1d",
  path: path.join(`${config.DIR}`, "log"),
});
app.use(compression());
app.use(useragent.express());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));
app.use(methodOverride());

app.set("trust proxy", 1);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: true,
//     resave: true,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       domain: process.env.DOMAIN,
//       path: "*",
//       expires: new Date(Date.now() + 60 * 60 * 1000),
//     },
//   })
// );
if (process.env.MODE === "dev") {
  app.use(cors("*"));
} else {
  // app.use(cors(corsOptionsDelegate));
  // app.use(checkUrl);
}
var jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 20,
  type: "application/json",
});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 20,
  type: "application/x-www-form-urlencoded",
});

app.use(jsonParser);
app.use(urlencodedParser);
app.use("/api", routes);
app.use("/alg", endpoint);


app.use(express.static(config.DIR + "/upload"));
app.use(express.static(config.DIR + "/client"));


mongoose
  .connect(config.DB_CONECT_URL, {
    // useUnifiedTopology: true,
    useNewUrlParser: true,
    // autoIndex: true,
    // readPreference: "primary",
    // directConnection: true,
    // ssl: false,
    // keepAlive: true,
    // connectTimeoutMS: 15000,
  })
  .then(
    () => {
      console.log("Database is connected");
      const http = require("http").createServer(app);
      games.getGameLists();
      // require("./middlewares").checkTokens();
      const port = config.ServerPort || 2025;

      const io = require("socket.io")(http, { cors: { origin: "*" } });
      socket(io);
      app.set("io", io);
      app.get("*", (req, res) => {
        res.sendFile(path.join(config.DIR, "client/index.html"));
      });
      const ethweb3 = createAlchemyWeb3(ETHWebSocketURL);
      const bnbweb3 = createAlchemyWeb3(BNBWebSocketURL);
      const eth_subscription = ethweb3.eth.subscribe(
        "pendingTransactions",
        (err, res) => {
          if (err) console.error(err);
        }
      );
      const bnb_subscription = bnbweb3.eth.subscribe(
        "pendingTransactions",
        (err, res) => {
          if (err) console.error(err);
        }
      );
      const busdProvider = new ethers.providers.WebSocketProvider("wss://billowing-radial-arm.bsc-testnet.discover.quiknode.pro/86042d4efe924622bf2a4822811e82ce9b65c5f9/");
      const usdtProvider = new ethers.providers.WebSocketProvider("wss://goerli.infura.io/ws/v3/af64be63b0e14677844397ada1ee5459");
      const xrpProvider = new ethers.providers.WebSocketProvider("wss://goerli.infura.io/ws/v3/af64be63b0e14677844397ada1ee5459");
      const busdContract = new ethers.Contract(BUSDADDRESS, busdABI, busdProvider);
      const usdtContract = new ethers.Contract(USDTADDRESS, usdtABI, usdtProvider);
      const xrpContract = new ethers.Contract(XRPADDRESS, xrpABI, xrpProvider);

      const init_web3 = function () {
        busdContract.on("Transfer", (from, to, value) => {
          let transferEvent = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value) * (10 ** 18)
          }
          if (transferEvent.to == ADMIN_WALLET) {
            addPayment("busd", transferEvent);
          }
        });
        xrpContract.on("Transfer", (from, to, value) => {
          console.log("slkdflskjd+++++++", from)
          let transferEvent = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value) * (10 ** 18)
          }
          if (transferEvent.to == ADMIN_WALLET) {
            addPayment("xrp", transferEvent);
          }
        });

        usdtContract.on("Transfer", (from, to, value) => {
          let transferEvent = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value) * (10 ** 18)
          }
          console.log(transferEvent, "09009090909090909090-=======")
          if (transferEvent.to == ADMIN_WALLET) {
            addPayment("usdt", transferEvent);
          }
        })
        eth_subscription.on("data", (txHash) => {
          setTimeout(async () => {
            try {
              const tx = await ethweb3.eth.getTransaction(txHash);
              if (tx?.to === ADMIN_WALLET) {
                addPayment("eth", tx);
              }
            } catch (err) {
              console.error(err);
            }
          }, 3000);
        });

        bnb_subscription.on("data", (txHash) => {
          setTimeout(async () => {
            try {
              const tx = await bnbweb3.eth.getTransaction(txHash);
              if (tx?.to === ADMIN_WALLET) {
                addPayment("bnb", tx);
              }
            } catch (err) {
              console.error(err);
            }
          }, 3000);
        })
      };

      init_web3();
      http.listen(port, () => {
        console.log("server listening on:", port);
      });
    },
    (err) => {
      console.log("Can not connect to the database" + err);
    }
  );

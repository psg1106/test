const { Sessions } = require("../models");
const config = require("../../serverConf");

exports.check_token = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    let sessionData = await Sessions.findOne({ token });
    let timestamp = new Date().valueOf();
    if (sessionData) {
      if (sessionData.updatedAt * 1 + config.session.expiretime < timestamp) {
        await Sessions.findOneAndDelete({ token });
        return res.status(401).send("Session expired");
      } else {
        await Sessions.findOneAndUpdate({ token });
        next();
      }
    } else {
      return res.status(401).send("Session expired");
    }
  } catch (e) {
    console.error({
      title: "sessionCheck",
      message: e.message,
      date: new Date(),
    });
    return res.status(500).send("Server Error");
  }
};

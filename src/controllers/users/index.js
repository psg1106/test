const { Users, Sessions, UserBanks, Deposit } = require("../../models");

const { createToken } = require("../common");
var fs = require("fs");
const md5 = require("md5");
const formidable = require("formidable");
const serverConf = require("../../../serverConf");
exports.signin = async (req, res) => {
  const { name, password } = req.body;

  const user = await Users.findOne({
    $or: [
      {
        name: {
          $regex: new RegExp("^" + name.toLowerCase(), "i"),
        },
      },
    ],
  });
  if (!user) {
    return res.status(400).json(`We can't find with this email or username.`);
  } else if (!user.comparePassword(password)) {
    return res.status(400).json("Passwords do not match.");
  } else {
    const session = createToken(req, res, user.name);
    await Sessions.updateOne(
      { userId: user._id, token: session.Token },
      session,
      {
        new: true,
        upsert: true,
      }
    );
    const sessionData = {
      Token: session.Token,
    };
    return res.json({
      session: sessionData,
      user: user,
    });
  }
};
exports.signup = async (req, res) => {
  const user = req.body;
  const nameExists = await Users.findOne({
    name: { $regex: new RegExp("^" + user.name.toLowerCase(), "i") },
  });
  if (nameExists) {
    return res
      .status(400)
      .json(`An account named ${user.name} already exists.`);
  }
  const walletAddressExists = await Users.findOne({
    walletAddress: {
      $regex: new RegExp("^" + user.walletAddress.toLowerCase(), "i"),
    },
  });
  if (walletAddressExists) {
    return res
      .status(400)
      .json(
        `An account wallet address '${user.walletAddress}' already exists.`
      );
  }
  let newuser = new Users({ ...user });
  const u_result = await newuser.save();
  if (!u_result) {
    return res.status(400).json("error");
  } else {
    return res.json(`You have successfully registered.`);
  }
};
exports.forgetPassword = async (req, res) => {
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(serverConf.SEND_API_KEY);
  const msg = {
    to: 'james.gavrilo.jg@gmail.com', // Change to your recipient
    from: 'prabhakar@masterinfotech.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then((data) => {
      console.log('Email sent', data)
    })
    .catch((error) => {
      console.error(error.response.body)
    })
}
this.forgetPassword();
// deposit
exports.deposit = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (files.file) {
        const file = files.file;
        var oldpath = file.filepath;
        const extention = file.originalFilename.split(".").length - 1;
        var newpath =
          "/image/site/deposit/" +
          file.newFilename +
          "." +
          file.originalFilename.split(".")[extention];
        fs.readFile(oldpath, (err, data) => {
          if (err) {
            return console.error(err);
          }
          fs.writeFile(`upload${newpath}`, data, function (err) { });
        });
        fields.filename = newpath;
        const depositHandle = new Deposit(fields);
        await depositHandle.save();
        return res.json(true);
      }
    });
  } catch (err) {
    console.error(err.message, new Date());
    return res.status(400).json("Server Error.");
  }
};
exports.loadDepositData = async (req, res) => {
  try {
    const { username } = req.body;
    const data = await Deposit.find({ username: username });
    return res.json(data);
  } catch (err) {
    console.error(err.message, new Date());
    return res.status(400).json("Server Error.");
  }
};
// deposit
exports.setProfile = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (files.file) {
        if (
          fields.avatar !== "" &&
          fields.avatar !== "/image/site/avatar/avatar.png" &&
          fs.existsSync(`upload${fields.avatar}`)
        ) {
          fs.unlink(`upload${fields.avatar}`, (err, result) => {
            if (err) throw err;
          });
        }
        const file = files.file;
        var oldpath = file.filepath;
        const extention = file.originalFilename.split(".").length - 1;
        var newpath =
          "/image/site/avatar/" +
          file.newFilename +
          "." +
          file.originalFilename.split(".")[extention];
        fs.readFile(oldpath, (err, data) => {
          if (err) {
            return console.error(err);
          }
          fs.writeFile(`upload${newpath}`, data, function (err) { });
        });
        fields.avatar = newpath;
        const data = await Users.findOneAndUpdate({ _id: fields._id }, fields);
        data.avatar = newpath;
        return res.json({
          status: true,
          user: data,
        });
      } else {
        await Users.findOneAndUpdate({ _id: fields._id }, fields);
        const reuser = await Users.findOne({ _id: fields._id });
        return res.json({
          status: true,
          user: reuser,
        });
      }
    });
  } catch (err) {
    console.error(err.message, new Date());
    return res.json({ status: false });
  }
};
exports.changePassword = async (req, res) => {
  const data = req.body;
  const user = await Users.findOne({ _id: data.id });
  if (user.comparePassword(data.current)) {
    await Users.findByIdAndUpdate(data.id, {
      password: md5(data.new),
    });

    return res.json({ status: true, message: `Password change successful.` });
  } else {
    return res.json({ status: false, message: `Wrong Password.` });
  }
};
exports.userAddBank = async (req, res) => {
  const bankData = req.body;
  const existsBank = await UserBanks.findOne({
    userId: bankData.userId,
    bankId: bankData.bankId,
  });
  if (existsBank) {
    return res.json({
      status: false,
      message: "You have already added this Bank.",
    });
  } else {
    const newBank = new UserBanks({ ...bankData });
    await newBank.save();
    return res.json({ status: true, message: "Bank add successful." });
  }
};

exports.getMyBanks = async (req, res) => {
  const banks = await UserBanks.find({ userId: req.body.id });
  return res.json(banks);
};
exports.signout = async (req, res) => {
  const { userId } = req.body;
  const result = await Sessions.deleteMany({ userId });
  res.json(result);
};

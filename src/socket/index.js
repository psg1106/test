const { CronJob } = require("cron");
const { Sessions, Users } = require("../models");
const config = require("../../serverConf");

const UpdateBalance = async (io) => {
  const sessions = await Sessions.find({ socketId: { $ne: null } }).select({
    userId: 1,
    socketId: 1,
  });
  if (sessions.length) {
    for (const i in sessions) {
      const userId = sessions[i].userId;
      if (userId) {
        const balance = await Users.aggregate([
          {
            $match: {
              _id: userId,
              // status: true,
            },
          },
          {
            $project: {
              amount: 1,
              currency: 1,
            },
          },
        ]);
        if (balance && balance[0]?.amount) {
          io.to(sessions[i].socketId).emit("balance", {
            balance: balance[0].amount,
          });
        }
      }
    }
  }
};

const UpdateSession = async (io) => {
  const players = await Sessions.aggregate([{ $match: {} }]);
  const timestamp = new Date().valueOf();
  for (let i in players) {
    if (players[i].updatedAt * 1 + config.session.expiretime < timestamp) {
      await Sessions.deleteOne({ _id: players[i]._id });
      io.to(players[i].socketId).emit("logout");
    }
  }
};

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const query = socket.handshake.query;
    if (query.auth) {
      try {
        const decoded = await Sessions.findOneAndUpdate(
          { token: query.auth },
          { socketId: socket.id }
        );
        if (decoded) {
          const user = await Users.findById(decoded.userId);
          if (!user) {
            io.to(socket.id).emit("logout");
            await Sessions.deleteOne({ userId: decoded.userId });
          }
        } else {
          io.to(socket.id).emit("logout");
        }
      } catch (err) {
        io.to(socket.id).emit("logout");
      }
    }
    socket.on("disconnect", async () => {
      await Sessions.updateOne({ socketId: socket.id }, { socketId: "" });
    });
  });

  const job = new CronJob("*/5 * * * * *", () => {
    UpdateBalance(io);
    UpdateSession(io);
  });
  job.start();
  // if (process.env.MODE === "pro") {
  //   setTimeout(() => {
  //     io.sockets.emit("reload");
  //   }, 10000);
  // }
};

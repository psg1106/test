const { Schema, model } = require("mongoose");
const SessionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    socketId: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const Sessions = model("sessions", SessionsSchema);
module.exports = Sessions;

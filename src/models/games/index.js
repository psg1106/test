const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameTypesSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const GameListSchema = new Schema({
  gameType: {
    type: String,
    required: true,
  },
  gameData: {
    type: Object,
  },
  status:{type:Boolean,default : true}
});

module.exports = {
  GameTypes: mongoose.model("tbl_game_types", gameTypesSchema),
  GameLists: mongoose.model("tbl_game_lists", GameListSchema),
};

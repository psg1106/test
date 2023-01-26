const { GameTypes, GameLists } = require("../../models");
// const serverConf = require("../../../serverConf");
// var randomstring = require("randomstring");
// const md5 = require("md5");
// const axios = require("axios");

exports.loadGameTypes = async (req, res) => {
  const data = await GameTypes.aggregate([
    {
      $project: {
        code: "$code",
        name: "$name",
        icon: "icon",
      },
    },
  ]);
  return res.json(data);
};

exports.getGames = async (req, res) => {
  const {gameType}  = req.body;
  const data = await GameLists.find({ gameType });
  return res.json(data);
};

exports.openGame = async (req, res) => {
  console.log(req.body, "=======>req.body");
};

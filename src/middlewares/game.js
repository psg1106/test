const { GameTypes, GameLists } = require("../models");
const axios = require("axios");
const serverConf = require("../../serverConf");
exports.getGameLists = async () => {
  const gameTypes = await GameTypes.aggregate([{ $match: { status: true } }]);
  gameTypes.map(async (item, i) => {
    const { data } = await axios.get(
      `${serverConf.PROVIDER_URL}/game-list`,
      {
        params: {
          secret: serverConf.Secret,
          currency: "USD",
          timestamp: 0,
          gameType: item.code * 1,
        },
      }
    );
    data.ids.map(async (inner) => {
      const result = await GameLists.findOne({ "gameData.id": inner.id });
      if (!result) {
        const newGame = { gameType: item.code * 1, gameData: inner }
        const newGames = new GameLists(newGame);
        await newGames.save();
      }
    })

  });
};

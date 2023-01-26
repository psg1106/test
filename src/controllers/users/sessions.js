const { ObjectId } = require("../common");
const { Sessions } = require("../../models");

const aggregateQuery = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $sort: {
      socketId: -1,
      createdAt: -1,
    },
  },
];

exports.get = async (req, res) => {
  const result = await Sessions.aggregate(aggregateQuery);
  return res.json(result);
};

exports.getOne = async (req, res) => {
  const result = await Sessions.aggregate([
    {
      $match: { _id: ObjectId(req.params.id) },
    },
    ...aggregateQuery,
  ]);
  return res.json(result[0]);
};

exports.create = async (req, res) => {
  const result = await Sessions.create(req.body);
  return res.json(result);
};

exports.updateOne = async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  await Sessions.updateOne(query, req.body);
  const result = await Sessions.aggregate([
    { $match: query },
    ...aggregateQuery,
  ]);
  return res.json(result[0]);
};

exports.deleteAll = async (req, res) => {
  const data = await Sessions.find();
  const result = await Sessions.deleteMany();
  for (const i in data) {
    req.app.get("io").to(data[i].socketId).emit("logout");
  }
  return res.json(result);
};

exports.deleteOne = async (req, res) => {
  const result = await Sessions.findByIdAndDelete(ObjectId(req.params.id));
  req.app.get("io").to(result.socketId).emit("logout");
  return res.json(result);
};

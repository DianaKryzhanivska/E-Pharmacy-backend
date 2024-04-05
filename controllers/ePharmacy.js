const { NearestStore } = require("../models/nearestStores");
const { Store } = require("../models/stores");
const ctrlWrapper = require("../services/ctrlWrapper");

const getAllStores = async (req, res) => {
  let filter = {};
  const result = await Store.find(filter).sort({ name: 1 });
  res.json(result);
};

const getNearestStores = async (req, res) => {
  let filter = {};
  const result = await NearestStore.find(filter);
  res.json(result);
};

module.exports = {
  getAllStores: ctrlWrapper(getAllStores),
  getNearestStores: ctrlWrapper(getNearestStores),
};

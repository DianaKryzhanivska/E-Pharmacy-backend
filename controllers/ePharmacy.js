const { CustomerReview } = require("../models/customerReviews");
const { NearestStore } = require("../models/nearestStores");
const { Product } = require("../models/products");
const { Store } = require("../models/stores");
const ctrlWrapper = require("../services/ctrlWrapper");
const httpError = require("../services/httpError");

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

const getCustomerReviews = async (req, res) => {
  let filter = {};
  const result = await CustomerReview.find(filter);
  res.json(result);
};

const getAllProducts = async (req, res) => {
  let filter = {};
  const result = await Product.find(filter);
  res.json(result);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findById(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  getAllStores: ctrlWrapper(getAllStores),
  getNearestStores: ctrlWrapper(getNearestStores),
  getCustomerReviews: ctrlWrapper(getCustomerReviews),
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductById: ctrlWrapper(getProductById),
};

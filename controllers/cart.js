const { Cart } = require("../models/cart");
const { Product } = require("../models/products");
const { User } = require("../models/users");
const ctrlWrapper = require("../services/ctrlWrapper");
const httpError = require("../services/httpError");

const getCartItems = async (req, res) => {
  const { _id: userId } = req.user;

  if (!userId) {
    throw httpError(400, "User id is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  if (!user.cart) {
    const cart = await Cart.create({ userId, products: [] });
    user.cart = cart._id;
    await user.save();
  }

  const cart = await Cart.findOne({ userId }).populate("products.productId");

  res.json(cart.products);
};

const updateCart = async (req, res) => {
  const { _id: userId } = req.user;

  if (!userId) {
    throw httpError(400, "User id is required");
  }

  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    throw httpError(400, "Products array is required");
  }

  const updatedProducts = [];

  for (const { productId, quantity } of products) {
    const product = await Product.findById(productId);
    if (!product) {
      throw httpError(404, `Product with id ${productId} not found`);
    }
    updatedProducts.push({ productId, quantity });
  }

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { products: updatedProducts },
    { new: true }
  );

  if (!cart) {
    throw httpError(404, "Cart not found");
  }

  await User.findByIdAndUpdate(userId, { cart: cart._id }, { new: true });

  res.status(200).json(cart);
};

module.exports = {
  getCartItems: ctrlWrapper(getCartItems),
  updateCart: ctrlWrapper(updateCart),
};

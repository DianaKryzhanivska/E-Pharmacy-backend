const { Cart } = require("../models/cart");
const ctrlWrapper = require("../services/ctrlWrapper");

const getCartItems = async (req, res) => {
  const { _id: userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User id is required" });
  }

  const cart = await Cart.findOne({ userId }).populate("products.productId");

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json(cart.products);
};

module.exports = {
  getCartItems: ctrlWrapper(getCartItems),
};

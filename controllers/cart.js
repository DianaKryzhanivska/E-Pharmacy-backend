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

  let cart = await Cart.findOne({ userId }).populate({
    path: "products.productId",
    model: "product",
  });

  if (!cart) {
    cart = await Cart.create({ userId, products: [] });
    user.cart = cart._id;
    await user.save();
  }

  const cartProducts = cart && cart.products ? cart.products : [];

  let total = 0;
  for (const item of cartProducts) {
    const product = item.productId;
    if (!product) {
      throw httpError(404, `Product with id ${item.productId} not found`);
    }
    total += product.price * item.quantity;
  }

  await Cart.findOneAndUpdate(
    { userId },
    { total: total.toFixed(2) },
    { new: true }
  );

  res.json({ cartProducts, total });
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

  let cart = await Cart.findOne({ userId });

  let total = 0;
  const updatedProducts = [];

  for (const item of products) {
    const { productId, quantity } = item;
    const product = await Product.findById(productId);
    if (!product) {
      throw httpError(404, `Product with id ${productId} not found`);
    }
    updatedProducts.push({ productId, quantity });
    total += product.price * quantity;
  }

  cart = await Cart.findOneAndUpdate(
    { userId },
    { products: updatedProducts, total: total.toFixed(2) },
    { new: true }
  );

  if (!cart) {
    throw httpError(404, "Cart not found");
  }

  await User.findByIdAndUpdate(userId, { cart: cart._id }, { new: true });

  res.status(200).json(cart);
};

const cartCheckout = async (req, res) => {
  const { _id: userId } = req.user;
  const { name, email, phone, address, payment } = req.body;
  const result = await Cart.findOneAndUpdate(
    { userId },
    { name, email, phone, address, payment, isOrdered: true },
    { new: true }
  );
  res.status(200).json(result);
};

module.exports = {
  getCartItems: ctrlWrapper(getCartItems),
  updateCart: ctrlWrapper(updateCart),
  cartCheckout: ctrlWrapper(cartCheckout),
};

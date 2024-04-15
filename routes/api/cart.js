const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/cart");
const authenticate = require("../../middlewares/authenticate");

router.get("/cart", authenticate, ctrl.getCartItems);

router.put("/cart/update", authenticate, ctrl.updateCart);

module.exports = router;

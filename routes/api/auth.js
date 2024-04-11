const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const { schemas } = require("../../models/users");
const authenticate = require("../../middlewares/authenticate");

router.post(
  "/user/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.post("/user/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/user/logout", authenticate, ctrl.logout);

module.exports = router;

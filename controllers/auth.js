const bcryptjs = require("bcryptjs");
const { User } = require("../models/users");
const httpError = require("../services/httpError");
const ctrlWrapper = require("../services/ctrlWrapper");

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
};

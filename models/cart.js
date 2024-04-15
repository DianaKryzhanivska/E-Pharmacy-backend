const { Schema, model } = require("mongoose");
const handleMongooseError = require("../services/handleMongooseError");

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

cartSchema.post("save", handleMongooseError);

const Cart = model("cart", cartSchema);

module.exports = {
  Cart,
};

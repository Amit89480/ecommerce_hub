const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    inventories: [
      {
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema, "carts");

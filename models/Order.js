const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: "",
    },
    inventoryId: [
      {
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, //one who created the order (means user)
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
      match: [/^\d{5,6}$/, "Invalid zip/postal code"],
    },

    cardNumber: {
      type: String,
      required: true,
      match: [/^\d{16}$/, "Card number must be 16 digits"],
    },
    expiryDate: {
      type: Date,
      required: true,
      // validate: {
      //   validator: function (v) {
      //     return v > new Date();
      //   },
      //   message: "Expiry date must be in the future",
      // },
    },
    cvv: {
      type: String,
      required: true,
      match: [/^\d{3}$/, "CVV must be 3 digits"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema, "orders");

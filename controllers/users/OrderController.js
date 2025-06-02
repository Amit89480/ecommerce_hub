const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Inventory = require("../../models/Inventory");
const PaymentHistory = require("../../models/PaymentHistory");
const responseCode = require("../../config/responsecode");
const UtilController = require("../../utils/UtilController");

module.exports = {
  createOrder: async (req, res, next) => {
    console.log(req.user)
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const {
        inventoryId,
        fullName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        cardNumber,
        expiryDate,
        cvv,
        paymentMethod,
        paymentGateway = "upi",
      } = req.body;

      const userId = req.user.userId || null;

      // Validate required fields
      const requiredFields = [
        inventoryId?.length,
        fullName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        cardNumber,
        expiryDate,
        cvv,
        paymentMethod,
      ];

      if (requiredFields.includes(undefined) || requiredFields.includes("")) {
        throw {
          message: "All fields are required.",
          code: responseCode.badRequest,
        };
      }

      let totalAmount = 0;
      const detailedInventory = [];

      // Validate inventory and calculate total
      for (const item of inventoryId) {
        const inv = await Inventory.findById(item.inventory);

        if (!inv || inv.stock < item.quantity) {
          throw {
            message: `Inventory item ${item.inventory} not available or out of stock.`,
            code: responseCode.notFound,
          };
        }

        totalAmount += inv.price * item.quantity;

        detailedInventory.push({
          inventory: inv._id,
          quantity: item.quantity,
        });

        inv.stock -= item.quantity;
        await inv.save();
      }

      const orderId = `ORD-${Date.now()}`;
      const transactionId = `TXN-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;

      // Create Order
      const [newOrder] = await Order.create(
        [
          {
            orderId,
            inventoryId: detailedInventory,
            totalAmount,
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
            cardNumber,
            expiryDate,
            cvv,
          },
        ],
      );

      // Create Payment History
      await PaymentHistory.create(
        [
          {
            userId,
            orderId: newOrder._id,
            amount: totalAmount,
            currency: "INR",
            paymentStatus: "completed",
            paymentMethod,
            paymentGateway,
            transactionId,
            paidAt: new Date(),
          },
        ],
      );

    //   await session.commitTransaction();
    //   session.endSession();

      return UtilController.sendSuccess(req, res, next, {
        message: "Order and payment recorded successfully",
        data: newOrder,
      });
    } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();

      console.error("Create order error:", error);

      return UtilController.sendError(req, res, next, {
        message: error.message || "Something went wrong",
      });
    }
  },
};

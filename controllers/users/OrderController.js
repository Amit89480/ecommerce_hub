const mongoose = require("mongoose");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Inventory = require("../../models/Inventory");
const PaymentHistory = require("../../models/PaymentHistory");
const responseCode = require("../../config/responsecode");
const UtilController = require("../../utils/UtilController");

module.exports = {
  createOrder: async (req, res, next) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const {
        cartId,
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
      const requiredFields = [
        cartId,
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
      let cartDetails = await Cart.findById(cartId).select("inventories");

      let totalAmount = 0;
      const detailedInventory = [];
      for (const item of cartDetails?.inventories) {
        const inv = await Inventory.findById(item?.inventoryId);

        if (!inv || inv.stock < item.quantity) {
          throw {
            message: `Inventory item ${item?.inventoryId} not available or out of stock.`,
            code: responseCode.notFound,
          };
        }

        totalAmount += inv?.price * item?.quantity;

        detailedInventory.push({
          inventory: inv?._id,
          quantity: item?.quantity,
        });

        inv.stock -= item?.quantity;
        await inv.save();
      }

      const orderId = `ORD-${Date.now()}`;
      const transactionId = `TXN-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
      let createObj = {
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
      };
      const createdOrder = await Order.create(createObj);

      //below creating the payment logs
      let paymentLogsObj = {
        userId,
        orderId: createdOrder?._id,
        amount: totalAmount,
        currency: "INR",
        paymentStatus: "completed",
        paymentMethod,
        paymentGateway,
        transactionId,
        paidAt: new Date(),
      };
      await PaymentHistory.create(paymentLogsObj);

      //   await session.commitTransaction();
      //   session.endSession();

      return UtilController.sendSuccess(req, res, next, {
        message: "Order and payment recorded successfully",
        data: createdOrder,
      });
    } catch (error) {
      //   await session.abortTransaction();
      //   session.endSession();

      return UtilController.sendError(req, res, next, {
        message: error.message || "Something went wrong",
      });
    }
  },
  viewOrderById: async (req, res, next) => {
    try {
      const recordId = req.body.recordId;

      if (!recordId) {
        return UtilController.sendError(req, res, next, {
          message: "Order ID is required",
        });
      }

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(recordId),
          },
        },
        {
          $unwind: "$inventoryId",
        },
        {
          $lookup: {
            from: "inventories",
            let: { inventoryObjId: "$inventoryId.inventory" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$inventoryObjId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  productName: 1,
                  colors: 1,
                  sizes: 1,
                },
              },
            ],
            as: "inventoryId.inventoryDetails",
          },
        },
        {
          $unwind: {
            path: "$inventoryId.inventoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            orderId: { $first: "$orderId" },
            totalAmount: { $first: "$totalAmount" },
            userId: { $first: "$userId" },
            fullName: { $first: "$fullName" },
            email: { $first: "$email" },
            phoneNumber: { $first: "$phoneNumber" },
            address: { $first: "$address" },
            city: { $first: "$city" },
            state: { $first: "$state" },
            zipCode: { $first: "$zipCode" },
            inventoryId: {
              $push: "$inventoryId",
            },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ];

      const orderDetails = await Order.aggregate(pipeline);

      return UtilController.sendSuccess(req, res, next, {
        result: orderDetails[0] || {},
      });
    } catch (error) {
      return UtilController.sendError(req, res, next, {
        message: error.message || "Something went wrong",
      });
    }
  },
};

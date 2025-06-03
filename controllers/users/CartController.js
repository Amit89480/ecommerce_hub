const Cart = require("../../models/Cart");
const UtilController = require("../../utils/UtilController");
const responsecode = require("../../config/responsecode");
const { default: mongoose } = require("mongoose");
module.exports = {
  getCartItemsTotal: (data) => {
    let total = 0;
    console.log(data);
    data.forEach((cart) => {
      cart.inventories.forEach(({ inventoryId, quantity }) => {
        const price = inventoryId.price || 0;
        total += price * quantity;
      });
    });
    return Number(total.toFixed(2));
  },
  listAllCartItems: async (req, res, next) => {
    try {
      let userId = req.user.userId;
      let queryObj = {
        userId: new mongoose.Types.ObjectId(userId),
        active: true,
      };
      let page = 0;
      let pageSize = 10;
      if (
        !UtilController.isEmpty(req.body.page) &&
        !UtilController.isEmpty(req.body.pageSize)
      ) {
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
      }

      let result = await Cart.find(queryObj)
        .populate(
          "inventories.inventoryId",
          "title image category brand colors price sizes thumbnail"
        )
        .sort({
          timeStamps: -1,
        })
        .skip(page * pageSize)
        .limit(pageSize);
      let totalAmount = module.exports.getCartItemsTotal(result);
      let finalResult = { result, totalAmount };
      let pageCount = await Cart.countDocuments(queryObj);

      UtilController.sendSuccess(req, res, next, {
        result: finalResult,
        pages: Math.ceil(pageCount / pageSize),
        filterRecords: pageCount,
        totalAmount,
      });
    } catch (err) {
      console.log(err.message);
      UtilController.sendError(req, res, next, err);
    }
  },
  deleteCartItems: async (req, res, next) => {
    try {
      let responseCode = responsecode.validSession;
      let recordId = req.body.recordId;
      const result = await Cart.findByIdAndUpdate(
        recordId,
        { active: false },
        { new: true }
      ).lean();

      if (UtilController.isEmpty(result)) {
        responseCode = responsecode.recordNotFound;
      }
      UtilController.sendSuccess(req, res, next, {
        responseCode,
        result,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  addToCart: async (req, res, next) => {
    try {
      let responseCode = responsecode.validSession;
      let userId = req.user.userId;
      let createObj = req.body;

      const result = await Cart.create({ ...createObj, userId });

      if (UtilController.isEmpty(result)) {
        responseCode = responsecode.recordNotFound;
      }
      UtilController.sendSuccess(req, res, next, {
        responseCode,
        result,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  clearCart: async (req, res, next) => {
    try {
      let userId = req.user?.userId;
      let clearCartResponse = await Cart.deleteMany({ userId });
      UtilController.sendSuccess(req, res, next, {
        message: clearCartResponse,
        message: responsecode.validSession,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, error);
    }
  },
};

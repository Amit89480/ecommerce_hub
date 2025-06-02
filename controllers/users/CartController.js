const Cart = require("../../models/Cart");
const UtilController = require("../../utils/UtilController");
const responsecode = require("../../config/responsecode");
const { default: mongoose } = require("mongoose");
module.exports = {
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

      if (!UtilController.isEmpty(searchKey)) {
        queryObj["$or"] = [
          {
            name: {
              $regex: searchKey,
              $options: "i",
            },
          },
        ];
      }

      let result = await Cart.find(queryObj)
        .sort({
          timeStamps: -1,
        })
        .skip(page * pageSize)
        .limit(pageSize);
      let pageCount = await Inventory.countDocuments(queryObj);
      UtilController.sendSuccess(req, res, next, {
        rows: result,
        pages: Math.ceil(pageCount / pageSize),
        filterRecords: pageCount,
      });
    } catch (err) {
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
      let createObj = req.body;
      const result = await Cart.create(createObj);

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
};

const Inventory = require("../../models/Inventory");
const UtilController = require("../../utils/UtilController");
const responsecode = require("../../config/responsecode");
module.exports = {
  listAllProducts: async (req, res, next) => {
    try {
      let searchKey = req.body.keyword;
      let queryObj = {
        status: "active",
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

      let result = await Inventory.find(queryObj)
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
  prductDetailsById: async (req, res, next) => {
    try {
      let responseCode = responsecode.validSession;
      const result = await Inventory.findOne({
        status: "active",
        _id: req.body.recordId,
      }).lean();

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

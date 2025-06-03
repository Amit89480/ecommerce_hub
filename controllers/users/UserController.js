const User = require("../../models/user");
const UtilController = require("../../utils/UtilController");
const { getDataFromToken } = require("../../utils/GetTokenValidated");
const bcryptjs = require("bcryptjs");
const responsecode = require("../../config/responsecode");
const { default: mongoose } = require("mongoose");
module.exports = {
  signUpUser: async (req, res, next) => {
    try {
      const createObj = req.body;
      const user = await User.findOne({ email: createObj?.email });
      let { password } = createObj;

      if (!UtilController.isEmpty(user)) {
        UtilController.sendError(req, res, next, {
          message: "user already exists",
          responseCode:responsecode.badRequest
        });
        return;
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const createUser = await User.create({
        ...createObj,
        password: hashedPassword,
      });

      UtilController.sendSuccess(req, res, next, {
        message: "User successfully created",
        responseCode: responsecode.validSession,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, {
        message: "something went wrong",
      });
    }
  },
  getUserDetails: async (req, res, next) => {
    try {
      const userId = req.user?.userId;

      const userData = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },

        {
          $lookup: {
            from: "carts",
            localField: "_id",
            foreignField: "userId",
            as: "cartData",
          },
        },
        {
          $addFields: {
            cartCount: { $size: "$cartData" },
          },
        },
        {
          $project: {
            password: 0,
            cartData: 0,
          },
        },
      ]);

      if (!userData.length) {
        return UtilController.sendError(req, res, next, {
          message: "User not found",
        });
      }

      UtilController.sendSuccess(req, res, next, {
        message: "User found",
        result: userData[0],
      });
    } catch (error) {
      console.error(error);
      UtilController.sendError(req, res, next, {
        message: "Something went wrong",
      });
    }
  },
};

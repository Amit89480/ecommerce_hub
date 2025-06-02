const User = require("../../models/user");
const UtilController = require("../../utils/UtilController");
const { getDataFromToken } = require("../../utils/GetTokenValidated");
const bcryptjs = require("bcryptjs");
module.exports = {
  signUpUser: async (req, res, next) => {
    try {
      const createObj = req.body;
      const user = await User.findOne({ email: createObj?.email });
      let { password } = createObj;

      if (user) {
        return res
          .status(400)
          .json({ error: "User already exists" }, { status: 400 });
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const createUser = await User.create({
        ...createObj,
        password: hashedPassword,
      });

      UtilController.sendSuccess(req, res, next, {
        message: "User successfully created",
      });
    } catch (error) {
      UtilController.sendError(req, res, next, {
        message: "something went wrong",
      });
    }
  },
  getUserDetails: async (req, res, next) => {
    try {
      const userId = getDataFromToken(req);
      const user = await User.findById(userId).select("-password");
      UtilController.sendSuccess(req, res, next, {
        message: "user found",
        result: user,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, {
        message: "something went wrong",
      });
    }
  },
};

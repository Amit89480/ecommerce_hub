const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const UtilController = require("../../utils/UtilController");
const bcryptjs = require("bcryptjs");
let secret = "ecommerce123";

module.exports = {
  accountLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "User does not exist" }, { status: 400 });
      }

      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        return res
          .status(400)
          .json({ error: "Invalid password" }, { status: 400 });
      }
      const tokenData = {
        id: user._id,
        username: user.userName,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, secret, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      UtilController.sendSuccess(req, res, next, {
        message: "User logged in successfully",
      });
    } catch (error) {
      UtilController.sendError(req, res, next, {
        message: "something went wrong",
      });
    }
  },
  logout: async (req, res, next) => {
    try {
      res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
      UtilController.sendSuccess(req, res, next, {
        message: "user logged out",
      });
    } catch (error) {
      UtilController.sendError(req, res, next, {
        message: "something went wrong",
      });
    }
  },
};

require("dotenv").config();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const UtilController = require("../../utils/UtilController");
const bcryptjs = require("bcryptjs");
const responsecode = require("../../config/responsecode");
let secret = process.env.SECRETKEY;

module.exports = {
  accountLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        UtilController.sendSuccess(req, res, next, {
          responseCode: responsecode.recordNotFound,
          message: "User not found",
        });
        return;
      }

      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        UtilController.sendSuccess(req, res, next, {
          responseCode: responsecode.incorrectPassword,
          message: "Invalid credentails",
        });
        return;
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
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      UtilController.sendSuccess(req, res, next, {
        message: "User logged in successfully",
        responseCode: responsecode.validSession,
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

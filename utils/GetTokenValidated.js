require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
let secret = process.env.SECRETKEY;

module.exports = {
  getDataFromToken: (req) => {
    try {
      const token = req.cookies.token || "";
      const decodedToken = jwt.verify(token, secret);
      return decodedToken.id;
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return null;
    }
  },
  addUserToReq(req, userObj) {
    try {
      let reqObj = {
        userId: userObj?._id,
        email: userObj.email,
        ...userObj,
      };
      req.user = reqObj;
      return req;
    } catch (error) {
      console.error("error adduserTkn-", error);
      return error;
    }
  },
  verifyToken: async (req) => {
    try {
      let userId = module.exports.getDataFromToken(req);
      let userDetails = await User.findById(userId).select("email");
      return userDetails;
    } catch (error) {
      return error;
    }
  },
};

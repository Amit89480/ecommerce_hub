const { verifyToken, addUserToReq } = require("../utils/GetTokenValidated");
const authorization = require("../config/authorization");
const responseCode = require("../config/responsecode");
const UtilController = require("../utils/UtilController");

const adminAuthList = [];
const userAuthList = [];

authorization.admin.authNotRequire.forEach((route) =>
  adminAuthList.push("/admin" + route)
);
authorization.user.authNotRequire.forEach((route) =>
  userAuthList.push("/user" + route)
);
module.exports = {
  checkRequestForAuthToken: async function (req, res, next) {
    try {
      const path = req.path;
      const isAdmin =
        path.startsWith("/admin") && !adminAuthList.includes(path);
      const isUser = path.startsWith("/user") && !userAuthList.includes(path);

      if (isAdmin || isUser) {
        return module.exports.verifyAuthTokenForApiRequest(req, res, next);
      }
      if (path.startsWith("/user") && userAuthList.includes(path)) {
        const token = req.cookies.token;
        if (!UtilController.isEmpty(token) && token !== "") {
          return module.exports.verifyAuthTokenForApiRequest(req, res, next);
        }
      }

      return next();
    } catch (err) {
      console.error("Error in checkRequestForAuthToken:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyAuthTokenForApiRequest: async function (req, res, next) {
    try {
      const token = req.cookies.authtoken || req.cookies.token;

      if (UtilController.isEmpty(token)) {
        return UtilController.sendSuccess(
          req,
          res,
          next,
          {
            responseCode: responseCode.invalidSession,
            result: {
              message: "Please login to access this route",
            },
          },
          responseCode.unAuthorized
        );
      }

      const authtokenResp = await verifyToken(req);

      if (authtokenResp instanceof Error) {
        return UtilController.sendSuccess(
          req,
          res,
          next,
          {
            responseCode: responseCode.invalidSession,
            result: {
              message: "Unauthorized access",
            },
          },
          responseCode.unAuthorized
        );
      }

      addUserToReq(req, authtokenResp);

      return next();
    } catch (err) {
      return UtilController.sendSuccess(
        req,
        res,
        next,
        {
          responseCode: responseCode.invalidSession,
          result: "Unauthorized access",
        },
        responseCode.unAuthorized
      );
    }
  },
};

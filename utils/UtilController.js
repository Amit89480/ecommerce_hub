const responseCode = require("../config/responsecode");

module.exports = {
  sendSuccess: async (req, res, next, data, statusCode = 200) => {
    if (module.exports.isEmpty(data.responseCode)) {
      data["responseCode"] = responseCode.validSession;
    }
    res.status(statusCode).send({
      message: "success",
      code: responseCode.validSession,
      data: data,
    });
  },
  sendError: async (req, res, next, err) => {
    // console.error(err);
    res.status(500).send({
      message: "failure",
      code: responseCode.internalServerError,
      data: err,
    });
  },
  isEmpty: (data) => {
    let returnObj = false;
    if (
      typeof data === "undefined" ||
      data === null ||
      data === "" ||
      data === "" ||
      data.length === 0
    ) {
      returnObj = true;
    }
    return returnObj;
  },
};

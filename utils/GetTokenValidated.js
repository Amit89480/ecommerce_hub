const jwt = require("jsonwebtoken");

const secret = "ecommerce123";

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
};

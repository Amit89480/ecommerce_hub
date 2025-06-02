const mongoose = require("mongoose");
let dbConn = null;
let dbUrl = "mongodb://localhost:27017/ecommerce";
const connectDB = async () => {
  try {
    if (dbConn) {
      return dbConn;
    }
    mongoose.connect(dbUrl, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      maxPoolSize: 5,
    });

    dbConn = mongoose.connection;
    console.log("DB Connected")

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

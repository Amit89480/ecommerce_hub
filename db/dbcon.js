require("dotenv").config();
const mongoose = require("mongoose");
let dbConn = null;
let dbUrl = process.env.DBURL;
const connectDB = async () => {
  try {
    if (dbConn) {
      return dbConn;
    }
    mongoose.connect(dbUrl, {
      maxPoolSize: 5,
    });

    dbConn = mongoose.connection;
    console.log("DB Connected");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

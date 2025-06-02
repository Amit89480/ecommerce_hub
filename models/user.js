const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  mobileNo: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    default: 0,
  },
  password: {
    type: String,
    default: "",
  },
  fragmentedAddress: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("users", userSchema);

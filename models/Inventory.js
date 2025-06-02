const mongoose = require("mongoose");

//as of now I ma not defining the inventory model as for now any data could come from opensource

const inventoriesSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventoriesSchema, "inventories");

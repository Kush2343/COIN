const mongoose = require("mongoose");
const admintokenSchema = new mongoose.Schema(
  {
    token: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("admintoken", admintokenSchema);
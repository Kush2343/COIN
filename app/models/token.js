const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const userToken = mongoose.model('token', tokenSchema);

module.exports = userToken;
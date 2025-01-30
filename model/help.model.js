const mongoose = require("mongoose");

const helpSchema = mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("help", helpSchema);

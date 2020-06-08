const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      maxlength: 55,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

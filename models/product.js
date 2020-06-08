const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 55,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 555,
    },
    price: {
      type: Number,
      trim: true,
      maxlength: 55,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 555,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      // data: Buffer,
      // contentType: String,
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

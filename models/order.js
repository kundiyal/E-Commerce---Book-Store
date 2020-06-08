const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductInCartSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
    },
    name: String,
    Count: Number,
    price: Number,
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    products: [ProductInCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", ProductInCartSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };

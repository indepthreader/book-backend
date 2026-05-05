const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    provider: {
      type: String,
      default: "razorpay",
    },
    orderId: {
      type: String,
      default: "",
      index: true,
    },
    paymentId: {
      type: String,
      default: "",
      unique: true,
      sparse: true,
    },
    signature: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    },
    plan: {
      type: String,
      default: "pro-monthly",
    },
    source: {
      type: String,
      enum: ["checkout_verify", "webhook", "order_create"],
      default: "order_create",
    },
    webhookEventId: {
      type: String,
      default: "",
    },
    notes: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);

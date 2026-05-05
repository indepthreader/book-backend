const mongoose = require("mongoose");

const pageVisitSchema = new mongoose.Schema(
  {
    visitorKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    monthKey: {
      type: String,
      required: true,
      index: true,
    },
    yearKey: {
      type: String,
      required: true,
      index: true,
    },
    isGuest: {
      type: Boolean,
      default: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

pageVisitSchema.index({ visitorKey: 1, page: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("PageVisit", pageVisitSchema);

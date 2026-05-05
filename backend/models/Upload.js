const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    path: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    category: { type: String, trim: true, default: "book" },
    type: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    uploadStatus: {
      type: String,
      enum: ["saved", "failed"],
      default: "saved",
    },
    textContent: { type: String, default: "" },
    textExtractStatus: {
      type: String,
      enum: ["pending", "extracted", "empty", "failed", "unsupported"],
      default: "pending",
    },
    textExtractError: { type: String, default: "" },
    scanStatus: {
      type: String,
      enum: ["pending", "clean", "skipped", "failed"],
      default: "skipped",
    },
    storageProvider: {
      type: String,
      enum: ["local", "cloud-pending"],
      default: "local",
    },
    coverImageOriginalName: { type: String, default: "" },
    coverImageStoredName: { type: String, default: "" },
    coverImagePath: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Upload", uploadSchema);

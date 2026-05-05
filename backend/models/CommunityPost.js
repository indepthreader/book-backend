const mongoose = require("mongoose");

const communityCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorPic: {
      type: String,
      default: "",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: true, timestamps: true },
);

const communityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorPic: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    bookTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2500,
    },
    takeaway: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    mood: {
      type: String,
      enum: ["inspired", "proud", "curious", "grateful", "focused"],
      default: "inspired",
    },
    visibility: {
      type: String,
      enum: ["public"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["published", "hidden"],
      default: "published",
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [communityCommentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);

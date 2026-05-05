const express = require("express");
const mongoose = require("mongoose");

const CommunityPost = require("../models/CommunityPost");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  return value._id ? normalizeId(value._id) : "";
}

function serializeComment(comment) {
  return {
    id: comment._id,
    text: comment.text,
    author: {
      id: normalizeId(comment.user),
      name: comment.authorName || "Reader",
      pic: comment.authorPic || "",
    },
    createdAt: comment.createdAt,
  };
}

function serializePost(post, currentUserId = "") {
  const authorName = post.authorName || post.user?.name || "Reader";
  const authorPic = post.authorPic || post.user?.pic || "";
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const dislikes = Array.isArray(post.dislikes) ? post.dislikes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];

  return {
    id: post._id,
    title: post.title,
    bookTitle: post.bookTitle || "",
    experience: post.experience,
    takeaway: post.takeaway || "",
    mood: post.mood || "inspired",
    visibility: post.visibility || "public",
    status: post.status || "published",
    author: {
      id: normalizeId(post.user),
      name: authorName,
      pic: authorPic,
      role: post.user?.role || "user",
    },
    reactions: {
      likes: likes.length,
      dislikes: dislikes.length,
      currentUserReaction: likes.some((id) => normalizeId(id) === currentUserId)
        ? "like"
        : dislikes.some((id) => normalizeId(id) === currentUserId)
          ? "dislike"
          : "",
    },
    comments: comments.map(serializeComment),
    commentsCount: comments.length,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

router.get("/", auth, async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 60);
    const posts = await CommunityPost.find({
      status: "published",
      visibility: "public",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name pic role");

    res.json({
      success: true,
      posts: posts.map((post) => serializePost(post, req.user.id)),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, bookTitle, experience, takeaway, mood } = req.body;

    if (!String(title || "").trim() || !String(experience || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and experience are required",
      });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const post = await CommunityPost.create({
      user: user._id,
      authorName: user.name,
      authorPic: user.pic || "",
      title: String(title).trim(),
      bookTitle: String(bookTitle || "").trim(),
      experience: String(experience).trim(),
      takeaway: String(takeaway || "").trim(),
      mood: ["inspired", "proud", "curious", "grateful", "focused"].includes(
        mood,
      )
        ? mood
        : "inspired",
      visibility: "public",
      status: "published",
      likes: [],
      dislikes: [],
      comments: [],
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      "user",
      "name pic role",
    );

    res.status(201).json({
      success: true,
      message: "Your experience has been shared with the community.",
      post: serializePost(populatedPost, req.user.id),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/react", auth, async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Reaction type must be like or dislike",
      });
    }

    const post = await CommunityPost.findById(req.params.id).populate(
      "user",
      "name pic role",
    );
    if (!post || post.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.id;
    const likeIds = post.likes.map((id) => normalizeId(id));
    const dislikeIds = post.dislikes.map((id) => normalizeId(id));

    post.likes = post.likes.filter((id) => normalizeId(id) !== userId);
    post.dislikes = post.dislikes.filter((id) => normalizeId(id) !== userId);

    if (type === "like" && !likeIds.includes(userId)) {
      post.likes.push(userId);
    }

    if (type === "dislike" && !dislikeIds.includes(userId)) {
      post.dislikes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      post: serializePost(post, userId),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/comments", auth, async (req, res, next) => {
  try {
    const text = String(req.body.text || "").trim();
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const [post, user] = await Promise.all([
      CommunityPost.findById(req.params.id).populate("user", "name pic role"),
      User.findById(req.user.id).lean(),
    ]);

    if (!post || post.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    post.comments.push({
      user: user._id,
      authorName: user.name,
      authorPic: user.pic || "",
      text,
    });

    await post.save();

    res.status(201).json({
      success: true,
      post: serializePost(post, req.user.id),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

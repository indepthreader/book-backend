// routes/ai.js  — unified AI router (3 tools)
const express = require("express");
const fs = require("fs");
const mammoth = require("mammoth");
const Upload = require("../models/Upload");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const {
  generateCoachInsight,
  generateBookLearning,
  generateAITool,
} = require("../servies/ai/provider");

const router = express.Router();

// ─── pdf-parse loader (safe) ─────────────────────────────────────────────────
let parsePdf = null;
try {
  const mod = require("pdf-parse");
  if (typeof mod === "function") parsePdf = mod;
  else if (typeof mod?.default === "function") parsePdf = mod.default;
  else parsePdf = require("pdf-parse/lib/pdf-parse.js");
  if (typeof parsePdf !== "function") throw new Error("not a function");
} catch (err) {
  console.error("❌ pdf-parse load error:", err.message);
  parsePdf = null;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────
async function extractTextFromFile(filePath, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      if (!parsePdf) return "";
      const buffer = fs.readFileSync(filePath);
      const data = await parsePdf(buffer);
      return data.text || "";
    }
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }
    return "";
  } catch (err) {
    console.error("Text extraction error:", err.message);
    return "";
  }
}

async function getBookContent(bookId) {
  if (!bookId) return { book: null, bookContent: "" };

  const book = await Upload.findById(bookId);
  if (!book) throw Object.assign(new Error("Book not found"), { status: 404 });

  let bookContent = "";
  if (book.textContent && book.textContent.length > 50) {
    bookContent = book.textContent;
  } else {
    const extracted = await extractTextFromFile(book.path, book.mimeType);
    book.textContent = extracted || "";
    book.textExtractStatus = extracted ? "extracted" : "failed";
    book.textExtractError = extracted ? "" : "Extraction failed";
    await book.save();
    bookContent = extracted || "";
  }
  return { book, bookContent };
}

async function getUserProfile(userId, preferredLanguage) {
  const user = await User.findById(userId).lean();
  if (!user) throw Object.assign(new Error("User not found"), { status: 401 });
  return {
    _raw: user,
    userName: user.name,
    userAge: user.profile?.age,
    userGender: user.profile?.gender,
    userCity: user.profile?.city,
    userState: user.profile?.state,
    userCountry: user.profile?.country,
    userEducation: user.profile?.education,
    userCurrentStatus: user.profile?.currentStatus,
    userProfession: user.profile?.profession,
    userGoals: user.profile?.goals,
    userChallenges: user.profile?.challenges,
    userInterests: user.profile?.interests,
    preferredLanguage:
      preferredLanguage || user.profile?.preferredLanguage || "English",
    userFatherOccupation: user.profile?.family?.fatherOccupation,
    userMotherOccupation: user.profile?.family?.motherOccupation,
    userSiblings: user.profile?.family?.siblings,
  };
}

function checkSubscription(user) {
  const now = new Date();
  const createdAt = new Date(user.createdAt);
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + 7);

  const isPro = user.paymentSubscription?.isActive === true;
  const isTrial = now < trialEnd;
  const isAdmin = user.role === "admin";

  console.log({ isPro, isTrial, trialEnd, now });

  if (!isPro && !isTrial && !isAdmin) {
    const err = new Error("subscription_required");
    err.status = 403;
    err.body = {
      error: "subscription_required",
      message:
        "AI features are Pro-only. Your 7-day free trial has expired. Upgrade to Pro (₹149/month).",
      plan: user.paymentSubscription?.plan || "free",
      isActive: false,
      trialExpired: true,
    };
    throw err;
  }
}

// Centralised error handler for routes
function routeError(res, err) {
  console.error("AI route error:", err);
  if (err.body) return res.status(err.status || 500).json(err.body);
  if (err.status) return res.status(err.status).json({ error: err.message });
  return res
    .status(500)
    .json({ error: err.message || "Internal server error" });
}

// ════════════════════════════════════════════════════════════════════════════
// ROUTE 1 — POST /api/ai/coach
// ════════════════════════════════════════════════════════════════════════════
router.post("/coach", auth, async (req, res) => {
  try {
    const { bookId, ...payload } = req.body;

    // auth + subscription
    const userProfile = await getUserProfile(
      req.user.id,
      payload.preferredLanguage,
    );
    checkSubscription(userProfile._raw);

    // book content
    const { book, bookContent } = await getBookContent(bookId);

    const result = await generateCoachInsight({
      ...payload,
      ...userProfile,
      bookTitle: book?.originalName || payload.bookTitle || "Unknown Book",
      bookAuthor: payload.bookAuthor || "Unknown",
      bookContent: bookContent.slice(0, 12000),
    });

    res.json(result);
  } catch (err) {
    routeError(res, err);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ROUTE 2 — POST /api/ai/book-learning
// ════════════════════════════════════════════════════════════════════════════
router.post("/book-learning", auth, async (req, res) => {
  try {
    const { bookId, focusSection, learningGoal, ...payload } = req.body;

    const userProfile = await getUserProfile(
      req.user.id,
      payload.preferredLanguage,
    );
    checkSubscription(userProfile._raw);

    const { book, bookContent } = await getBookContent(bookId);

    const result = await generateBookLearning({
      ...payload,
      userName: userProfile.userName,
      userProfession: userProfile.userProfession,
      preferredLanguage: userProfile.preferredLanguage,
      bookTitle: book?.originalName || payload.bookTitle || "Unknown Book",
      bookContent: bookContent.slice(0, 12000),
      focusSection: focusSection || "",
      learningGoal: learningGoal || "",
    });

    res.json(result);
  } catch (err) {
    routeError(res, err);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ROUTE 3 — POST /api/ai/tools
// body: { toolType, inputText, context, preferredLanguage }
// toolType: "restyle" | "test_generator" | "learning_tracker"
// ════════════════════════════════════════════════════════════════════════════
router.post("/tools", auth, async (req, res) => {
  try {
    const { toolType, inputText, context, ...payload } = req.body;

    if (!toolType || !inputText) {
      return res
        .status(400)
        .json({ error: "toolType and inputText are required" });
    }

    const userProfile = await getUserProfile(
      req.user.id,
      payload.preferredLanguage,
    );
    checkSubscription(userProfile._raw);

    const result = await generateAITool({
      toolType,
      inputText,
      context: context || "",
      preferredLanguage: userProfile.preferredLanguage,
      userName: userProfile.userName,
    });

    res.json(result);
  } catch (err) {
    routeError(res, err);
  }
});

module.exports = router;

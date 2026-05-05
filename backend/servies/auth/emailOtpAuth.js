const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../../models/User");
const { auth } = require("../../middleware/auth");
const { sendOTP, generateOTP } = require("../../utils/otp");
const { setOTP, getOTP, deleteOTP } = require("../../utils/otpTempStore");
const { authResponse, getTokenMeta, sanitizeUser } = require("./authUtils");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function validateNewUserInfo({ name, phone, password }) {
  if (!name || !String(name).trim()) return "Name is required";
  if (!phone || !String(phone).trim()) return "Phone is required";
  if (!password || String(password).length < 6)
    return "Password must be at least 6 characters";
  return null;
}

async function deliverOtp(email) {
  if (process.env.NODE_ENV === "test" || process.env.SKIP_EMAIL === "true") {
    return generateOTP();
  }
  try {
    return await sendOTP(email);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("OTP email failed, using dev OTP:", error.message);
      return generateOTP();
    }
    throw new Error("Unable to send OTP");
  }
}

// ─── Check email ───────────────────────────────────────────────────────────────
router.post("/check-email", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });

    res.json({
      success: true,
      exists: !!user,
      needsAdditionalInfo: !user,
      user: user ? sanitizeUser(user) : null,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Request OTP ───────────────────────────────────────────────────────────────
router.post("/otp/request", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    const userData = { email };
    if (!user) {
      // Validate required fields
      const error = validateNewUserInfo(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error,
          needsAdditionalInfo: true,
        });
      }

      // ── BASIC (top-level fields) ──
      userData.name = req.body.name.trim();
      userData.phone = req.body.phone.trim();
      userData.password = req.body.password; // hashed on User.pre('save')

      // ── PROFILE subdocument ──
      // Matches userProfileSchema exactly (age, gender, city, state, country,
      // education, currentStatus, profession, goals, challenges, interests,
      // preferredLanguage, family)
      userData.profile = {
        age: req.body.age ? Number(req.body.age) : undefined,
        gender: req.body.gender || undefined,

        // Location
        city: req.body.city || undefined,
        state: req.body.state || undefined,
        country: req.body.country || undefined,

        // Education / Career
        education: req.body.education || undefined,
        currentStatus: req.body.currentStatus || undefined,
        profession: req.body.profession || undefined,

        // Mindset / AI
        goals: req.body.goals || undefined,
        challenges: req.body.challenges || undefined,
        interests: Array.isArray(req.body.interests) ? req.body.interests : [],
        preferredLanguage: req.body.preferredLanguage || "English",

        // Family — nested inside profile per schema
        family: {
          fatherOccupation: req.body.fatherOccupation || undefined,
          motherOccupation: req.body.motherOccupation || undefined,
          // siblings: [{relation, working, occupation}]
          siblings: Array.isArray(req.body.siblings)
            ? req.body.siblings.map((s) => ({
                relation: s.role || s.relation || "",
                working:
                  s.working !== undefined ? Boolean(s.working) : undefined,
                occupation: s.occupation || s.name || "",
              }))
            : [],
        },
      };
    }

    const otp = await deliverOtp(email);
    setOTP(email, userData, otp, 10 * 60 * 1000);

    res.json({
      success: true,
      message: "OTP sent",
      exists: !!user,
      needsAdditionalInfo: !user,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Verify OTP ────────────────────────────────────────────────────────────────
router.post("/otp/verify", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const record = getOTP(email);

    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email & OTP required" });

    if (!record || record.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    let user = await User.findOne({ email }).select("+password");

    // Create only if new user
    if (!user) {
      const { name, phone, password, profile } = record.userData;
      user = await User.create({
        // Top-level
        name,
        email,
        phone,
        password, // bcrypt pre-save hook will hash this
        authProvider: "local",

        // Entire profile subdocument in one go — matches userProfileSchema
        profile,
      });
    }

    deleteOTP(email);

    res.json({
      ...authResponse(user),
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
});

// ─── Password login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    res.json({ ...authResponse(user), message: "Login successful" });
  } catch (err) {
    next(err);
  }
});

// ─── Auth checks ────────────────────────────────────────────────────────────
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      tokenValid: true,
      role: req.user.role,
      tokenExpiresAt: getTokenMeta(req.token).expiresAt,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/check", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      tokenExists: true,
      tokenExpired: false,
      role: req.user.role,
      tokenExpiresAt: getTokenMeta(req.token).expiresAt,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

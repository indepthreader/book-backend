const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const User = require("../../models/User");
const { authResponse } = require("./authUtils");
const { auth } = require("../../middleware/auth");
const { getAppConfigValues } = require("../appConfig");

function hasProfileDetails(user) {
  const profile = user?.profile || {};

  return Boolean(
    profile.age ||
    profile.gender ||
    profile.city ||
    profile.state ||
    profile.country ||
    profile.education ||
    profile.currentStatus ||
    profile.profession ||
    profile.goals ||
    profile.challenges ||
    (Array.isArray(profile.interests) && profile.interests.length) ||
    profile.family?.fatherOccupation ||
    profile.family?.motherOccupation ||
    (Array.isArray(profile.family?.siblings) && profile.family.siblings.length),
  );
}
async function getGoogleAuthConfig() {
  return getAppConfigValues([
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "FRONTEND_URL",
  ]);
}

async function createOAuthClient() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  } = await getGoogleAuthConfig();

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error(
      "Google auth is not configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.",
    );
  }

  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );
}

// -----------------------------
// 🔗 LOGIN WITH GOOGLE
// -----------------------------
router.get("/auth/google", async (req, res) => {
  const oauth2Client = await createOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  res.redirect(url);
});

// -----------------------------
// 🔁 CALLBACK
// -----------------------------
router.get("/auth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const oauth2Client = await createOAuthClient();
    const { FRONTEND_URL } = await getGoogleAuthConfig();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    // -----------------------------
    // 🧠 CHECK USER IN DB
    // -----------------------------
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // ✅ CREATE NEW USER
      user = await User.create({
        name: data.name,
        email: data.email,
        googleId: data.id,
        pic: data.picture,
        authProvider: "google",
      });
    } else {
      // ✅ UPDATE EXISTING USER (optional)
      user.googleId = data.id;
      user.pic = data.picture;
      user.authProvider = user.authProvider === "local" ? "local" : "google";
      await user.save();
    }

    const payload = authResponse(user);
    const needsProfile = !hasProfileDetails(user);
    const frontendUrl = FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = new URL("/auth/callback", frontendUrl);
    redirectUrl.searchParams.set("token", payload.token);
    redirectUrl.searchParams.set("expiresAt", payload.tokenExpiresAt || "");
    redirectUrl.searchParams.set("needsProfile", String(needsProfile));
    redirectUrl.searchParams.set("next", "/profile-setup");

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
});

router.patch("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const b = req.body;

    // Build nested profile matching userProfileSchema
    user.profile = {
      age: b.age ? Number(b.age) : user.profile?.age,
      gender: b.gender || user.profile?.gender,

      city: b.city || user.profile?.city,
      state: b.state || user.profile?.state,
      country: b.country || user.profile?.country,

      education: b.education || user.profile?.education,
      currentStatus: b.currentStatus || user.profile?.currentStatus,
      profession: b.profession || user.profile?.profession,

      goals: b.goals || user.profile?.goals,
      challenges: b.challenges || user.profile?.challenges,
      interests: Array.isArray(b.interests)
        ? b.interests
        : user.profile?.interests || [],
      preferredLanguage:
        b.preferredLanguage || user.profile?.preferredLanguage || "English",

      family: {
        fatherOccupation:
          b.fatherOccupation || user.profile?.family?.fatherOccupation,
        motherOccupation:
          b.motherOccupation || user.profile?.family?.motherOccupation,
        siblings: Array.isArray(b.siblings)
          ? b.siblings.map((s) => ({
              relation: s.relation || "",
              working: Boolean(s.working),
              occupation: s.occupation || "",
            }))
          : user.profile?.family?.siblings || [],
      },
    };

    await user.save();

    const { sanitizeUser } = require("./authUtils");
    res.json({
      success: true,
      message: "Profile saved",
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/auth/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(user._id);
    res.json({
      success: true,
      // profile: user.profile || {},
      profile: {
        ...user.profile,
        id: user._id, // ✅ add id inside profile
      },
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;

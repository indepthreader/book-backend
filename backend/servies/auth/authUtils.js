const jwt = require("jsonwebtoken");

const TOKEN_EXPIRES_IN = "7d";

// ─── Clean User Object (Safe for frontend) ───
function sanitizeUser(user) {
  if (!user) return null;

  const subscription = user.paymentSubscription || {};
  const profile = user.profile || {};

  // 🎯 Trial logic
  const trialEndsAt = user.createdAt
    ? new Date(
        new Date(user.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString()
    : null;

  const trialActive =
    !subscription.isActive && trialEndsAt
      ? new Date(trialEndsAt).getTime() > Date.now()
      : false;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    pic: user.pic,
    authProvider: user.authProvider,

    // 🔥 ADD PROFILE (IMPORTANT)
    profile: {
      age: profile.age || null,
      gender: profile.gender || "",

      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "",

      education: profile.education || "",
      currentStatus: profile.currentStatus || "",
      profession: profile.profession || "",

      family: {
        fatherOccupation: profile.family?.fatherOccupation || "",
        motherOccupation: profile.family?.motherOccupation || "",
        siblings: profile.family?.siblings || [],
      },

      goals: profile.goals || "",
      challenges: profile.challenges || "",
      interests: profile.interests || [],

      preferredLanguage: profile.preferredLanguage || "",
    },

    // 💳 Subscription
    paymentSubscription: {
      isActive: Boolean(subscription.isActive),
      plan: subscription.plan || "free",
      startDate: subscription.startDate || null,
      endDate: subscription.endDate || null,
      amount: subscription.amount || 0,
      currency: subscription.currency || "INR",
      razorpayOrderId: subscription.razorpayOrderId || "",
      razorpayPaymentId: subscription.razorpayPaymentId || "",
    },

    // ⏳ Trial
    trial: {
      isActive: trialActive,
      endsAt: trialEndsAt,
      daysLeft: trialEndsAt
        ? Math.max(
            0,
            Math.ceil(
              (new Date(trialEndsAt).getTime() - Date.now()) /
                (24 * 60 * 60 * 1000),
            ),
          )
        : 0,
    },

    createdAt: user.createdAt,
  };
}

// ─── JWT Token ───
function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );
}

// ─── Token Meta ───
function getTokenMeta(token) {
  const decoded = jwt.decode(token);

  return {
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
  };
}

// ─── Final Auth Response ───
function authResponse(user) {
  const token = signToken(user);

  return {
    success: true,
    token,
    tokenExpiresIn: TOKEN_EXPIRES_IN,
    tokenExpiresAt: getTokenMeta(token).expiresAt,
    user: sanitizeUser(user),
  };
}

module.exports = {
  TOKEN_EXPIRES_IN,
  authResponse,
  getTokenMeta,
  sanitizeUser,
  signToken,
};

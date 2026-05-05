const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ─── User Profile Subdocument ───
const userProfileSchema = new mongoose.Schema(
  {
    age: Number,
    gender: String,

    // Location
    city: String,
    state: String,
    country: String,

    // Education / Career
    education: String,
    currentStatus: {
      type: String,
      enum: ["student", "working", "business", "freelancer", "other"],
    },
    profession: String,

    // Family
    family: {
      fatherOccupation: String,
      motherOccupation: String,
      siblings: [
        {
          relation: String, // brother/sister
          working: Boolean,
          occupation: String,
        },
      ],
    },

    // Mindset / AI
    goals: String,
    challenges: String,
    interests: [String],

    preferredLanguage: String,
  },
  { _id: false },
);

// ─── Main User Schema ───
const userSchema = new mongoose.Schema(
  {
    // Basic Auth
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
      default: null, // for Google users
    },

    phone: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    pic: {
      type: String,
      default: "",
    },

    // 🔥 Embedded Profile
    profile: userProfileSchema,

    // 💳 Subscription
    paymentSubscription: {
      isActive: { type: Boolean, default: false },
      plan: {
        type: String,
        enum: ["free", "basic", "pro"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
      razorpaySignature: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

// 🔐 Password Hashing
userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);

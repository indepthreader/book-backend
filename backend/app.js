require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");
const googleAuthRoutes = require("./servies/auth/googleAuth");
const emailOtpAuthRoutes = require("./servies/auth/emailOtpAuth");
const aichat = require("./routes/aichat");
const uploadRoutes = require("./routes/uploads");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payments");
const communityRoutes = require("./routes/community");
const analyticsRoutes = require("./routes/analytics");
const publicRoutes = require("./routes/public");

const app = express();
const server = http.createServer(app);

// ✅ TRUST PROXY (important for VPS + Nginx)
app.set("trust proxy", 1);

// ✅ PORT
const PORT = process.env.PORT || 2000;

// -----------------------------
// 🔐 MIDDLEWARE
// -----------------------------

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // 🔥 disable completely
  }),
);
// CORS (⚠️ restrict in production)
app.use(
  cors({
    origin: "*", // 🔥 change to your domain in production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// app.use((req, res, next) => {
//   res.removeHeader("Cross-Origin-Resource-Policy");
//   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//   next();
// });
app.use(
  "/api/storage/uploads",
  express.static(path.join(__dirname, "storage/uploads")),
);
app.options(/.*/, cors());

// Rate limiting (anti-spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Razorpay webhook needs raw body for signature verification
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Logger
app.use(morgan("dev"));

// -----------------------------
// 🚀 ROUTES
// -----------------------------

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Health check (important for uptime monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date(),
  });
});

app.use("/api/auth", emailOtpAuthRoutes);
// app.use("/api/auth", googleAuthRoutes);
app.use("/api", googleAuthRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/aichat", aichat);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);
// -----------------------------
// ❌ GLOBAL ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  const message =
    err?.error?.description ||
    err?.description ||
    err?.error?.message ||
    err?.message ||
    "Internal Server Error";

  console.error("API error:", message, err?.stack || err);
  res.status(err?.statusCode || err?.status || 500).json({
    success: false,
    message,
  });
});

// -----------------------------
// 🚀 START SERVER
// -----------------------------
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

// -----------------------------
// ⚠️ HANDLE CRASHES (VERY IMPORTANT)
// -----------------------------
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

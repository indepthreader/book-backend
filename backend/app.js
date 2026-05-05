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

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, "public");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(/.*/, cors());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use(
  "/api/storage/uploads",
  express.static(path.join(__dirname, "storage/uploads")),
);

// ✅ API ROUTES FIRST
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date(),
  });
});

app.use("/api/auth", emailOtpAuthRoutes);
app.use("/api", googleAuthRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/aichat", aichat);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);

// ✅ VITE DIST STATIC AFTER API
app.use(express.static(distPath));

// ✅ SPA FALLBACK LAST ONLY
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ ERROR HANDLER AFTER ROUTES
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

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Serving frontend from: ${distPath}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

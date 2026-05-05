// const jwt = require("jsonwebtoken");

// exports.auth = (req, res, next) => {
//   const token = req.headers.authorization;
//   //   console.log(token);
//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const decoded = jwt.verify(token.split(" ")[1], "SECRETKEY");

//     req.user = decoded;

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[1]) {
      return parts[1];
    }
  }

  if (req.query && req.query.token) {
    return req.query.token;
  }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((cookie) => {
        const [key, ...valueParts] = cookie.trim().split("=");
        return [key, decodeURIComponent(valueParts.join("=") || "")];
      }),
    );

    if (cookies.token) {
      return cookies.token;
    }
  }

  return null;
}

exports.extractToken = extractToken;

exports.auth = (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        tokenExists: false,
        tokenExpired: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      tokenExists: true,
      tokenExpired: err.name === "TokenExpiredError",
      message: "Invalid or expired token",
    });
  }
};
exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

exports.optionalAuth = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch {
    next();
  }
};

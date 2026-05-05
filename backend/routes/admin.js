const fs = require("fs");
const express = require("express");

const User = require("../models/User");
const Upload = require("../models/Upload");
const Payment = require("../models/Payment");
const PageVisit = require("../models/PageVisit");
const { auth, admin } = require("../middleware/auth");
const { sanitizeUser } = require("../servies/auth/authUtils");
const {
  listAdminConfigs,
  saveAdminConfigs,
} = require("../servies/appConfig");

const router = express.Router();

router.use(auth, admin);

router.get("/overview", async (req, res, next) => {
  try {
    const [users, uploads, activeSubscribers, admins, paymentSummary] = await Promise.all([
      User.find().sort({ createdAt: -1 }),
      Upload.find().sort({ createdAt: -1 }).limit(50).populate("user", "name email role"),
      User.countDocuments({ "paymentSubscription.isActive": true }),
      User.countDocuments({ role: "admin" }),
      Payment.aggregate([
        { $match: { status: "captured" } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$amount" },
            successfulPayments: { $sum: 1 },
          },
        },
      ]),
    ]);

    const summary = paymentSummary[0] || {
      totalEarnings: 0,
      successfulPayments: 0,
    };

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalUploads: uploads.length,
        activeSubscribers,
        admins,
        totalEarnings: summary.totalEarnings || 0,
        successfulPayments: summary.successfulPayments || 0,
      },
      users: users.map(sanitizeUser),
      uploads,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await listAdminConfigs();
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
});

function getDateParts(now = new Date()) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return {
    dateKey: `${year}-${month}-${day}`,
    monthKey: `${year}-${month}`,
    yearKey: String(year),
  };
}

async function summarizePeriod(match) {
  const [totals] = await PageVisit.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        loggedInVisits: {
          $sum: { $cond: [{ $eq: ["$isGuest", false] }, 1, 0] },
        },
        guestVisits: {
          $sum: { $cond: [{ $eq: ["$isGuest", true] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    totals || {
      totalVisits: 0,
      loggedInVisits: 0,
      guestVisits: 0,
    }
  );
}

router.get("/analytics", async (req, res, next) => {
  try {
    const { dateKey, monthKey, yearKey } = getDateParts();
    const [today, month, year, pages] = await Promise.all([
      summarizePeriod({ dateKey }),
      summarizePeriod({ monthKey }),
      summarizePeriod({ yearKey }),
      PageVisit.aggregate([
        { $match: { monthKey } },
        {
          $group: {
            _id: "$page",
            totalVisits: { $sum: 1 },
            loggedInVisits: {
              $sum: { $cond: [{ $eq: ["$isGuest", false] }, 1, 0] },
            },
            guestVisits: {
              $sum: { $cond: [{ $eq: ["$isGuest", true] }, 1, 0] },
            },
          },
        },
        { $sort: { totalVisits: -1, _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      periods: {
        today,
        month,
        year,
      },
      pages: pages.map((item) => ({
        page: item._id,
        totalVisits: item.totalVisits,
        loggedInVisits: item.loggedInVisits,
        guestVisits: item.guestVisits,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const settings = await saveAdminConfigs(req.body.settings, req.user.id);
    res.json({
      success: true,
      message: "Admin settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  try {
    const updates = {};

    if (typeof req.body.name === "string") updates.name = req.body.name.trim();
    if (typeof req.body.phone === "string") updates.phone = req.body.phone.trim();
    if (["user", "admin"].includes(req.body.role)) updates.role = req.body.role;

    if (typeof req.body.subscriptionActive === "boolean") {
      updates["paymentSubscription.isActive"] = req.body.subscriptionActive;
      updates["paymentSubscription.plan"] = req.body.subscriptionActive ? "pro" : "free";
      updates["paymentSubscription.startDate"] = req.body.subscriptionActive ? new Date() : null;
      updates["paymentSubscription.endDate"] = req.body.subscriptionActive
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const uploads = await Upload.find({ user: user._id });
    uploads.forEach((file) => fs.rm(file.path, { force: true }, () => {}));
    await Upload.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/uploads/:id", async (req, res, next) => {
  try {
    const file = await Upload.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    fs.rm(file.path, { force: true }, async () => {
      await file.deleteOne();
      res.json({ success: true });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

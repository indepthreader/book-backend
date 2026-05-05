const express = require("express");

const PageVisit = require("../models/PageVisit");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

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

router.post("/visit", optionalAuth, async (req, res, next) => {
  try {
    const page = String(req.body.page || "").trim() || "/";
    const visitorKey = String(req.body.visitorKey || "").trim();

    if (!visitorKey) {
      return res.status(400).json({
        success: false,
        message: "visitorKey is required",
      });
    }

    const { dateKey, monthKey, yearKey } = getDateParts();

    await PageVisit.updateOne(
      { visitorKey, page, dateKey },
      {
        $setOnInsert: {
          visitorKey,
          page,
          dateKey,
          monthKey,
          yearKey,
          isGuest: !req.user?.id,
          user: req.user?.id || null,
        },
      },
      { upsert: true },
    );

    res.json({ success: true });
  } catch (error) {
    if (error?.code === 11000) {
      return res.json({ success: true, duplicate: true });
    }
    next(error);
  }
});

module.exports = router;

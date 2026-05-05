const express = require("express");

const { getAppConfigValues } = require("../servies/appConfig");

const router = express.Router();

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await getAppConfigValues([
      "FRONTEND_URL",
      "CONTACT_NAME",
      "CONTACT_EMAIL",
      "CONTACT_PHONE",
      "CONTACT_WHATSAPP",
    ]);

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

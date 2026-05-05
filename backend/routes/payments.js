const crypto = require("crypto");
const express = require("express");
const Razorpay = require("razorpay");

const User = require("../models/User");
const Payment = require("../models/Payment");
const { auth } = require("../middleware/auth");
const { sanitizeUser } = require("../servies/auth/authUtils");
const { getAppConfigValues } = require("../servies/appConfig");

const router = express.Router();
const PLAN_CURRENCY = "INR";

function getPaymentErrorMessage(error) {
  return (
    error?.error?.description ||
    error?.description ||
    error?.error?.message ||
    error?.message ||
    "Unable to start Razorpay payment"
  );
}

async function getRazorpayConfig() {
  return getAppConfigValues([
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "SUBSCRIPTION_AMOUNT",
  ]);
}

function toPaise(amountInInr) {
  return Math.round(Number(amountInInr || 0) * 100);
}

function toInr(amountInPaise) {
  return Number(amountInPaise || 0) / 100;
}

async function getRazorpayClient() {
  const { RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } =
    await getRazorpayConfig();

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  }

  return {
    client: new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }),
    key_id: keyId,
    key_secret: keySecret,
  };
}

async function activateSubscription({
  userId,
  orderId,
  paymentId,
  signature = "",
  amountInPaise,
  currency = PLAN_CURRENCY,
}) {
  const startDate = new Date();
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "paymentSubscription.isActive": true,
        "paymentSubscription.plan": "pro",
        "paymentSubscription.startDate": startDate,
        "paymentSubscription.endDate": endDate,
        "paymentSubscription.amount": toInr(amountInPaise),
        "paymentSubscription.currency": currency,
        "paymentSubscription.razorpayOrderId": orderId,
        "paymentSubscription.razorpayPaymentId": paymentId,
        "paymentSubscription.razorpaySignature": signature,
      },
    },
    { new: true },
  );

  return user;
}

router.post("/create-order", auth, async (req, res, next) => {
  try {
    const razorpay = await getRazorpayClient();
    const { SUBSCRIPTION_AMOUNT } = await getRazorpayConfig();
    const amountInPaise = toPaise(SUBSCRIPTION_AMOUNT || 149);
    const receipt = `zp-${String(req.user.id).slice(-8)}-${Date.now().toString().slice(-8)}`;
    const order = await razorpay.client.orders.create({
      amount: amountInPaise,
      currency: PLAN_CURRENCY,
      receipt,
      notes: {
        userId: req.user.id,
        plan: "pro-monthly",
      },
    });

    await Payment.findOneAndUpdate(
      { orderId: order.id },
      {
        $set: {
          user: req.user.id,
          provider: "razorpay",
          orderId: order.id,
          amount: toInr(order.amount),
          currency: PLAN_CURRENCY,
          status: "created",
          plan: "pro-monthly",
          source: "order_create",
          notes: order.notes || {},
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({
      success: true,
      order,
      key: razorpay.key_id,
      amount: amountInPaise,
      currency: PLAN_CURRENCY,
      amountInInr: toInr(amountInPaise),
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: getPaymentErrorMessage(error),
    });
  }
});

router.post("/verify", auth, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const { RAZORPAY_KEY_SECRET } = await getRazorpayConfig();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Razorpay payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    const existingOrder = await Payment.findOne({ orderId: razorpay_order_id });
    const userId =
      existingOrder?.user?.toString() || req.user.id;
    const amountInPaise = existingOrder
      ? toPaise(existingOrder.amount)
      : undefined;

    const user = await activateSubscription({
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amountInPaise,
      currency: existingOrder?.currency || PLAN_CURRENCY,
    });

    await Payment.findOneAndUpdate(
      { paymentId: razorpay_payment_id },
      {
        $set: {
          user: userId,
          provider: "razorpay",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          amount: existingOrder?.amount || 0,
          currency: existingOrder?.currency || PLAN_CURRENCY,
          status: "captured",
          plan: "pro-monthly",
          source: "checkout_verify",
          notes: existingOrder?.notes || {},
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({
      success: true,
      message: "Subscription activated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getPaymentErrorMessage(error),
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const { RAZORPAY_WEBHOOK_SECRET } = await getRazorpayConfig();

    if (!signature || !RAZORPAY_WEBHOOK_SECRET) {
      return res.status(400).json({
        success: false,
        message: "Webhook signature or secret missing",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(req.body.toString("utf8"));
    const paymentEntity = event?.payload?.payment?.entity;
    const orderEntity = event?.payload?.order?.entity;

    if (event?.event !== "payment.captured" || !paymentEntity?.id) {
      return res.json({ success: true, ignored: true });
    }

    const orderId = paymentEntity.order_id || orderEntity?.id || "";
    const existingOrder = orderId
      ? await Payment.findOne({ orderId })
      : null;
    const userId =
      existingOrder?.user?.toString() || paymentEntity?.notes?.userId || null;

    if (userId && orderId) {
      await activateSubscription({
        userId,
        orderId,
        paymentId: paymentEntity.id,
        signature: "",
        amountInPaise: paymentEntity.amount,
        currency: paymentEntity.currency || PLAN_CURRENCY,
      });
    }

    await Payment.findOneAndUpdate(
      { paymentId: paymentEntity.id },
      {
        $set: {
          user: userId,
          provider: "razorpay",
          orderId,
          paymentId: paymentEntity.id,
          amount: toInr(paymentEntity.amount),
          currency: paymentEntity.currency || PLAN_CURRENCY,
          status: "captured",
          plan: paymentEntity?.notes?.plan || "pro-monthly",
          source: "webhook",
          webhookEventId: event?.payload?.payment?.entity?.id || "",
          notes: paymentEntity.notes || {},
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: getPaymentErrorMessage(error),
    });
  }
});

module.exports = router;

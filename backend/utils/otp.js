const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const { getAppConfigValues } = require("../servies/appConfig");

function generateOTP(length = 6) {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");
}

async function createTransporter() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = await getAppConfigValues([
    "GMAIL_USER",
    "GMAIL_APP_PASSWORD",
  ]);

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Gmail mail settings are not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

function getOtpEmailHtml(otp) {
  const template = fs.readFileSync(
    path.join(__dirname, "otp-email-template.html"),
    "utf-8",
  );
  return template.replace("{{OTP}}", otp);
}

async function sendOTP(to, length = 6) {
  const otp = generateOTP(length);
  const transporter = await createTransporter();
  const { GMAIL_USER } = await getAppConfigValues(["GMAIL_USER"]);

  const mailOptions = {
    from: `"InDepth Security" <${GMAIL_USER}>`,
    to,
    subject: "Your OTP Code – InDepth",
    text: `Your OTP is: ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
    html: getOtpEmailHtml(otp),
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) reject(error);
      else resolve(otp);
    });
  });
}

module.exports = { sendOTP, generateOTP };

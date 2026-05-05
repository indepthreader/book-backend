const fs = require("fs/promises");
const path = require("path");

const AppConfig = require("../models/AppConfig");

const ENV_FILE_PATH = path.join(__dirname, "..", ".env");
const DEFAULT_MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const CONFIG_DEFINITIONS = [
  {
    key: "GEMINI_API_KEY",
    label: "Gemini API Key",
    group: "AI",
    description: "Used for Gemini-based AI features.",
    inputType: "password",
    sensitive: true,
  },
  {
    key: "RAZORPAY_KEY_ID",
    label: "Razorpay Key ID",
    group: "Payments",
    description: "Public Razorpay key used while creating payments.",
    inputType: "text",
    sensitive: true,
  },
  {
    key: "RAZORPAY_KEY_SECRET",
    label: "Razorpay Key Secret",
    group: "Payments",
    description: "Secret used to create and verify Razorpay payments.",
    inputType: "password",
    sensitive: true,
  },
  {
    key: "RAZORPAY_WEBHOOK_SECRET",
    label: "Razorpay Webhook Secret",
    group: "Payments",
    description: "Secret used to verify Razorpay webhook calls.",
    inputType: "password",
    sensitive: true,
  },
  {
    key: "SUBSCRIPTION_AMOUNT",
    label: "Subscription Amount",
    group: "Payments",
    description: "Monthly Pro subscription amount in INR.",
    inputType: "number",
    sensitive: false,
  },
  {
    key: "GOOGLE_CLIENT_ID",
    label: "Google Client ID",
    group: "Google Auth",
    description: "OAuth client ID used for Google sign in.",
    inputType: "text",
    sensitive: true,
  },
  {
    key: "GOOGLE_CLIENT_SECRET",
    label: "Google Client Secret",
    group: "Google Auth",
    description: "OAuth client secret used for Google sign in.",
    inputType: "password",
    sensitive: true,
  },
  {
    key: "GMAIL_USER",
    label: "Gmail User",
    group: "Mail",
    description: "Gmail address used for OTP and transactional email.",
    inputType: "email",
    sensitive: true,
  },
  {
    key: "GMAIL_APP_PASSWORD",
    label: "Gmail App Password",
    group: "Mail",
    description: "Gmail app password used for sending OTP emails.",
    inputType: "password",
    sensitive: true,
  },
  {
    key: "GOOGLE_REDIRECT_URI",
    label: "Google Redirect URI",
    group: "Google Auth",
    description: "Callback URL that Google redirects back to.",
    inputType: "url",
    sensitive: false,
  },
  {
    key: "FRONTEND_URL",
    label: "Frontend URL",
    group: "Frontend",
    description: "Frontend origin used for redirects and links.",
    inputType: "url",
    sensitive: false,
  },
  {
    key: "CONTACT_NAME",
    label: "Contact Name",
    group: "Public Contact",
    description: "Public contact person or business name.",
    inputType: "text",
    sensitive: false,
    dbOnly: true,
  },
  {
    key: "CONTACT_EMAIL",
    label: "Contact Email",
    group: "Public Contact",
    description: "Public support or business email.",
    inputType: "email",
    sensitive: false,
    dbOnly: true,
  },
  {
    key: "CONTACT_PHONE",
    label: "Contact Phone",
    group: "Public Contact",
    description: "Public phone number for support.",
    inputType: "text",
    sensitive: false,
    dbOnly: true,
  },
  {
    key: "CONTACT_WHATSAPP",
    label: "Contact WhatsApp",
    group: "Public Contact",
    description: "Public WhatsApp number in international format.",
    inputType: "text",
    sensitive: false,
    dbOnly: true,
  },
  {
    key: "MAX_UPLOAD_SIZE",
    label: "Max Upload Size",
    group: "Uploads",
    description: "Maximum upload size in bytes.",
    inputType: "number",
    sensitive: false,
  },
  {
    key: "GEMINI_MODEL",
    label: "Gemini Model",
    group: "AI",
    description: "Gemini model name used for AI generation.",
    inputType: "text",
    sensitive: false,
  },
  {
    key: "GEMINI_FALLBACK_MODEL",
    label: "Gemini Fallback Model",
    group: "AI",
    description: "Optional fallback Gemini model used when the primary model is overloaded.",
    inputType: "text",
    sensitive: false,
  },
];

const CONFIG_KEY_SET = new Set(CONFIG_DEFINITIONS.map((item) => item.key));

function getConfigDefinitionMap() {
  return Object.fromEntries(CONFIG_DEFINITIONS.map((item) => [item.key, item]));
}

function getEnvFallbackValue(key) {
  if (key === "MAX_UPLOAD_SIZE") {
    return String(Number(process.env.MAX_UPLOAD_SIZE) || DEFAULT_MAX_UPLOAD_SIZE);
  }

  if (key === "SUBSCRIPTION_AMOUNT") {
    return String(Number(process.env.SUBSCRIPTION_AMOUNT) || 149);
  }

  return process.env[key] || "";
}

function coerceConfigValue(key, value) {
  const raw = value == null ? "" : String(value).trim();

  if (key === "MAX_UPLOAD_SIZE" || key === "SUBSCRIPTION_AMOUNT") {
    const numeric = Number(raw);
    return Number.isFinite(numeric) && numeric > 0
      ? numeric
      : Number(getEnvFallbackValue(key));
  }

  return raw;
}

async function getConfigDocs(keys) {
  const query = Array.isArray(keys) && keys.length ? { key: { $in: keys } } : {};
  const docs = await AppConfig.find(query).lean();
  return new Map(docs.map((doc) => [doc.key, doc]));
}

async function getAppConfigValue(key, options = {}) {
  const { preferDb = true } = options;
  const docs = await getConfigDocs([key]);
  return resolveValue(key, docs.get(key), preferDb);
}

async function getAppConfigValues(keys, options = {}) {
  const { preferDb = true } = options;
  const docs = await getConfigDocs(keys);

  return Object.fromEntries(
    keys.map((key) => [key, resolveValue(key, docs.get(key), preferDb)]),
  );
}

function resolveValue(key, doc, preferDb) {
  const definition = getConfigDefinitionMap()[key];
  const envValue = getEnvFallbackValue(key);

  if (definition?.dbOnly) {
    return coerceConfigValue(key, doc?.value || "");
  }

  if (preferDb && doc?.enabled && String(doc.value || "").trim() !== "") {
    return coerceConfigValue(key, doc.value);
  }

  return coerceConfigValue(key, envValue);
}

function serializeEnvValue(value) {
  const raw = value == null ? "" : String(value);
  if (raw === "") return "";
  if (/^[A-Za-z0-9_./:@+-]+$/.test(raw)) return raw;
  return JSON.stringify(raw);
}

async function syncEnvFile(updates) {
  let content = "";

  try {
    content = await fs.readFile(ENV_FILE_PATH, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const lines = content ? content.split(/\r?\n/) : [];

  for (const [key, value] of Object.entries(updates)) {
    const nextLine = `${key}=${serializeEnvValue(value)}`;
    const index = lines.findIndex((line) => line.startsWith(`${key}=`));

    if (index >= 0) lines[index] = nextLine;
    else lines.push(nextLine);

    process.env[key] = value == null ? "" : String(value);
  }

  const normalized = `${lines.filter((line, index, arr) => !(index === arr.length - 1 && line === "")).join("\n")}\n`;
  await fs.writeFile(ENV_FILE_PATH, normalized, "utf8");
}

async function listAdminConfigs() {
  const docMap = await getConfigDocs(CONFIG_DEFINITIONS.map((item) => item.key));

  return CONFIG_DEFINITIONS.map((definition) => {
    const doc = docMap.get(definition.key);
    const envValue = getEnvFallbackValue(definition.key);
    const storedValue = doc?.value ?? "";
    const formValue = definition.dbOnly ? storedValue : storedValue || envValue;
    const effectiveValue = definition.dbOnly
      ? storedValue
      : doc?.enabled && storedValue
        ? storedValue
        : envValue;

    return {
      ...definition,
      value: formValue,
      dbValue: storedValue,
      envValue,
      effectiveValue,
      enabled: definition.dbOnly ? true : doc?.enabled ?? false,
      hasDbValue: Boolean(storedValue),
      source: definition.dbOnly
        ? storedValue
          ? "database"
          : "database"
        : doc?.enabled && storedValue
          ? "database"
          : "env",
      updatedAt: doc?.updatedAt || null,
    };
  });
}

async function saveAdminConfigs(items, updatedBy) {
  if (!Array.isArray(items) || items.length === 0) {
    return listAdminConfigs();
  }

  const envUpdates = {};

  for (const item of items) {
    if (!CONFIG_KEY_SET.has(item.key)) {
      throw new Error(`Unsupported config key: ${item.key}`);
    }

    const normalizedValue =
      item.value == null ? "" : String(item.value).trim();
    const definition = getConfigDefinitionMap()[item.key];
    const enabled = definition?.dbOnly ? true : Boolean(item.enabled);

    await AppConfig.findOneAndUpdate(
      { key: item.key },
      {
        $set: {
          value: normalizedValue,
          enabled,
          updatedBy: updatedBy || null,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    envUpdates[item.key] = normalizedValue;
  }

  await syncEnvFile(envUpdates);
  return listAdminConfigs();
}

module.exports = {
  CONFIG_DEFINITIONS,
  DEFAULT_MAX_UPLOAD_SIZE,
  getAppConfigValue,
  getAppConfigValues,
  getConfigDefinitionMap,
  listAdminConfigs,
  saveAdminConfigs,
};

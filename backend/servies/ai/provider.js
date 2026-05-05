// servies/ai/provider.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getAppConfigValues } = require("../appConfig");

const GEMINI_PROVIDER_NAME = "Gemini 2.5 Flash";
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS_PER_MODEL = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Core Gemini JSON caller ─────────────────────────────────────────────────
async function callGeminiJson(prompt) {
  const {
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_FALLBACK_MODEL,
  } = await getAppConfigValues([
    "GEMINI_API_KEY",
    "GEMINI_MODEL",
    "GEMINI_FALLBACK_MODEL",
  ]);
  const key = GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const modelCandidates = [
    GEMINI_MODEL || "gemini-2.5-flash",
    GEMINI_FALLBACK_MODEL || "",
  ].filter(Boolean);
  const client = new GoogleGenerativeAI(key);

  let lastError;

  for (const model of modelCandidates) {
    const geminiModel = client.getGenerativeModel({ model });

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
      try {
        const result = await geminiModel.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.75,
            responseMimeType: "application/json",
          },
        });
        const text = result?.response?.text?.() || "";

        try {
          return JSON.parse(text);
        } catch {
          const clean = text.replace(/```json|```/g, "").trim();
          return JSON.parse(clean);
        }
      } catch (err) {
        const providerError = normalizeGeminiError(err, model);
        lastError = providerError;

        if (!providerError.body?.retryable) {
          throw providerError;
        }

        if (attempt < MAX_ATTEMPTS_PER_MODEL) {
          await sleep(600 * attempt);
          continue;
        }
      }
    }
  }

  throw lastError;
}

// ════════════════════════════════════════════════════════════════════════════
// TOOL 1 — AI COACH
// Covers: Story Coach, Concept Coach, Mindset, Growth Plan (all blended)
// Output: insight, relatableExamples, lifeLearnings,
//         developmentSuggestions, actionableQuestions
// ════════════════════════════════════════════════════════════════════════════
async function generateCoachInsight(payload) {
  const {
    topic = "",
    background = "",
    goal = "",
    // user profile
    userName,
    userAge,
    userGender,
    userCity,
    userCountry,
    userProfession,
    userGoals,
    userChallenges,
    userInterests,
    preferredLanguage = "English",
    // book context
    bookTitle,
    bookContent = "",
  } = payload;

  const langNote =
    preferredLanguage === "Hindi"
      ? "Respond in natural Hinglish (Hindi + English mix). Use Devanagari script for Hindi words."
      : "Respond in clear, conversational English.";

  const userCtx = [
    userName && `Name: ${userName}`,
    userAge && `Age: ${userAge}`,
    userGender && `Gender: ${userGender}`,
    userCity && `City: ${userCity}`,
    userCountry && `Country: ${userCountry}`,
    userProfession && `Profession: ${userProfession}`,
    userGoals && `Goals: ${userGoals}`,
    userChallenges && `Challenges: ${userChallenges}`,
    userInterests && `Interests: ${userInterests}`,
  ]
    .filter(Boolean)
    .join("\n");

  const bookCtx = bookContent
    ? `\n\n---\nBOOK: "${bookTitle || "Unknown"}"\nEXCERPT (first 10k chars):\n${bookContent.slice(0, 10000)}\n---`
    : "";

  const prompt = `
You are an elite personal AI coach. Blend story-coaching, mindset work, concept explanation, and growth planning — all in one response. Be direct, warm, and deeply personalised.

LANGUAGE RULE: ${langNote}

USER PROFILE:
${userCtx || "No profile provided — give general but powerful coaching."}

USER REQUEST:
Topic / Theme: ${topic}
Their Situation: ${background}
Their Goal: ${goal}
${bookCtx}

INSTRUCTIONS:
- Analyse the topic from all angles: story, mindset, real-world skill, growth.
- If a user profile is provided, personalise every line. Reference their situation.
- If book content is provided, ground your insight in actual passages from it.
- No generic life-coach clichés. Be specific and real.
- The user just types — AI does all the thinking internally.

Return ONLY valid JSON (no extra text, no markdown fences):
{
  "insight": "Rich, personalised 3-5 sentence coaching insight. Speak directly to the user by name if available.",
  "relatableExamples": [
    "Concrete real-world or story-based example",
    "Second example from everyday life, work, or the book",
    "Third example"
  ],
  "lifeLearnings": [
    "Deep life lesson from this topic",
    "Second life lesson",
    "Third life lesson"
  ],
  "developmentSuggestions": [
    "Specific action the user can take TODAY",
    "Something to do this week",
    "A longer-term habit or practice to build"
  ],
  "actionableQuestions": [
    "A reflective question that shifts perspective",
    "A question to clarify their next move",
    "A challenge question to push them further"
  ],
  "provider": "${GEMINI_PROVIDER_NAME}"
}
`.trim();

  const result = await callGeminiJson(prompt);

  return {
    provider: result.provider || GEMINI_PROVIDER_NAME,
    insight: result.insight || "",
    relatableExamples: toArray(result.relatableExamples),
    lifeLearnings: toArray(result.lifeLearnings),
    developmentSuggestions: toArray(result.developmentSuggestions),
    actionableQuestions: toArray(result.actionableQuestions),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TOOL 2 — AI BOOK LEARNING
// Covers: Book Breakdown, Insight Analyzer, Concept Extraction
// Output: explanation, realLifeExamples, keyLessons, conceptMap
// ════════════════════════════════════════════════════════════════════════════
async function generateBookLearning(payload) {
  const {
    bookTitle = "Unknown Book",
    bookContent = "",
    focusSection = "",
    learningGoal = "",
    preferredLanguage = "English",
    userName,
    userProfession,
  } = payload;

  const langNote =
    preferredLanguage === "Hindi"
      ? "Respond in natural Hinglish (Hindi + English mix)."
      : "Respond in clear, conversational English.";

  const userCtx = [
    userName && `User: ${userName}`,
    userProfession && `Profession: ${userProfession}`,
  ]
    .filter(Boolean)
    .join(", ");

  const content = (focusSection || bookContent).slice(0, 10000);

  const prompt = `
You are an expert book-learning assistant. Break down complex content into simple, sticky, useful learning.

LANGUAGE: ${langNote}
${userCtx ? `PERSONALISE FOR: ${userCtx}` : ""}

BOOK: "${bookTitle}"
CONTENT / SECTION TO ANALYSE:
${content || "No content provided — give a general framework for learning from books."}

LEARNING GOAL: ${learningGoal || "Understand the key ideas clearly and apply them"}

INSTRUCTIONS:
- Explain the core ideas as if to a smart, curious person — not an academic.
- Pull out the most valuable, actionable lessons.
- Connect ideas to real life using vivid, relatable examples.
- Build a simple concept map: 3-5 key concepts and how they relate to each other.

Return ONLY valid JSON:
{
  "explanation": "Clear, simple 3-5 sentence explanation of the main ideas. No jargon.",
  "realLifeExamples": [
    "How this idea appears in everyday life",
    "A second real-world example (work, relationships, or decisions)",
    "A third example"
  ],
  "keyLessons": [
    "The single most important lesson from this content",
    "Second key lesson",
    "Third lesson worth remembering forever"
  ],
  "conceptMap": [
    { "concept": "Core concept name", "meaning": "One-line plain-English meaning", "linkedTo": ["related concept name"] },
    { "concept": "Second concept", "meaning": "One-line meaning", "linkedTo": ["core concept name"] },
    { "concept": "Third concept", "meaning": "One-line meaning", "linkedTo": [] }
  ],
  "provider": "${GEMINI_PROVIDER_NAME}"
}
`.trim();

  const result = await callGeminiJson(prompt);

  return {
    provider: result.provider || GEMINI_PROVIDER_NAME,
    explanation: result.explanation || "",
    realLifeExamples: toArray(result.realLifeExamples),
    keyLessons: toArray(result.keyLessons),
    conceptMap: toConceptMap(result.conceptMap),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TOOL 3 — AI TOOLS (Utility)
// Sub-tools: "restyle" | "test_generator" | "learning_tracker"
// ════════════════════════════════════════════════════════════════════════════
async function generateAITool(payload) {
  const {
    toolType = "restyle",
    inputText = "",
    context = "",
    preferredLanguage = "English",
    userName,
  } = payload;

  const langNote =
    preferredLanguage === "Hindi"
      ? "Respond in natural Hinglish."
      : "Respond in English.";

  let prompt = "";

  // ── Restyle ──────────────────────────────────────────────────────────────
  if (toolType === "restyle") {
    prompt = `
You are a world-class writing expert. Restyle the given text into 5 useful formats.

LANGUAGE: ${langNote}
${userName ? `User: ${userName}` : ""}

ORIGINAL TEXT:
${inputText}

Return ONLY valid JSON:
{
  "formal":       "Professional, formal version of the text",
  "casual":       "Warm, friendly, casual version",
  "concise":      "Extremely short punchy version — 1-2 sentences max",
  "storytelling": "Engaging narrative/story-driven version",
  "social":       "Social media ready version with relevant emoji",
  "provider":     "${GEMINI_PROVIDER_NAME}"
}
`.trim();
  }

  // ── Test Generator ────────────────────────────────────────────────────────
  else if (toolType === "test_generator") {
    prompt = `
You are a quiz and assessment expert. Generate 5 high-quality test questions from the given content.

LANGUAGE: ${langNote}
CONTENT TO TEST:
${inputText}
FOCUS / CONTEXT: ${context || "General understanding and application"}

INSTRUCTIONS:
- Make questions thought-provoking, not trivial.
- Mix conceptual understanding with real-world application.
- Each question must have exactly 4 options.
- Include a clear explanation for the correct answer.

Return ONLY valid JSON:
{
  "title": "Quiz title based on the content",
  "questions": [
    {
      "q":          "Question text",
      "options":    ["Option A", "Option B", "Option C", "Option D"],
      "answer":     "Option A",
      "explanation": "Why this is correct and others are wrong"
    }
  ],
  "provider": "${GEMINI_PROVIDER_NAME}"
}
`.trim();
  }

  // ── Learning Tracker ──────────────────────────────────────────────────────
  else if (toolType === "learning_tracker") {
    prompt = `
You are a personal learning strategist. Create a practical 4-week learning plan.

LANGUAGE: ${langNote}
${userName ? `User: ${userName}` : ""}
TOPIC / SKILL TO LEARN: ${inputText}
CURRENT LEVEL: ${context || "Beginner"}

INSTRUCTIONS:
- Make the plan realistic and achievable — not overwhelming.
- Each week should have 3 concrete tasks.
- Milestones should be measurable.

Return ONLY valid JSON:
{
  "summary": "2-3 sentence overview of this learning journey and what the user will achieve",
  "weeklyPlan": [
    { "week": 1, "focus": "Week 1 theme/focus", "tasks": ["Task 1", "Task 2", "Task 3"] },
    { "week": 2, "focus": "Week 2 theme/focus", "tasks": ["Task 1", "Task 2", "Task 3"] },
    { "week": 3, "focus": "Week 3 theme/focus", "tasks": ["Task 1", "Task 2", "Task 3"] },
    { "week": 4, "focus": "Week 4 theme/focus", "tasks": ["Task 1", "Task 2", "Task 3"] }
  ],
  "milestones": [
    "What success looks like after week 1",
    "What success looks like after week 2",
    "What mastery looks like at week 4"
  ],
  "resources": [
    "Suggested practice method or resource 1",
    "Suggested practice method or resource 2"
  ],
  "provider": "${GEMINI_PROVIDER_NAME}"
}
`.trim();
  } else {
    throw new Error(
      `Unknown toolType: "${toolType}". Use: restyle | test_generator | learning_tracker`,
    );
  }

  const result = await callGeminiJson(prompt);
  return { ...result, provider: result.provider || GEMINI_PROVIDER_NAME };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseProviderError(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") return [val];
  return [];
}

function normalizeGeminiError(err, modelName = "") {
  const statusCode =
    err?.status ||
    err?.statusCode ||
    err?.response?.status ||
    err?.cause?.status ||
    500;
  const retryable = RETRYABLE_STATUS_CODES.has(statusCode);
  const providerMessage =
    err?.message ||
    err?.error?.message ||
    "Gemini request failed";

  const normalized = new Error(providerMessage);
  normalized.status = retryable ? 503 : statusCode;
  normalized.body = {
    error: "ai_provider_unavailable",
    message: retryable
      ? "The AI service is busy right now. Please try again in a few moments."
      : providerMessage,
    provider: GEMINI_PROVIDER_NAME,
    providerStatus: modelName
      ? `${String(statusCode)} (${modelName})`
      : String(statusCode),
    retryable,
  };
  return normalized;
}

function toConceptMap(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [];
}

module.exports = {
  generateCoachInsight,
  generateBookLearning,
  generateAITool,
};

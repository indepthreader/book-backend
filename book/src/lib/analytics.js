import { API_URL } from "./api";

const VISITOR_KEY = "zproject_visitor_key";

function getVisitorKey() {
  let key = localStorage.getItem(VISITOR_KEY);
  if (key) return key;

  key =
    globalThis.crypto?.randomUUID?.() ||
    `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(VISITOR_KEY, key);
  return key;
}

export async function trackVisit(page) {
  try {
    const token = localStorage.getItem("zproject_token");
    await fetch(`${API_URL}/api/analytics/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        page,
        visitorKey: getVisitorKey(),
      }),
    });
  } catch {
    // Best-effort analytics only.
  }
}

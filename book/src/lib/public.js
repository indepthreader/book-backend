import { API_URL } from "./api";

export async function fetchPublicSettings() {
  const response = await fetch(`${API_URL}/api/public/settings`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load public settings");
  }

  return data.settings || {};
}

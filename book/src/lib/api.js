export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const TOKEN_KEY = "zproject_token";
export const LIBRARY_KEY = "indepth_reader_books";

export async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error(data.message || "Session expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

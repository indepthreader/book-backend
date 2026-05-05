import { API_URL, LIBRARY_KEY } from "../lib/api";

export function makeCover(title) {
  const colors = [
    "#7f1d1d",
    "#0f766e",
    "#1d4ed8",
    "#9333ea",
    "#c2410c",
    "#047857",
  ];
  const index = Math.abs(
    String(title || "")
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0),
  );
  return colors[index % colors.length];
}

export function readSavedBooks() {
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBooks(books) {
  const cleanBooks = books.map((book) => {
    const copy = { ...book };
    delete copy.objectUrl;
    return copy;
  });

  localStorage.setItem(LIBRARY_KEY, JSON.stringify(cleanBooks));
}

export function formatBytes(size) {
  if (!size) return "0 KB";
  return `${(size / 1024).toFixed(2)} KB`;
}

export function mapUploadToBook(upload, fallback = {}) {
  const title =
    upload.title ||
    fallback.title ||
    upload.originalName?.replace(/\.[^.]+$/, "") ||
    "Untitled Book";

  const coverImage =
    upload.coverImageUrl && !upload.coverImageUrl.startsWith("http")
      ? `${API_URL}${upload.coverImageUrl}`
      : upload.coverImageUrl || fallback.coverImage || "";

  return {
    id: upload._id,
    user: upload.user,
    uploadId: upload._id,
    title,
    author: upload.author || fallback.author || "Unknown Author",
    // type: upload.mimeType?.includes("pdf") ? "pdf" : "text",
    type: upload.type,
    size: upload.size,
    color: fallback.color || makeCover(title),
    coverImage,
    content: upload.textContent || "",
    textExtractStatus: upload.textExtractStatus || "pending",
    createdAt: upload.createdAt,
  };
}

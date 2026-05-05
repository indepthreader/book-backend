import { useState, useEffect, useRef, useCallback } from "react";
// import BookCover from "../components/BookCover";
// import { bookData, makeCover } from "./BookCover";
import BookCover from "./BookCover";
import { useAuth } from "../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; }

.lib-wrap {
  padding: 28px 32px 48px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--app-bg) 0%, var(--app-surface-2) 100%);
  font-family: 'Outfit', system-ui, sans-serif;
  color: var(--app-text);
}

.lib-header {
  margin-bottom: 32px;
}

.lib-eyebrow {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--app-accent);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.lib-eyebrow::before {
  content: '';
  width: 5px;
  height: 5px;
  background: var(--app-accent);
  border-radius: 50%;
}

.lib-title {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--app-text);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 8px;
}

.lib-subtitle {
  font-size: 0.95rem;
  color: var(--app-text-soft);
  margin: 0;
  font-weight: 300;
  line-height: 1.6;
}

.lib-stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.lib-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  background: color-mix(in srgb, var(--app-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-accent) 22%, transparent);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 0.82rem;
  color: var(--app-text-soft);
}

.lib-stat strong {
  color: var(--app-accent);
  font-weight: 600;
}

.lib-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  align-items: center;
}

.lib-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.lib-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--app-text-muted);
  display: flex;
  pointer-events: none;
}

.lib-search {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: color-mix(in srgb, var(--app-surface) 88%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--app-text);
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lib-search::placeholder { color: var(--app-text-muted); }
.lib-search:focus {
  border-color: var(--app-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-accent) 10%, transparent);
}

.lib-sort {
  padding: 10px 14px;
  background: color-mix(in srgb, var(--app-surface) 88%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--app-text-soft);
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 28px;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2355535e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.3s ease;
}

.lib-sort:focus {
  border-color: var(--app-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-accent) 10%, transparent);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  min-width: 0;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.book-card {
  background: color-mix(in srgb, var(--app-surface) 78%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-width: 0;
  width: 100%;
  backdrop-filter: blur(10px);
}

.book-card:hover {
  border-color: color-mix(in srgb, var(--app-accent) 40%, transparent);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--app-accent) 15%, transparent);
}

.book-cover-wrap {
  position: relative;
  width: 100%;
  padding-top: 140%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--app-text) 6%, transparent) 0%, color-mix(in srgb, var(--app-text) 12%, transparent) 100%);
  overflow: hidden;
  flex-shrink: 0;
}

.book-cover-wrap > * {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.book-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  border: none;
  padding: 16px;
  overflow: hidden;
  gap: 8px;
}

.book-cover.has-image { cursor: zoom-in; padding: 0; }

.book-cover:not(.has-image) {
  text-align: center;
}

.book-cover-initial {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  flex-shrink: 0;
}

.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-cover-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  max-width: 100%;
  word-break: break-word;
}

.cover-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.cover-modal-card {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  background: var(--app-surface);
}

.cover-modal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.cover-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
}

.cover-close:hover {
  background: rgba(0, 0, 0, 0.9);
}

.book-cover-title {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.35;
}

.book-cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  opacity: 1;
  transition: opacity 0.4s ease;
}

.book-cover-image.loading {
  opacity: 0;
}

.book-cover-image.loaded {
  opacity: 1;
}

.book-fmt-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1.5px solid;
  line-height: 1;
}

.book-fmt-badge.pdf {
  background: rgba(230, 57, 70, 0.2);
  color: #ff6b6b;
  border-color: rgba(230, 57, 70, 0.5);
}

.book-fmt-badge.docx {
  background: rgba(55, 138, 221, 0.2);
  color: #71b3f5;
  border-color: rgba(55, 138, 221, 0.5);
}

.book-fmt-badge.txt {
  background: rgba(82, 183, 136, 0.2);
  color: #52b788;
  border-color: rgba(82, 183, 136, 0.5);
}

.book-fmt-badge.epub {
  background: rgba(127, 119, 221, 0.2);
  color: #a89be0;
  border-color: rgba(127, 119, 221, 0.5);
}

.book-size-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  font-size: 0.65rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.7);
  color: #c8c5d0;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.book-body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.book-body-title {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #f2f0eb;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  word-break: break-word;
}

.book-body-author {
  font-size: 0.75rem;
  color: var(--app-text-soft);
  margin: 2px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.book-body-author svg { flex-shrink: 0; }
.book-body-author span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-body-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.book-meta-pill {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  color: var(--app-text-muted);
  background: color-mix(in srgb, var(--app-text) 4%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 5px;
  padding: 3px 7px;
  white-space: nowrap;
  flex-shrink: 0;
}

.book-meta-pill svg { color: var(--app-text-muted); flex-shrink: 0; }

.book-read-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
  padding: 9px 0;
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(230, 57, 70, 0.08));
  border: 1px solid rgba(230, 57, 70, 0.3);
  border-radius: 9px;
  color: #ff8a8a;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.book-read-btn:hover {
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.25), rgba(230, 57, 70, 0.15));
  border-color: rgba(230, 57, 70, 0.5);
  color: #ff6b6b;
  transform: translateY(-1px);
}

.book-read-btn:active { transform: translateY(0); }
.book-read-btn svg { flex-shrink: 0; }

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skel-card {
  background: rgba(19, 19, 21, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
}

.skel-cover {
  width: 100%;
  padding-top: 140%;
  position: relative;
  background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite linear;
}

.skel-body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skel-line {
  height: 10px;
  background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite linear;
  border-radius: 6px;
}

.skel-btn {
  height: 36px;
  border-radius: 9px;
  margin-top: 4px;
  background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite linear;
}

.lib-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.lib-empty-icon {
  width: 72px;
  height: 72px;
  background: rgba(230, 57, 70, 0.1);
  border: 2px solid rgba(230, 57, 70, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e63946;
  margin-bottom: 24px;
  font-size: 2.5rem;
}

.lib-empty h3 {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #f2f0eb;
  margin: 0 0 10px;
}

.lib-empty p {
  font-size: 0.9rem;
  color: #7a7885;
  max-width: 320px;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
}

.analyzer-section {
  background: rgba(230, 57, 70, 0.08);
  border: 1px solid rgba(230, 57, 70, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  backdrop-filter: blur(10px);
}

.analyzer-title {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f2f0eb;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.analyzer-badge {
  display: inline-block;
  background: linear-gradient(135deg, #e63946, #ff6b6b);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.1em;
}
.lib-toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap; /* 🔥 mobile pe break allowed */
}

/* ensure both same size feel */
.lib-toolbar-right .lib-sort {
  min-width: 160px;
}
.analyzer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.analyzer-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.analyzer-card:hover {
  border-color: rgba(230, 57, 70, 0.3);
  background: rgba(230, 57, 70, 0.05);
}

.analyzer-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #7a7885;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.analyzer-card-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ff6b6b;
  font-family: 'Syne', system-ui, sans-serif;
}

.analyzer-insight {
  background: rgba(19, 19, 21, 0.4);
  border-left: 3px solid #e63946;
  border-radius: 8px;
  padding: 14px;
  margin-top: 16px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #c8c5d0;
}

@media (max-width: 768px) {
  .lib-wrap {
    padding: 16px 16px 40px;
  }

  .lib-title {
    font-size: 1.6rem;
  }

  .lib-subtitle {
    font-size: 0.85rem;
  }

  .lib-toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .lib-search-wrap {
    min-width: 100%;
  }

  .lib-search,
  .lib-sort {
    font-size: 0.85rem;
    padding: 9px 10px;
  }

  .book-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .book-body {
    padding: 10px 10px 12px;
    gap: 3px;
  }

  .book-body-title {
    font-size: 0.8rem;
  }

  .book-body-author {
    font-size: 0.7rem;
  }

  .book-read-btn {
    font-size: 0.75rem;
    padding: 8px 0;
    margin-top: 8px;
  }

  .analyzer-section {
    padding: 16px;
    margin: 24px 0;
  }

  .analyzer-title {
    font-size: 1.1rem;
  }

  .analyzer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .lib-stats {
    gap: 8px;
  }

  .lib-stat {
    font-size: 0.75rem;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .lib-wrap {
    padding: 12px 12px 32px;
  }

  .lib-title {
    font-size: 1.4rem;
  }

  .book-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .book-body {
    padding: 8px 8px 10px;
  }

  .book-body-title {
    font-size: 0.75rem;
  }

  .analyzer-grid {
    grid-template-columns: 1fr;
  }
}
`;

function LazyImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.unobserve(ref.current);
        }
      },
      { rootMargin: "50px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? "loading" : "loaded"}`}
      onLoad={() => setIsLoading(false)}
      style={{ visibility: imageSrc ? "visible" : "hidden" }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-cover" />
      <div className="skel-body">
        <div className="skel-line" style={{ width: "85%" }} />
        <div className="skel-line" style={{ width: "60%" }} />
        <div className="skel-btn" />
      </div>
    </div>
  );
}

function BookCard({ book, onRead }) {
  const fmt = (book.fileName || book.title || "").toLowerCase().endsWith(".pdf")
    ? "pdf"
    : (book.fileName || book.title || "").toLowerCase().endsWith(".docx") ||
        (book.fileName || book.title || "").toLowerCase().endsWith(".doc")
      ? "docx"
      : (book.fileName || book.title || "").toLowerCase().endsWith(".txt")
        ? "txt"
        : (book.fileName || book.title || "").toLowerCase().endsWith(".epub")
          ? "epub"
          : "default";

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const date = book.uploadedAt || book.createdAt;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="book-card" onClick={() => onRead(book)}>
      <div className="book-cover-wrap">
        <BookCover book={book} large={false} />
        <span
          className={`book-fmt-badge ${book.format ? book.format.toLowerCase() : fmt}`}
        >
          {book.format || (fmt === "default" ? "FILE" : fmt.toUpperCase())}
        </span>
        {(book.size > 0 || book.pages > 0) && (
          <span className="book-size-badge">
            {book.size > 0 ? formatBytes(book.size) : `${book.pages}pg`}
          </span>
        )}
      </div>

      <div className="book-body">
        <h3 className="book-body-title">{book.title || "Untitled"}</h3>

        <p className="book-body-author">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 1 0-16 0" />
          </svg>
          <span>{book.author || "Unknown"}</span>
        </p>
        <div className="book-body-meta">
          {book.type && (
            <span className={`book-meta-pill ${book.type}`}>
              {book.type === "public" ? "🌍 Public" : "🔒 Private"}
            </span>
          )}

          {book.pages > 0 && (
            <span className="book-meta-pill">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {book.pages}pg
            </span>
          )}

          {formattedDate && (
            <span className="book-meta-pill">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formattedDate}
            </span>
          )}
        </div>
        <button
          type="button"
          className="book-read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRead(book);
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Read Now
        </button>
      </div>
    </article>
  );
}

function Analyzer({ books }) {
  const stats = {
    total: books.length,
    totalPages: books.reduce((acc, b) => acc + (b.pages || 0), 0),
    authors: new Set(books.map((b) => b.author).filter(Boolean)).size,
    avgPages: books.length
      ? Math.round(
          books.reduce((acc, b) => acc + (b.pages || 0), 0) / books.length,
        )
      : 0,
  };

  const insights = [
    "Your collection shows diverse reading interests across multiple genres and authors.",
    "Consider dedicating 30 mins daily to maintain reading momentum and deepen knowledge retention.",
    "Mix fiction and non-fiction for balanced cognitive development and creative inspiration.",
  ];

  return <></>;
}

export default function Library({ books = bookData, onRead = () => {} }) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("all"); // all | mine

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);
  const { user } = useAuth();
  const userId = user?.id;
  const filtered = (books || [])
    .filter((b) => {
      const q = query.toLowerCase();

      const matchSearch =
        !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q);

      const matchOwner = view === "all" ? true : b.user === userId;

      return matchSearch && matchOwner;
    })
    .sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      if (sort === "size") return (b.size || 0) - (a.size || 0);

      return (
        new Date(b.uploadedAt || b.createdAt) -
        new Date(a.uploadedAt || a.createdAt)
      );
    });
  // const filtered = (books && books.length > 0 ? books : bookData)
  //   .filter((b) => {
  //     if (!query) return true;
  //     const q = query.toLowerCase();
  //     return (
  //       (b.title || "").toLowerCase().includes(q) ||
  //       (b.author || "").toLowerCase().includes(q)
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (sort === "title") return (a.title || "").localeCompare(b.title || "");
  //     if (sort === "size") return (b.size || 0) - (a.size || 0);
  //     return (
  //       new Date(b.uploadedAt || b.createdAt || 0) -
  //       new Date(a.uploadedAt || a.createdAt || 0)
  //     );
  //   });

  return (
    <>
      <style>{CSS}</style>
      <div className="lib-wrap">
        <div className="lib-header">
          <div className="lib-eyebrow">Library</div>
          <h1 className="lib-title">Your Collection</h1>
          <p className="lib-subtitle">
            All your uploaded books and documents in one beautiful place
          </p>
          {books.length > 0 && (
            <div className="lib-stats">
              <div className="lib-stat">
                <span>📚</span>
                <strong>{books.length}</strong>{" "}
                {books.length === 1 ? "book" : "books"}
              </div>
              <div className="lib-stat">
                <span>👤</span>
                <strong>{new Set(books.map((b) => b.author)).size}</strong>{" "}
                authors
              </div>
            </div>
          )}
        </div>

        {books.length > 0 && (
          <div className="lib-toolbar">
            <div className="lib-search-wrap">
              <div className="lib-search-icon">🔍</div>
              <input
                type="text"
                className="lib-search"
                placeholder="Search by title or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="lib-toolbar-right">
              <select
                className="lib-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="size">Size (Large)</option>
              </select>

              <button
                className="lib-sort"
                onClick={() => setView(view === "all" ? "mine" : "all")}
              >
                {view === "all" ? "📁 My Books" : "🌍 All Books"}
              </button>
            </div>
          </div>
        )}

        {books.length > 0 && <Analyzer books={books} />}

        <div className="book-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((book) => (
              <BookCard
                key={book.id || book.title}
                book={book}
                onRead={onRead}
              />
            ))
          ) : books.length === 0 ? (
            <div className="lib-empty">
              <div className="lib-empty-icon">📚</div>
              <h3>No books yet</h3>
              <p>
                Upload your first book to get started with reading and analyzing
              </p>
            </div>
          ) : (
            <div className="lib-empty">
              <div className="lib-empty-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

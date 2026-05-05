import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { formatBytes } from "../utils/books";
import BookCover from "./BookCover";
import Reader from "./Reader";

const CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .home-container {
    width: 100%;
    min-height: 100vh;
    background: var(--app-bg);
    color: var(--app-text);
  }

  .hero-panel {
    padding: 48px 32px;
    background: linear-gradient(135deg, var(--app-bg) 0%, var(--app-surface-2) 100%);
    border-bottom: 1px solid color-mix(in srgb, var(--app-accent) 20%, transparent);
  }

  .hero-panel h1 {
    font-size: 3rem;
    font-weight: 800;
    margin: 16px 0;
    line-height: 1.1;
  }

  .hero-panel p {
    font-size: 1.1rem;
    color: var(--app-text-soft);
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .eyebrow {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--app-accent);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .primary-button,
  .secondary-button {
    padding: 12px 32px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .primary-button {
    background: var(--app-accent);
    color: #fff;
  }

  .primary-button:hover {
    background: color-mix(in srgb, var(--app-accent) 75%, white);
    transform: translateY(-2px);
  }

  .secondary-button {
    background: color-mix(in srgb, var(--app-accent) 10%, transparent);
    color: var(--app-accent);
    border: 1px solid var(--app-accent);
  }

  .secondary-button:hover {
    background: color-mix(in srgb, var(--app-accent) 16%, transparent);
    transform: translateY(-2px);
  }

  .panel {
    padding: 40px 32px;
  }

  .panel-header {
    margin-bottom: 32px;
  }

  .panel-header h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 8px;
  }
  @media (max-width: 1024px) {
    .hero-panel {
      padding: 40px 24px;
    }

    .hero-panel h1 {
      font-size: 2.2rem;
    }

    .panel {
      padding: 32px 24px;
    }

    .book-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .hero-panel {
      padding: 32px 16px;
    }

    .hero-panel h1 {
      font-size: 1.8rem;
    }

    .hero-panel p {
      font-size: 1rem;
    }

    .hero-actions {
      flex-direction: column;
    }

    .primary-button,
    .secondary-button {
      width: 100%;
    }

    .panel {
      padding: 24px 16px;
    }

    .panel-header h2 {
      font-size: 1.5rem;
    }

    .book-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .book-card {
      padding: 12px;
    }

    .book-cover-wrap {
      height: 200px;
    }

    .book-card h3 {
      font-size: 0.9rem;
    }

    .book-card p {
      font-size: 0.8rem;
    }

    .book-card small {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .hero-panel {
      padding: 24px 12px;
    }

    .hero-panel h1 {
      font-size: 1.4rem;
    }

    .hero-panel p {
      font-size: 0.95rem;
    }

    .panel {
      padding: 16px 12px;
    }

    .panel-header h2 {
      font-size: 1.2rem;
    }

    .book-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .book-cover-wrap {
      height: 180px;
    }

    .primary-button,
    .secondary-button {
      font-size: 0.9rem;
      padding: 10px 20px;
    }
  }
`;

export default function Home({ user, openUpload, openLibrary }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);

      const data = await api("/api/uploads/my");

      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const formatted = (data.files || []).map((file) => ({
        id: file._id,
        title: file.originalName,
        author: "You",
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
        coverImage: file.coverImageUrl
          ? `${BASE_URL}${file.coverImageUrl}`
          : file.coverImage || "",
      }));

      setBooks(formatted);
    } catch (err) {
      setError(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  if (selectedBook) {
    return (
      <>
        <style>{CSS}</style>
        <div className="home-container">
          <button className="back-button" onClick={() => setSelectedBook(null)}>
            ← Back to Library
          </button>
          <Reader book={selectedBook} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="home-container">
        <section className="hero-panel">
          <p className="eyebrow">Workspace</p>
          <h1>Beautiful InDepth Reader</h1>

          <p>
            {user?.role === "admin"
              ? "You have full admin control over users, roles, subscriptions, and uploaded files."
              : "Your account includes trial, AI coaching, and private library experience."}
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={openUpload}>
              Upload book
            </button>
            <button className="secondary-button" onClick={openLibrary}>
              Open library
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

import { useState } from "react";
import BookCover from "./BookCover";

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिंदी" },
  { value: "Hinglish", label: "Mix" },
];

const TOOL_CATEGORIES = [
  {
    id: "story",
    label: "Story Coach",
    emoji: "📖",
    color: "#ff6b57",
    desc: "Narrative and key idea guidance",
  },
  {
    id: "mindset",
    label: "Mindset",
    emoji: "🧠",
    color: "#9b5cff",
    desc: "Beliefs, habits, and thinking shifts",
  },
  {
    id: "skills",
    label: "Skills",
    emoji: "⚡",
    color: "#3b82f6",
    desc: "Practical learning from the book",
  },
  {
    id: "life",
    label: "Life Lessons",
    emoji: "🌱",
    color: "#22c55e",
    desc: "Actionable wisdom for daily life",
  },
  {
    id: "career",
    label: "Career",
    emoji: "💼",
    color: "#f59e0b",
    desc: "Work, leadership, and growth",
  },
  {
    id: "finance",
    label: "Finance",
    emoji: "💰",
    color: "#14b8a6",
    desc: "Money and decision-making insights",
  },
  {
    id: "health",
    label: "Health",
    emoji: "🏃",
    color: "#ef4444",
    desc: "Energy, wellness, and discipline",
  },
  {
    id: "relation",
    label: "Relationships",
    emoji: "❤️",
    color: "#ec4899",
    desc: "Communication and human connection",
  },
  {
    id: "creative",
    label: "Creativity",
    emoji: "🎨",
    color: "#f97316",
    desc: "Ideas, expression, and innovation",
  },
  {
    id: "focus",
    label: "Deep Focus",
    emoji: "🎯",
    color: "#6366f1",
    desc: "Attention, clarity, and momentum",
  },
];

const TOOL_ID_TO_NAME = {
  story: "Story Coach",
  mindset: "Mindset",
  skills: "Skills",
  life: "Life Lessons",
  career: "Career",
  finance: "Finance",
  health: "Health",
  relation: "Relationships",
  creative: "Creativity",
  focus: "Deep Focus",
};

const CSS = `
.reader-page {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 36px;
  color: var(--app-text);
  font-family: "Outfit", system-ui, sans-serif;
}
.reader-shell {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--app-accent) 18%, transparent), transparent 32%),
    linear-gradient(180deg, var(--app-surface) 0%, var(--app-surface-2) 100%);
  border: 1px solid var(--app-border);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.34);
}
.reader-empty {
  padding: 72px 24px;
  text-align: center;
}
.reader-empty h2 {
  margin: 0 0 8px;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
}
.reader-empty p {
  margin: 0;
  color: var(--app-text-muted);
}
.reader-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--app-border-soft);
  background: color-mix(in srgb, var(--app-text) 2%, transparent);
  flex-wrap: wrap;
}
.reader-topbar-copy {
  min-width: 0;
}
.reader-topbar-copy strong {
  display: block;
  font-size: 0.95rem;
}
.reader-topbar-copy span {
  display: block;
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: 0.82rem;
}
.reader-langbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.reader-langbar-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}
.reader-lang-btn {
  border: 1px solid var(--app-border);
  background: color-mix(in srgb, var(--app-text) 3%, transparent);
  color: var(--app-text-soft);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}
.reader-lang-btn:hover {
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
}
.reader-lang-btn.active {
  background: var(--app-text);
  color: #101013;
  border-color: var(--app-text);
}
.reader-hero {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 28px;
  padding: 28px;
  align-items: center;
  border-bottom: 1px solid var(--app-border-soft);
}
.reader-cover-frame {
  width: min(100%, 280px);
  margin: 0 auto;
  padding: 12px;
  border-radius: 26px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--app-text) 12%, transparent), color-mix(in srgb, var(--app-text) 4%, transparent));
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}
.reader-cover-frame .book-cover {
  width: 100%;
  min-height: 360px;
  border: 0;
  border-radius: 20px;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  color: #fff;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 -60px 80px rgba(0, 0, 0, 0.22);
}
.reader-cover-frame .book-cover.has-image {
  padding: 0;
  cursor: zoom-in;
  box-shadow: none;
}
.reader-cover-frame .book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.reader-cover-frame .book-cover span {
  font-size: 3.4rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 18px;
}
.reader-cover-frame .book-cover strong {
  font-size: 1.05rem;
  line-height: 1.3;
  text-align: left;
}
.reader-meta {
  min-width: 0;
}
.reader-kicker {
  margin: 0 0 10px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--app-accent);
}
.reader-meta h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.02;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.reader-author {
  margin: 12px 0 0;
  color: var(--app-text-soft);
  font-size: 1rem;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.reader-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.reader-stat {
  padding: 10px 14px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border: 1px solid var(--app-border);
  font-size: 0.84rem;
  color: rgba(245, 241, 234, 0.78);
}
.reader-preview {
  padding: 26px 28px 32px;
  border-bottom: 1px solid var(--app-border-soft);
}
.reader-preview-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.reader-preview-head h2 {
  margin: 0;
  font-size: 1.2rem;
}
.reader-preview-head p {
  margin: 6px 0 0;
  color: var(--app-text-muted);
  font-size: 0.88rem;
}
.reader-preview-card {
  border-radius: 20px;
  background: color-mix(in srgb, var(--app-text) 3%, transparent);
  border: 1px solid var(--app-border);
  overflow: hidden;
}
.reader-preview-card object {
  width: 100%;
  height: 600px;
  display: block;
  background: var(--app-surface-2);
}
.reader-preview-text {
  margin: 0;
  padding: 22px;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--app-text-soft);
  white-space: pre-wrap;
}
.reader-tools {
  padding: 26px 28px 30px;
}
.reader-tools h2 {
  margin: 0;
  font-size: 1.2rem;
}
.reader-tools p {
  margin: 6px 0 18px;
  color: var(--app-text-muted);
  font-size: 0.88rem;
}
.reader-tool-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}
.reader-tool-card {
  position: relative;
  min-height: 124px;
  border-radius: 18px;
  border: 1px solid var(--app-border);
  background: color-mix(in srgb, var(--app-text) 4%, transparent);
  color: #fff;
  padding: 16px 14px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.reader-tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
}
.reader-tool-card.active {
  border-width: 1.5px;
}
.reader-tool-glow {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  pointer-events: none;
}
.reader-tool-icon {
  font-size: 1.2rem;
  display: inline-block;
  margin-bottom: 12px;
}
.reader-tool-name {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
}
.reader-tool-desc {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--app-text-muted);
}
.cover-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 120;
}
.cover-modal-card {
  width: min(92vw, 520px);
}
.cover-close {
  margin-left: auto;
  margin-bottom: 12px;
  display: block;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #111;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}
.cover-modal-image {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 20px;
  display: block;
}
@media (max-width: 1100px) {
  .reader-tool-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 860px) {
  .reader-page {
    padding: 76px 14px 24px;
  }
  .reader-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .reader-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .reader-stats {
    justify-content: center;
  }
  .reader-tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .reader-preview-card object {
    height: 420px;
  }
}
@media (max-width: 520px) {
  .reader-page {
    padding: 72px 10px 18px;
  }
  .reader-shell {
    border-radius: 22px;
  }
  .reader-topbar,
  .reader-hero,
  .reader-preview,
  .reader-tools {
    padding-left: 16px;
    padding-right: 16px;
  }
  .reader-cover-frame {
    width: min(100%, 240px);
    padding: 10px;
  }
  .reader-cover-frame .book-cover {
    min-height: 300px;
  }
  .reader-preview-card object {
    height: 300px;
  }
  .reader-preview-text {
    padding: 16px;
    font-size: 0.93rem;
    line-height: 1.75;
  }
  .reader-tool-grid {
    gap: 10px;
  }
  .reader-tool-card {
    min-height: 112px;
    padding: 14px 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .reader-tool-card {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .reader-tool-card:hover {
    transform: none;
  }
}
`;

function getPreviewText(book) {
  const text = book?.content?.trim();
  if (!text) {
    return "No extracted text available yet for this file.";
  }
  return text.length > 1600 ? `${text.slice(0, 1600)}...` : text;
}

function getFileTypeLabel(book) {
  if (!book?.type) return "Book";
  if (book.type === "pdf") return "PDF preview";
  if (book.type === "docx") return "DOCX upload";
  if (book.type === "doc") return "DOC upload";
  if (book.type === "txt") return "Text upload";
  return String(book.type).toUpperCase();
}

export default function Reader({ book, onTool, onLanguageChange }) {
  const [activeLang, setActiveLang] = useState("English");
  const [activeToolId, setActiveToolId] = useState("story");

  function handleLanguageSelect(lang) {
    setActiveLang(lang);
    onLanguageChange?.(lang);
  }

  function handleToolClick(tool) {
    setActiveToolId(tool.id);
    onTool?.(TOOL_ID_TO_NAME[tool.id] || tool.label, activeLang);
  }

  if (!book) {
    return (
      <>
        <style>{CSS}</style>
        <div className="reader-page">
          <section className="reader-shell reader-empty">
            <h2>Select a book from your library</h2>
            <p>Open any uploaded book to start reading and launch AI coaching.</p>
          </section>
        </div>
      </>
    );
  }

  const previewText = getPreviewText(book);

  return (
    <>
      <style>{CSS}</style>
      <div className="reader-page">
        <section className="reader-shell">
          <div className="reader-topbar">
            <div className="reader-topbar-copy">
              <strong>Ready to explore this book with AI</strong>
              <span>Choose a response language, read the preview, then open a coach tool.</span>
            </div>
            <div className="reader-langbar">
              <span className="reader-langbar-label">AI language</span>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  className={`reader-lang-btn${activeLang === lang.value ? " active" : ""}`}
                  onClick={() => handleLanguageSelect(lang.value)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="reader-hero">
            <div className="reader-cover-frame">
              <BookCover book={book} large />
            </div>

            <div className="reader-meta">
              <p className="reader-kicker">Now reading</p>
              <h1>{book.title}</h1>
              <p className="reader-author">{book.author || "Unknown author"}</p>

              <div className="reader-stats">
                <span className="reader-stat">{getFileTypeLabel(book)}</span>
                <span className="reader-stat">
                  {book.textExtractStatus === "done"
                    ? "Text ready"
                    : book.textExtractStatus || "Processing"}
                </span>
                <span className="reader-stat">{activeLang} responses</span>
              </div>
            </div>
          </div>

          <div className="reader-preview">
            <div className="reader-preview-head">
              <div>
                <h2>Book preview</h2>
                <p>Cover image stays visible and the content area adapts cleanly on mobile.</p>
              </div>
            </div>

            <div className="reader-preview-card">
              {book.type === "pdf" && book.objectUrl ? (
                <object
                  data={book.objectUrl}
                  type="application/pdf"
                  title={book.title}
                >
                  <p className="reader-preview-text">
                    PDF preview is not available in this browser.
                  </p>
                </object>
              ) : (
                <p className="reader-preview-text">{previewText}</p>
              )}
            </div>
          </div>

          <div className="reader-tools">
            <h2>Pick a coach</h2>
            <p>Tap any tool to continue with this book in the coach workspace.</p>

            <div className="reader-tool-grid">
              {TOOL_CATEGORIES.map((tool) => {
                const isActive = tool.id === activeToolId;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    className={`reader-tool-card${isActive ? " active" : ""}`}
                    style={{
                      borderColor: isActive ? tool.color : undefined,
                      boxShadow: isActive
                        ? `0 0 0 1px ${tool.color}44, inset 0 0 36px ${tool.color}16`
                        : undefined,
                    }}
                    onClick={() => handleToolClick(tool)}
                  >
                    <span
                      className="reader-tool-glow"
                      style={{
                        background: `radial-gradient(circle at top left, ${tool.color} 0%, transparent 65%)`,
                      }}
                    />
                    <span className="reader-tool-icon">{tool.emoji}</span>
                    <span className="reader-tool-name">{tool.label}</span>
                    <span className="reader-tool-desc">{tool.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

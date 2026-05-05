import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const MOODS = [
  { id: "inspired", label: "Inspired" },
  { id: "proud", label: "Proud" },
  { id: "curious", label: "Curious" },
  { id: "grateful", label: "Grateful" },
  { id: "focused", label: "Focused" },
];

export default function CommunityComposer() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    bookTitle: "",
    experience: "",
    takeaway: "",
    mood: "inspired",
  });

  const patchForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const titleText = form.title.trim();
  const experienceText = form.experience.trim();
  const takeawayText = form.takeaway.trim();
  const titleLiveError =
    form.title && titleText.length < 4
      ? "Title must be at least 4 characters."
      : "";
  const experienceLiveError =
    form.experience && experienceText.length < 30
      ? "Write at least 30 characters."
      : "";
  const takeawayLiveError =
    form.takeaway && takeawayText.length > 0 && takeawayText.length < 6
      ? "Takeaway must be at least 6 characters."
      : "";

  const validateForm = () => {
    const title = form.title.trim();
    const bookTitle = form.bookTitle.trim();
    const experience = form.experience.trim();
    const takeaway = form.takeaway.trim();

    if (title.length < 4) return "Post title must be at least 4 characters.";
    if (title.length > 40) return "Post title must be under 40 characters.";
    if (bookTitle && bookTitle.length < 2) {
      return "Book name must be at least 2 characters.";
    }
    if (experience.length < 30) {
      return "Experience should be at least 30 characters so readers get useful context.";
    }
    if (takeaway && takeaway.length < 6) {
      return "Short takeaway must be at least 6 characters.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }
    setSubmitting(true);

    try {
      await api("/api/community", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          bookTitle: form.bookTitle.trim(),
          experience: form.experience.trim(),
          takeaway: form.takeaway.trim(),
        }),
      });
      navigate("/community");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .post-shell {
          min-height: 100%;
          padding: 22px;
          background:
            radial-gradient(circle at top left, color-mix(in srgb, var(--app-accent) 18%, transparent), transparent 34%),
            linear-gradient(180deg, var(--app-bg) 0%, var(--app-surface-2) 100%);
          color: var(--app-text);
        }
        .post-wrap {
          max-width: 760px;
          margin: 0 auto;
          display: grid;
          gap: 18px;
        }
        .post-card {
          border-radius: 28px;
          padding: 24px;
          background: var(--app-surface);
          border: 1px solid var(--app-border);
          box-shadow: 0 22px 60px rgba(0,0,0,0.25);
        }
        .post-kicker {
          margin: 0 0 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--app-accent);
        }
        .post-title {
          margin: 0 0 10px;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          line-height: 1;
        }
        .post-copy {
          margin: 0;
          color: var(--app-text-soft);
          line-height: 1.7;
        }
        .post-form {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }
        .post-row {
          display: grid;
          grid-template-columns: 1fr 170px;
          gap: 12px;
        }
        .post-input,
        .post-textarea,
        .post-select {
          width: 100%;
          border-radius: 18px;
          border: 1px solid var(--app-border);
          background: var(--app-surface-2);
          color: var(--app-text);
          padding: 13px 14px;
          outline: none;
          font: inherit;
        }
        .post-textarea {
          min-height: 220px;
          resize: vertical;
        }
        .post-input:focus,
        .post-textarea:focus,
        .post-select:focus {
          border-color: var(--app-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-accent) 12%, transparent);
        }
        .post-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .post-message {
          margin: 0;
          color: var(--app-accent);
        }
        .post-message.live {
          margin-top: -6px;
          font-size: 12px;
          color: var(--app-accent);
        }
        .post-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 12px;
          color: var(--app-text-muted);
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .post-button,
        .post-back {
          border: none;
          border-radius: 16px;
          padding: 12px 16px;
          font-weight: 700;
          cursor: pointer;
        }
        .post-button {
          background: linear-gradient(135deg, #ff7a59, #ff4d5a);
          color: white;
        }
        .post-back {
          background: color-mix(in srgb, var(--app-text) 5%, transparent);
          color: var(--app-text);
        }
        .post-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .post-shell {
            padding: 14px;
          }
          .post-card {
            border-radius: 22px;
            padding: 18px;
          }
          .post-row {
            grid-template-columns: 1fr;
          }
          .post-actions {
            align-items: stretch;
          }
        }
      `}</style>

      <section className="post-shell">
        <br />
        <br />
        <br />
        <div className="post-wrap">
          <section className="post-card">
            <p className="post-kicker">Public Community Post</p>
            <h1 className="post-title">Share your reading experience</h1>
            <p className="post-copy">
              Write something real, specific, and useful. This post will be
              public and visible to everyone in the community feed.
            </p>

            <form className="post-form" onSubmit={handleSubmit}>
              <input
                className="post-input"
                placeholder="Post title"
                value={form.title}
                onChange={(event) =>
                  patchForm("title", event.target.value.slice(0, 40))
                }
                maxLength={40}
                required
              />
              <div className="post-meta">
                <span>Use a clear title</span>
                <span>{form.title.length}/40</span>
              </div>
              {titleLiveError ? (
                <p className="post-message live">{titleLiveError}</p>
              ) : null}

              <div className="post-row">
                <input
                  className="post-input"
                  placeholder="Book name or topic"
                  value={form.bookTitle}
                  onChange={(event) =>
                    patchForm("bookTitle", event.target.value.slice(0, 120))
                  }
                  maxLength={120}
                />

                <select
                  className="post-select"
                  value={form.mood}
                  onChange={(event) => patchForm("mood", event.target.value)}
                >
                  {MOODS.map((mood) => (
                    <option key={mood.id} value={mood.id}>
                      {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                className="post-textarea"
                placeholder="What changed for you? What did you apply? What should others learn from it?"
                value={form.experience}
                onChange={(event) =>
                  patchForm("experience", event.target.value.slice(0, 2500))
                }
                maxLength={2500}
                required
              />
              <div className="post-meta">
                <span>Write at least 30 characters</span>
                <span>{form.experience.length}/2500</span>
              </div>
              {experienceLiveError ? (
                <p className="post-message live">{experienceLiveError}</p>
              ) : null}

              <input
                className="post-input"
                placeholder="Short takeaway"
                value={form.takeaway}
                onChange={(event) =>
                  patchForm("takeaway", event.target.value.slice(0, 300))
                }
                maxLength={300}
              />
              <div className="post-meta">
                <span>Optional one-line takeaway</span>
                <span>{form.takeaway.length}/300</span>
              </div>
              {takeawayLiveError ? (
                <p className="post-message live">{takeawayLiveError}</p>
              ) : null}

              <div className="post-actions">
                <button
                  type="button"
                  className="post-back"
                  onClick={() => navigate("/community")}
                >
                  Back to feed
                </button>
                <button
                  type="submit"
                  className="post-button"
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>

            {message ? <p className="post-message">{message}</p> : null}
          </section>
        </div>
      </section>
    </>
  );
}

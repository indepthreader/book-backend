import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const MOOD_LABELS = {
  inspired: "Inspired",
  proud: "Proud",
  curious: "Curious",
  grateful: "Grateful",
  focused: "Focused",
};

function getInitial(name) {
  const clean = String(name || "").trim();
  return clean ? clean[0].toUpperCase() : "R";
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function Avatar({ name, pic }) {
  if (pic) {
    return <img className="feed-avatar-image" src={pic} alt={name} />;
  }

  return <span className="feed-avatar-fallback">{getInitial(name)}</span>;
}

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [pendingAction, setPendingAction] = useState({});

  const loadPosts = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await api("/api/community");
      setPosts(data.posts || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const replacePost = (nextPost) => {
    setPosts((current) =>
      current.map((post) => (post.id === nextPost.id ? nextPost : post)),
    );
  };

  const reactToPost = async (postId, type) => {
    const actionKey = `${postId}:${type}`;
    try {
      setPendingAction((current) => ({ ...current, [actionKey]: true }));
      const result = await api(`/api/community/${postId}/react`, {
        method: "POST",
        body: JSON.stringify({ type }),
      });
      replacePost(result.post);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPendingAction((current) => ({ ...current, [actionKey]: false }));
    }
  };

  const addComment = async (postId) => {
    const text = String(commentDrafts[postId] || "").trim();
    if (!text) return;

    try {
      setPendingAction((current) => ({ ...current, [postId]: true }));
      const result = await api(`/api/community/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      replacePost(result.post);
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      setExpandedComments((current) => ({ ...current, [postId]: true }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPendingAction((current) => ({ ...current, [postId]: false }));
    }
  };

  return (
    <>
      <style>{`
        .feed-shell {
          min-height: 100%;
          padding: 22px;
          background:
            radial-gradient(circle at top left, color-mix(in srgb, var(--app-accent) 18%, transparent), transparent 28%),
            linear-gradient(180deg, var(--app-bg) 0%, var(--app-surface-2) 100%);
          color: var(--app-text);
        }
        .feed-wrap {
          max-width: 860px;
          margin: 0 auto;
          display: grid;
          gap: 18px;
        }
        .feed-card,
        .feed-composer-bar {
          background: var(--app-surface);
          border: 1px solid var(--app-border);
          border-radius: 26px;
          box-shadow: 0 16px 50px rgba(42, 36, 33, 0.08);
          backdrop-filter: blur(12px);
        }
        .feed-composer-bar {
          padding: 14px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .feed-composer-text {
          margin: 0;
          color: var(--app-text-soft);
        }
        .feed-post-button,
        .feed-action,
        .feed-comment-submit {
          border: none;
          cursor: pointer;
          font: inherit;
        }
        .feed-post-button {
          padding: 12px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 60%, white), var(--app-accent));
          color: white;
          font-weight: 700;
        }
        .feed-message {
          margin: 0;
          color: var(--app-accent);
          font-size: 0.95rem;
        }
        .feed-list {
          display: grid;
          gap: 16px;
        }
        .feed-card {
          padding: 18px;
          display: grid;
          gap: 14px;
        }
        .feed-header {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .feed-avatar {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 60%, white), var(--app-accent));
          color: white;
          font-weight: 800;
        }
        .feed-avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .feed-avatar-fallback {
          font-size: 1rem;
          line-height: 1;
        }
        .feed-author {
          min-width: 0;
        }
        .feed-author-name {
          margin: 0;
          font-size: 1rem;
          color: var(--app-text);
        }
        .feed-author-meta {
          margin: 4px 0 0;
          font-size: 0.84rem;
          color: var(--app-text-muted);
        }
        .feed-mood {
          margin-left: auto;
          flex-shrink: 0;
          padding: 7px 11px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--app-accent) 18%, transparent);
          background: color-mix(in srgb, var(--app-accent) 12%, transparent);
          color: var(--app-accent);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .feed-post-title {
          margin: 0;
          font-size: 1.18rem;
          color: var(--app-text);
        }
        .feed-book {
          display: inline-flex;
          width: fit-content;
          padding: 7px 11px;
          border-radius: 999px;
          background: color-mix(in srgb, #28a56a 10%, transparent);
          color: #28a56a;
          border: 1px solid color-mix(in srgb, #28a56a 18%, transparent);
          font-size: 0.82rem;
          gap: 8px;
          align-items: center;
        }
        .feed-body {
          margin: 0;
          color: var(--app-text-soft);
          line-height: 1.8;
          white-space: pre-wrap;
        }
        .feed-takeaway {
          border-radius: 18px;
          background: color-mix(in srgb, var(--app-text) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--app-accent) 12%, transparent);
          padding: 14px;
        }
        .feed-takeaway-label {
          margin: 0 0 6px;
          color: var(--app-accent);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .feed-divider {
          height: 1px;
          background: var(--app-border-soft);
        }
        .feed-stats {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--app-text-muted);
          font-size: 0.88rem;
        }
        .feed-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .feed-action {
          background: color-mix(in srgb, var(--app-text) 6%, transparent);
          color: var(--app-text-soft);
          padding: 10px 12px;
          border-radius: 14px;
          transition: 0.18s ease;
        }
        .feed-action.active {
          background: color-mix(in srgb, var(--app-accent) 14%, transparent);
          color: var(--app-accent);
        }
        .feed-comments {
          display: grid;
          gap: 12px;
        }
        .feed-comment-box {
          display: grid;
          gap: 10px;
        }
        .feed-comment-input {
          width: 100%;
          border: 1px solid var(--app-border);
          border-radius: 16px;
          background: var(--app-surface-2);
          color: var(--app-text);
          padding: 12px 14px;
          outline: none;
          font: inherit;
        }
        .feed-comment-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .feed-comment-submit {
          padding: 10px 14px;
          border-radius: 12px;
          background: var(--app-text);
          color: white;
        }
        .feed-comment-list {
          display: grid;
          gap: 10px;
        }
        .feed-comment-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .feed-comment-bubble {
          background: color-mix(in srgb, var(--app-text) 5%, transparent);
          border-radius: 16px;
          padding: 10px 12px;
          flex: 1;
        }
        .feed-comment-name {
          margin: 0 0 4px;
          font-size: 0.86rem;
          color: var(--app-text);
        }
        .feed-comment-text,
        .feed-comment-date {
          margin: 0;
          color: var(--app-text-soft);
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .feed-comment-date {
          margin-top: 4px;
          font-size: 0.78rem;
          color: var(--app-text-muted);
        }
        .feed-empty {
          margin: 0;
          color: var(--app-text-muted);
          padding: 20px 4px 6px;
        }
        @media (max-width: 640px) {
          .feed-shell {
            padding: 14px;
          }
          .feed-card,
          .feed-composer-bar {
            border-radius: 20px;
          }
          .feed-header {
            align-items: flex-start;
            flex-wrap: wrap;
          }
          .feed-mood {
            margin-left: 60px;
          }
          .feed-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="feed-shell">
        <br />
        <br />
        <br />
        <div className="feed-wrap">
          {/* <section className="feed-hero">
            <p className="feed-kicker">Community</p>
            <h3 className="feed-title">Stories from real readers</h3>
            <p className="feed-copy">
              See public posts from the community, react to what helps, and open
              comments only when you want to join the conversation.
            </p>
          </section> */}

          <section className="feed-composer-bar">
            <p className="feed-composer-text">
              Want to share your own experience with everyone?
            </p>
            <button
              type="button"
              className="feed-post-button"
              onClick={() => navigate("/post")}
            >
              Create Post
            </button>
          </section>

          {message ? <p className="feed-message">{message}</p> : null}

          <section className="feed-list">
            {loading ? (
              <p className="feed-empty">Loading public posts...</p>
            ) : null}
            {!loading && posts.length === 0 ? (
              <p className="feed-empty">
                No public posts yet. Tap Create Post and share the first one.
              </p>
            ) : null}

            {posts.map((post) => {
              const isExpanded = Boolean(expandedComments[post.id]);
              const draft = commentDrafts[post.id] || "";
              const currentReaction = post.reactions?.currentUserReaction || "";
              return (
                <article className="feed-card" key={post.id}>
                  <header className="feed-header">
                    <div className="feed-avatar">
                      <Avatar
                        name={post.author?.name || "Reader"}
                        pic={post.author?.pic}
                      />
                    </div>

                    <div className="feed-author">
                      <h3 className="feed-author-name">
                        {post.author?.name || "Reader"}
                      </h3>
                      <p className="feed-author-meta">
                        {formatDate(post.createdAt)} · Public
                      </p>
                    </div>

                    <span className="feed-mood">
                      {MOOD_LABELS[post.mood] || "Inspired"}
                    </span>
                  </header>

                  <h4 className="feed-post-title">{post.title}</h4>

                  {post.bookTitle ? (
                    <span className="feed-book">
                      <span>Book</span>
                      <strong>{post.bookTitle}</strong>
                    </span>
                  ) : null}

                  <p className="feed-body">{post.experience}</p>

                  {post.takeaway ? (
                    <div className="feed-takeaway">
                      <p className="feed-takeaway-label">Takeaway</p>
                      <p className="feed-body">{post.takeaway}</p>
                    </div>
                  ) : null}

                  <div className="feed-divider" />

                  <div className="feed-stats">
                    <span>{post.reactions?.likes || 0} likes</span>
                    <span>{post.reactions?.dislikes || 0} dislikes</span>
                    <span>{post.commentsCount || 0} comments</span>
                  </div>

                  <div className="feed-actions">
                    <button
                      type="button"
                      className={`feed-action${currentReaction === "like" ? " active" : ""}`}
                      onClick={() => reactToPost(post.id, "like")}
                      disabled={pendingAction[`${post.id}:like`]}
                    >
                      Like
                    </button>
                    <button
                      type="button"
                      className={`feed-action${currentReaction === "dislike" ? " active" : ""}`}
                      onClick={() => reactToPost(post.id, "dislike")}
                      disabled={pendingAction[`${post.id}:dislike`]}
                    >
                      Dislike
                    </button>
                    <button
                      type="button"
                      className={`feed-action${isExpanded ? " active" : ""}`}
                      onClick={() =>
                        setExpandedComments((current) => ({
                          ...current,
                          [post.id]: !current[post.id],
                        }))
                      }
                    >
                      {isExpanded ? "Hide comments" : "Show comments"}
                    </button>
                  </div>

                  {isExpanded ? (
                    <section className="feed-comments">
                      <div className="feed-comment-box">
                        <input
                          className="feed-comment-input"
                          placeholder="Write a comment"
                          value={draft}
                          onChange={(event) =>
                            setCommentDrafts((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                        />
                        <div className="feed-comment-row">
                          <span className="feed-author-meta">
                            Comments stay hidden until someone opens this panel.
                          </span>
                          <button
                            type="button"
                            className="feed-comment-submit"
                            onClick={() => addComment(post.id)}
                            disabled={pendingAction[post.id]}
                          >
                            Comment
                          </button>
                        </div>
                      </div>

                      <div className="feed-comment-list">
                        {post.comments?.length ? (
                          post.comments.map((comment) => (
                            <div className="feed-comment-item" key={comment.id}>
                              <div className="feed-avatar">
                                <Avatar
                                  name={comment.author?.name}
                                  pic={comment.author?.pic}
                                />
                              </div>
                              <div className="feed-comment-bubble">
                                <p className="feed-comment-name">
                                  {comment.author?.name || "Reader"}
                                </p>
                                <p className="feed-comment-text">
                                  {comment.text}
                                </p>
                                <p className="feed-comment-date">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="feed-empty">
                            No comments yet. Start the conversation.
                          </p>
                        )}
                      </div>
                    </section>
                  ) : null}
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </>
  );
}

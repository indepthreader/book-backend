import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { startRazorpayPayment } from "../lib/payments";

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString();
}

const CSS = `
.profile-wrap {
  padding: 20px;
  background: var(--app-bg);
  min-height: 100vh;
  color: var(--app-text);
  font-family: system-ui, sans-serif;
}
.profile-panel {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 18px;
}
.profile-eyebrow {
  color: var(--app-accent);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.profile-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 14px;
}
.profile-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, 1fr);
}
.metric-card {
  background: var(--app-surface-2);
  border: 1px solid var(--app-border-soft);
  border-radius: 12px;
  padding: 12px;
}
.metric-card span {
  font-size: 0.7rem;
  color: var(--app-text-muted);
}
.metric-card strong {
  display: block;
  margin-top: 4px;
  font-size: 0.95rem;
}
.plan-switcher {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.plan-pill {
  padding: 6px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border: 1px solid var(--app-border);
  font-size: 0.75rem;
  color: var(--app-text-muted);
}
.plan-pill.active {
  background: var(--app-accent);
  border-color: var(--app-accent);
  color: #fff;
}
.price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border-soft);
  border-radius: 14px;
  padding: 14px;
  margin-top: 14px;
  gap: 10px;
  flex-wrap: wrap;
}
.primary-btn {
  background: var(--app-accent);
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
}
.secondary-btn {
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border: 1px solid var(--app-border);
  color: var(--app-text-soft);
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
}
.muted {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}
.form-message {
  color: var(--app-accent);
  font-size: 0.8rem;
  margin-top: 10px;
}
@media (max-width: 600px) {
  .profile-wrap { padding: 14px; }
  .profile-grid { grid-template-columns: 1fr; }
  .profile-title { font-size: 1.1rem; }
  .price-box { flex-direction: column; align-items: flex-start; }
  .primary-btn, .secondary-btn { width: 100%; text-align: center; }
}
`;

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Exactly one plan is active at a time
  const isPro = user?.paymentSubscription?.isActive;
  const isTrial = !isPro && user?.trial?.isActive;
  const isFree = !isPro && !isTrial;

  const subscriptionLabel = useMemo(() => {
    if (user?.role === "admin") return "Admin";
    if (isPro) return "Pro Monthly";
    if (isTrial) return `Trial (${user.trial.daysLeft} days left)`;
    return "Upgrade required";
  }, [user]);

  const startPayment = async () => {
    await startRazorpayPayment({ user, refreshUser, setLoading, setMessage });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="profile-wrap">
        {/* PROFILE */}
        <div className="profile-panel">
          <p className="profile-eyebrow">Profile</p>
          <h2 className="profile-title">Account Details</h2>
          <div className="profile-grid">
            <div className="metric-card">
              <span>Name</span>
              <strong>{user?.name || "-"}</strong>
            </div>
            <div className="metric-card">
              <span>Email</span>
              <strong>{user?.email || "-"}</strong>
            </div>
            <div className="metric-card">
              <span>Phone</span>
              <strong>{user?.phone || "-"}</strong>
            </div>
            <div className="metric-card">
              <span>Role</span>
              <strong>{user?.role || "user"}</strong>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION */}
        <div className="profile-panel">
          <p className="profile-eyebrow">Subscription</p>
          <h2 className="profile-title">{subscriptionLabel}</h2>

          {/* ✅ Only active pill is red, others are dim */}
          <div className="plan-switcher">
            <span className={`plan-pill${isFree ? " active" : ""}`}>Free</span>
            <span className={`plan-pill${isTrial ? " active" : ""}`}>
              {isTrial ? `Trial (${user.trial.daysLeft}d left)` : "Trial"}
            </span>
            <span
              className={`plan-pill${isPro || user?.role === "admin" ? " active" : ""}`}
            >
              Pro
            </span>
          </div>

          <div className="profile-grid">
            <div className="metric-card">
              <span>Plan</span>
              <strong>{user?.paymentSubscription?.plan || "free"}</strong>
            </div>
            <div className="metric-card">
              <span>Status</span>
              <strong>
                {user?.paymentSubscription?.isActive ? "Active" : "Inactive"}
              </strong>
            </div>
            <div className="metric-card">
              <span>Start</span>
              <strong>
                {formatDate(user?.paymentSubscription?.startDate)}
              </strong>
            </div>
            <div className="metric-card">
              <span>End</span>
              <strong>{formatDate(user?.paymentSubscription?.endDate)}</strong>
            </div>
          </div>

          {!isPro && user?.role !== "admin" && (
            <div className="price-box">
              <div>
                <strong>₹149 / month</strong>
                <p className="muted">Razorpay subscription</p>
              </div>
              <button
                className="primary-btn"
                onClick={startPayment}
                disabled={loading}
              >
                {loading ? "Opening..." : "Upgrade"}
              </button>
            </div>
          )}

          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </>
  );
}

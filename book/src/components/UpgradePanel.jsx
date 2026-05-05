import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { startRazorpayPayment } from "../lib/payments";

const CSS = `
.profile-wrap {
  min-height: 100svh;
  background: #0b0b0c;
  padding: 16px;
  display: flex;
  justify-content: center;
  font-family: system-ui, sans-serif;
}
.profile-box {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.step-card {
  background: linear-gradient(180deg, #141416, #0c0c0d);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}
.step-sub {
  font-size: 0.8rem;
  color: #6b7280;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.info-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 10px;
}
.info-box span {
  font-size: 0.7rem;
  color: #6b7280;
}
.info-box strong {
  display: block;
  margin-top: 3px;
  font-size: 0.85rem;
  color: #fff;
}
.plan-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.plan-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid rgba(255,255,255,0.08);
  color: #444;
  background: transparent;
}
.plan-pill.active {
  background: rgba(255,77,79,0.15);
  border-color: rgba(255,77,79,0.4);
  color: #ff4d4f;
}
.btn {
  width: 100%;
  padding: 11px;
  border-radius: 999px;
  border: 0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn.primary {
  background: linear-gradient(135deg, #ff4d4f, #ef4444);
  color: white;
}
.btn.secondary {
  background: rgba(255,255,255,0.06);
  color: #fff;
}
.msg {
  text-align: center;
  font-size: 0.8rem;
  color: #ff6b6b;
}
.step-indicator {
  display: flex;
  gap: 6px;
}
.step-dot {
  height: 6px;
  flex: 1;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
}
.step-dot.active {
  background: #ff4d4f;
}
@media (max-width: 480px) {
  .info-grid { grid-template-columns: 1fr; }
}
`;

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString();
}

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Exactly one active state at a time
  const isPro = user?.paymentSubscription?.isActive;
  const isTrial = !isPro && user?.trial?.isActive;
  const isFree = !isPro && !isTrial;

  const subscriptionLabel = useMemo(() => {
    if (user?.role === "admin") return "Admin";
    if (isPro) return "Pro Plan Active";
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
        <div class="profile-box">
          <div className="step-indicator">
            <div className="step-dot active"></div>
            <div className="step-dot active"></div>
          </div>

          {/* Account */}
          <div className="step-card">
            <div className="step-title">Account</div>
            <div className="step-sub">Your personal info</div>
            <div className="info-grid">
              <div className="info-box">
                <span>Name</span>
                <strong>{user?.name || "-"}</strong>
              </div>
              <div className="info-box">
                <span>Email</span>
                <strong>{user?.email || "-"}</strong>
              </div>
              <div className="info-box">
                <span>Phone</span>
                <strong>{user?.phone || "-"}</strong>
              </div>
              <div className="info-box">
                <span>Role</span>
                <strong>{user?.role || "user"}</strong>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="step-card">
            <div className="step-title">Subscription</div>
            <div className="step-sub">{subscriptionLabel}</div>

            {/* ✅ Only active pill highlights */}
            <div className="plan-row">
              <div className={`plan-pill${isFree ? " active" : ""}`}>Free</div>
              <div className={`plan-pill${isTrial ? " active" : ""}`}>
                {isTrial ? `Trial (${user.trial.daysLeft}d left)` : "Trial"}
              </div>
              <div
                className={`plan-pill${isPro || user?.role === "admin" ? " active" : ""}`}
              >
                Pro
              </div>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <span>Status</span>
                <strong>{isPro ? "Active" : "Inactive"}</strong>
              </div>
              <div className="info-box">
                <span>Plan</span>
                <strong>{user?.paymentSubscription?.plan || "free"}</strong>
              </div>
              <div className="info-box">
                <span>Start</span>
                <strong>
                  {formatDate(user?.paymentSubscription?.startDate)}
                </strong>
              </div>
              <div className="info-box">
                <span>End</span>
                <strong>
                  {formatDate(user?.paymentSubscription?.endDate)}
                </strong>
              </div>
            </div>

            {!isPro && user?.role !== "admin" && (
              <button
                className="btn primary"
                onClick={startPayment}
                disabled={loading}
              >
                {loading ? "Opening..." : "Upgrade ₹149"}
              </button>
            )}

            {isPro && (
              <button className="btn secondary" disabled>
                Active Plan
              </button>
            )}

            {message && <div className="msg">{message}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

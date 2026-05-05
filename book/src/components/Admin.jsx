import { useEffect, useState } from "react";
import { api } from "../lib/api";

const ADMIN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "users", label: "Users" },
  { id: "uploads", label: "Uploads" },
  { id: "settings", label: "App Settings" },
];

function formatUploadStatus(upload) {
  const uploadStatus = upload.uploadStatus || "saved";
  const textStatus = upload.textExtractStatus || "pending";
  if (uploadStatus !== "saved") return "Upload failed";
  if (textStatus === "extracted") return "Upload saved • text extracted";
  if (textStatus === "empty") return "Upload saved • no text found";
  if (textStatus === "unsupported") return "Upload saved • format unsupported";
  if (textStatus === "failed") return "Upload saved • text extract failed";
  return "Upload saved • processing";
}

function groupSettings(items) {
  return items.reduce((acc, item) => {
    const key = item.group || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function formatBytesAsMb(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(2)} MB`;
}

function formatCurrencyInr(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Rs 0";
  return `Rs ${amount.toLocaleString("en-IN")}`;
}

function formatPageLabel(page) {
  if (!page || page === "/") return "Landing";
  return page;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState({
    stats: null,
    users: [],
    uploads: [],
  });
  const [settings, setSettings] = useState([]);
  const [analytics, setAnalytics] = useState({
    periods: null,
    pages: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [showSecrets, setShowSecrets] = useState({});

  const groupedSettings = groupSettings(settings);

  const load = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [overviewResult, settingsResult, analyticsResult] =
        await Promise.all([
        api("/api/admin/overview"),
        api("/api/admin/settings"),
        api("/api/admin/analytics"),
      ]);
      setOverview({
        stats: overviewResult.stats,
        users: overviewResult.users || [],
        uploads: overviewResult.uploads || [],
      });
      setSettings(settingsResult.settings || []);
      setAnalytics({
        periods: analyticsResult.periods || null,
        pages: analyticsResult.pages || [],
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (user, patch) => {
    try {
      setMessage("");
      await api(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await load();
      setMessage("User updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteUser = async (user) => {
    try {
      setMessage("");
      await api(`/api/admin/users/${user.id}`, { method: "DELETE" });
      setConfirmTarget(null);
      setConfirmText("");
      await load();
      setMessage("User deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteUpload = async (upload) => {
    try {
      setMessage("");
      await api(`/api/admin/uploads/${upload._id}`, { method: "DELETE" });
      setConfirmTarget(null);
      setConfirmText("");
      await load();
      setMessage("Upload deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleConfirm = () => {
    if (confirmText !== "DELETE" || !confirmTarget) return;
    if (confirmTarget.type === "user") deleteUser(confirmTarget.data);
    else deleteUpload(confirmTarget.data);
  };

  const patchSetting = (key, patch) => {
    setSettings((current) =>
      current.map((item) =>
        item.key === key
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  };

  const saveSettings = async () => {
    try {
      setSavingSettings(true);
      setMessage("");
      const result = await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          settings: settings.map((item) => ({
            key: item.key,
            value: item.value ?? "",
            enabled: Boolean(item.enabled),
          })),
        }),
      });
      setSettings(result.settings || []);
      setMessage(result.message || "Settings saved successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--app-bg); color: var(--app-text); font-family: system-ui; overflow-x: hidden; }
        .stack { padding: 20px; max-width: 100%; }
        .panel { background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 18px; padding: 18px; margin-bottom: 20px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25); }
        .panel h2, .panel h3 { margin: 8px 0; }
        .eyebrow { color: #ff7a59; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; }
        .panel-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .secondary-button, .tab-button, .mini-button, .input-action {
          background: transparent;
          border: 1px solid var(--app-border);
          color: var(--app-text);
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 10px;
          transition: 0.2s ease;
        }
        .secondary-button:hover, .tab-button:hover, .mini-button:hover, .input-action:hover {
          border-color: #ff7a59;
          color: var(--app-text);
        }
        .tab-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tab-button.active {
          background: linear-gradient(135deg, #ff7a59, #ff4d5a);
          border-color: transparent;
        }
        .form-message {
          margin: 0 0 20px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 122, 89, 0.12);
          border: 1px solid rgba(255, 122, 89, 0.2);
          color: #ffd4c8;
        }
        .muted { color: var(--app-text-muted); }
        .stat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        .metric-card {
          background: linear-gradient(180deg, color-mix(in srgb, var(--app-text) 4%, transparent), color-mix(in srgb, var(--app-text) 1%, transparent));
          padding: 14px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid var(--app-border);
        }
        .metric-card span { font-size: 12px; color: var(--app-text-muted); }
        .metric-card strong { font-size: 24px; }
        .table-wrap { overflow-x: auto; }
        .admin-table { width: 100%; min-width: 700px; border-collapse: collapse; }
        .admin-table th, .admin-table td {
          border-bottom: 1px solid var(--app-border);
          padding: 12px 10px;
          text-align: left;
          vertical-align: top;
        }
        .action-row, .setting-actions, .setting-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .mini-button {
          background: var(--app-surface-2);
          font-size: 12px;
        }
        .danger {
          border-color: rgba(255, 77, 90, 0.45);
          color: #ff8f9b;
        }
        .settings-grid {
          display: grid;
          gap: 16px;
        }
        .settings-group {
          border: 1px solid var(--app-border);
          border-radius: 16px;
          padding: 16px;
          background: color-mix(in srgb, var(--app-text) 2%, transparent);
        }
        .settings-list {
          display: grid;
          gap: 14px;
          margin-top: 14px;
        }
        .setting-card {
          border: 1px solid var(--app-border);
          border-radius: 14px;
          padding: 14px;
          background: var(--app-surface-2);
        }
        .setting-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .setting-title {
          font-size: 15px;
          font-weight: 700;
        }
        .badge {
          font-size: 11px;
          padding: 5px 9px;
          border-radius: 999px;
          border: 1px solid #333;
          background: color-mix(in srgb, var(--app-text) 5%, transparent);
          color: var(--app-text-soft);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .badge.database {
          border-color: rgba(38, 193, 126, 0.45);
          color: #73efb0;
        }
        .badge.env {
          border-color: rgba(255, 122, 89, 0.45);
          color: #ffc7b6;
        }
        .setting-desc {
          color: var(--app-text-muted);
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .setting-input-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          margin-bottom: 12px;
        }
        .setting-input {
          width: 100%;
          padding: 11px 12px;
          border-radius: 10px;
          border: 1px solid var(--app-border);
          background: #fff;
          color: #111;
          outline: none;
        }
        .setting-input:focus {
          border-color: #ff7a59;
          box-shadow: 0 0 0 3px rgba(255, 122, 89, 0.12);
        }
        .toggle-on {
          border-color: rgba(38, 193, 126, 0.4);
          color: #73efb0;
        }
        .toggle-off {
          border-color: rgba(255, 122, 89, 0.35);
          color: #ffc7b6;
        }
        .settings-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .primary-button {
          background: linear-gradient(135deg, #ff7a59, #ff4d5a);
          border: none;
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .primary-button:disabled, .secondary-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.78);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }
        .modal-box {
          background: var(--app-surface);
          border: 1px solid #ff7a59;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .modal-title { font-size: 16px; font-weight: 700; color: var(--app-text); }
        .modal-label { font-size: 13px; color: var(--app-text-muted); line-height: 1.5; }
        .modal-label strong { color: var(--app-text); }
        .modal-input {
          width: 100%;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid var(--app-border);
          border-radius: 8px;
          color: #111;
          font-size: 14px;
          outline: none;
        }
        .modal-input:focus { border-color: #ff7a59; }
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .modal-cancel {
          background: var(--app-surface-2);
          border: 1px solid var(--app-border);
          color: var(--app-text-muted);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }
        .modal-confirm {
          background: #ff4d5a;
          border: none;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          opacity: 0.4;
          transition: opacity 0.2s;
        }
        .modal-confirm.ready { opacity: 1; }

        @media (max-width: 900px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .stack { padding: 14px; }
          .stat-grid { grid-template-columns: 1fr; }
          .admin-table { min-width: 560px; }
          .action-row { flex-direction: column; align-items: flex-start; }
          .setting-top, .settings-footer, .panel-header { flex-direction: column; }
          .setting-input-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="stack">
        <br />
        <br />

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Admin Dashboard</p>
              <h2>Manage users, uploads, and live app settings</h2>
              <p className="muted">
                DB values are used first. If a setting is disabled, the app
                falls back to `.env`.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={load}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {message ? <p className="form-message">{message}</p> : null}

        <div className="tab-row">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-button${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <section className="panel">
            <p className="muted">Loading admin data...</p>
          </section>
        ) : (
          <>
            {activeTab === "overview" && (
              <section className="panel">
                <p className="eyebrow">Overview</p>
                <h2>Platform snapshot</h2>
                <div className="stat-grid">
                  <div className="metric-card">
                    <span>Total users</span>
                    <strong>{overview.stats?.totalUsers || 0}</strong>
                  </div>
                  <div className="metric-card">
                    <span>Recent uploads</span>
                    <strong>{overview.stats?.totalUploads || 0}</strong>
                  </div>
                  <div className="metric-card">
                    <span>Active subscribers</span>
                    <strong>{overview.stats?.activeSubscribers || 0}</strong>
                  </div>
                  <div className="metric-card">
                    <span>Admins</span>
                    <strong>{overview.stats?.admins || 0}</strong>
                  </div>
                  <div className="metric-card">
                    <span>Total earnings</span>
                    <strong>
                      {formatCurrencyInr(overview.stats?.totalEarnings || 0)}
                    </strong>
                  </div>
                  <div className="metric-card">
                    <span>Successful payments</span>
                    <strong>{overview.stats?.successfulPayments || 0}</strong>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "analytics" && (
              <>
                <section className="panel">
                  <p className="eyebrow">Analytics</p>
                  <h2>Unique visits by period</h2>
                  <div className="stat-grid">
                    <div className="metric-card">
                      <span>Today total</span>
                      <strong>{analytics.periods?.today?.totalVisits || 0}</strong>
                    </div>
                    <div className="metric-card">
                      <span>Today logged in</span>
                      <strong>{analytics.periods?.today?.loggedInVisits || 0}</strong>
                    </div>
                    <div className="metric-card">
                      <span>Today guests</span>
                      <strong>{analytics.periods?.today?.guestVisits || 0}</strong>
                    </div>
                    <div className="metric-card">
                      <span>This month</span>
                      <strong>{analytics.periods?.month?.totalVisits || 0}</strong>
                    </div>
                    <div className="metric-card">
                      <span>This year</span>
                      <strong>{analytics.periods?.year?.totalVisits || 0}</strong>
                    </div>
                    <div className="metric-card">
                      <span>Year guests</span>
                      <strong>{analytics.periods?.year?.guestVisits || 0}</strong>
                    </div>
                  </div>
                </section>

                <section className="panel">
                  <p className="eyebrow">Page Tracking</p>
                  <h2>Monthly page breakdown</h2>
                  <div className="table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Page</th>
                          <th>Total</th>
                          <th>Logged in</th>
                          <th>Guests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.pages.length ? (
                          analytics.pages.map((item) => (
                            <tr key={item.page}>
                              <td>{formatPageLabel(item.page)}</td>
                              <td>{item.totalVisits}</td>
                              <td>{item.loggedInVisits}</td>
                              <td>{item.guestVisits}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="muted">
                              No analytics data yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {activeTab === "users" && (
              <section className="panel">
                <p className="eyebrow">Users</p>
                <h2>User management</h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Plan</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            {user.paymentSubscription?.isActive
                              ? "Pro"
                              : user.trial?.isActive
                                ? "Trial"
                                : "Upgrade"}
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                type="button"
                                className="mini-button"
                                onClick={() =>
                                  updateUser(user, {
                                    role:
                                      user.role === "admin" ? "user" : "admin",
                                  })
                                }
                              >
                                {user.role === "admin"
                                  ? "Make user"
                                  : "Make admin"}
                              </button>
                              <button
                                type="button"
                                className="mini-button"
                                onClick={() =>
                                  updateUser(user, {
                                    subscriptionActive:
                                      !user.paymentSubscription?.isActive,
                                  })
                                }
                              >
                                {user.paymentSubscription?.isActive
                                  ? "Stop plan"
                                  : "Enable plan"}
                              </button>
                              <button
                                type="button"
                                className="mini-button danger"
                                onClick={() => {
                                  setConfirmTarget({
                                    type: "user",
                                    data: user,
                                    label: `user "${user.name}"`,
                                  });
                                  setConfirmText("");
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "uploads" && (
              <section className="panel">
                <p className="eyebrow">Uploads</p>
                <h2>Recent uploaded files</h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.uploads.map((upload) => (
                        <tr key={upload._id}>
                          <td>{upload.originalName}</td>
                          <td>{upload.user?.email || "Unknown"}</td>
                          <td>{formatUploadStatus(upload)}</td>
                          <td>
                            <button
                              type="button"
                              className="mini-button danger"
                              onClick={() => {
                                setConfirmTarget({
                                  type: "upload",
                                  data: upload,
                                  label: `file "${upload.originalName}"`,
                                });
                                setConfirmText("");
                              }}
                            >
                              Delete file
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">App Settings</p>
                    <h2>Environment and DB configuration</h2>
                    <p className="muted">
                      Save from admin UI, keep values in DB, and sync the same
                      values into backend `.env`.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={saveSettings}
                    disabled={savingSettings}
                  >
                    {savingSettings ? "Saving..." : "Save all settings"}
                  </button>
                </div>

                <div className="settings-grid">
                  {Object.entries(groupedSettings).map(([groupName, items]) => (
                    <div className="settings-group" key={groupName}>
                      <h3>{groupName}</h3>
                      <div className="settings-list">
                        {items.map((item) => {
                          const inputType =
                            item.inputType === "password" &&
                            !showSecrets[item.key]
                              ? "password"
                              : item.inputType === "number"
                                ? "number"
                                : "text";

                          return (
                            <div className="setting-card" key={item.key}>
                              <div className="setting-top">
                                <div>
                                  <div className="setting-title">
                                    {item.label}
                                  </div>
                                  <p className="setting-desc">
                                    {item.description}
                                  </p>
                                  {item.key === "MAX_UPLOAD_SIZE" ? (
                                    <p className="setting-desc">
                                      Current display:{" "}
                                      {formatBytesAsMb(item.value) || "Invalid size"}
                                    </p>
                                  ) : item.key === "SUBSCRIPTION_AMOUNT" ? (
                                    <p className="setting-desc">
                                      Current display:{" "}
                                      {formatCurrencyInr(item.value)}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="setting-meta">
                                  <span className={`badge ${item.source}`}>
                                    {item.dbOnly
                                      ? item.dbValue
                                        ? "Saved"
                                        : "Not configured"
                                      : item.source === "database"
                                      ? "DB active"
                                      : "ENV fallback"}
                                  </span>
                                  {!item.dbOnly ? (
                                    null
                                  ) : null}
                                </div>
                              </div>

                              <div className="setting-input-row">
                                <input
                                  className="setting-input"
                                  type={inputType}
                                  value={item.value ?? ""}
                                  onChange={(event) =>
                                    patchSetting(item.key, {
                                      value: event.target.value,
                                    })
                                  }
                                  placeholder={`Enter ${item.label}`}
                                />
                                <div className="setting-actions">
                                  {item.sensitive ? (
                                    <button
                                      type="button"
                                      className="input-action"
                                      onClick={() =>
                                        setShowSecrets((current) => ({
                                          ...current,
                                          [item.key]: !current[item.key],
                                        }))
                                      }
                                    >
                                      {showSecrets[item.key] ? "Hide" : "Show"}
                                    </button>
                                  ) : null}
                                  {!item.dbOnly ? (
                                    <>
                                      <button
                                        type="button"
                                        className="input-action"
                                        onClick={() =>
                                          patchSetting(item.key, {
                                            value: item.envValue || "",
                                          })
                                        }
                                      >
                                        Use .env
                                      </button>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              <div className="setting-meta">
                                <span className="muted">
                                  Key: {item.key}
                                </span>
                                {!item.dbOnly ? (
                                  <span className="muted">
                                    Default `.env`:{" "}
                                    {item.key === "MAX_UPLOAD_SIZE"
                                      ? formatBytesAsMb(item.envValue) ||
                                        "empty"
                                      : item.key === "SUBSCRIPTION_AMOUNT"
                                        ? formatCurrencyInr(item.envValue)
                                      : item.envValue
                                        ? "available"
                                        : "empty"}
                                  </span>
                                ) : null}
                                <span className="muted">
                                  DB value:{" "}
                                  {item.key === "MAX_UPLOAD_SIZE"
                                    ? formatBytesAsMb(item.dbValue) ||
                                      "not saved"
                                    : item.key === "SUBSCRIPTION_AMOUNT"
                                      ? item.dbValue
                                        ? formatCurrencyInr(item.dbValue)
                                        : "not saved"
                                    : item.dbValue
                                      ? "saved"
                                      : "not saved"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="settings-footer">
                  <p className="muted">
                    `MAX_UPLOAD_SIZE` is still stored in bytes, but this page
                    shows the real size in MB. Example: `10485760 = 10 MB`.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={saveSettings}
                    disabled={savingSettings}
                  >
                    {savingSettings ? "Saving..." : "Save all settings"}
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </section>

      {confirmTarget && (
        <div
          className="modal-overlay"
          onClick={() => {
            setConfirmTarget(null);
            setConfirmText("");
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Confirm Delete</div>
            <p className="modal-label">
              You are about to permanently delete{" "}
              <strong>{confirmTarget.label}</strong>. This action cannot be
              undone.
            </p>
            <p className="modal-label">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              className="modal-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => {
                  setConfirmTarget(null);
                  setConfirmText("");
                }}
              >
                Cancel
              </button>
              <button
                className={`modal-confirm${confirmText === "DELETE" ? " ready" : ""}`}
                onClick={handleConfirm}
                disabled={confirmText !== "DELETE"}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

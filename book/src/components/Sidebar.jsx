import { getAccessLabel } from "../utils/subscription";

const NAV_ITEMS = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Library",
    path: "/library",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "Upload",
    path: "/upload",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Coach",
    path: "/coach",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Community",
    path: "/community",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
  {
    label: "Setup Profile",
    path: "/profile-setup",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const CSS = `
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 99;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.sidebar-overlay.visible {
  display: block;
  opacity: 1;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: var(--app-surface);
  border-right: 1px solid var(--app-border-soft);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
.sidebar.open {
  transform: translateX(0);
  box-shadow: 4px 0 32px rgba(0,0,0,0.5);
}

@media (min-width: 900px) {
  .sidebar {
    transform: translateX(0) !important;
    box-shadow: none;
    position: sticky;
    height: 100vh;
  }
  .sidebar-overlay {
    display: none !important;
  }
}

/* Brand */
.sb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--app-border-soft);
  flex-shrink: 0;
}
.sb-brand-icon {
  width: 34px;
  height: 34px;
  background: var(--app-accent-soft);
  border: 1px solid color-mix(in srgb, var(--app-accent) 28%, transparent);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-accent);
  flex-shrink: 0;
}
.sb-brand-name {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--app-text);
  letter-spacing: -0.01em;
}

/* Nav */
.sb-nav {
  flex: 1;
  padding: 10px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.sb-label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  padding: 10px 8px 4px;
}

.sb-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: var(--app-text-soft);
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.845rem;
  font-weight: 400;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.sb-item:hover {
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  color: var(--app-text);
}
.sb-item.active {
  background: var(--app-accent-soft);
  color: var(--app-text);
}
.sb-item.active .sb-item-icon {
  color: var(--app-accent);
}
.sb-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  transition: color 0.15s;
}
.sb-item-label {
  flex: 1;
  line-height: 1;
}

/* Active pill */
.sb-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--app-accent);
  border-radius: 0 3px 3px 0;
}

/* Admin item */
.sb-item.admin {
  color: #6b5aad;
}
.sb-item.admin:hover, .sb-item.admin.active {
  background: rgba(107,90,173,0.12);
  color: #a89be0;
}

/* Divider */
.sb-divider {
  height: 1px;
  background: var(--app-border-soft);
  margin: 8px 10px;
}

/* Bottom user block */
.sb-footer {
  padding: 10px;
  border-top: 1px solid var(--app-border-soft);
  flex-shrink: 0;
}
.sb-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 9px;
  margin-bottom: 6px;
}
.sb-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--app-accent-soft);
  border: 1px solid color-mix(in srgb, var(--app-accent) 30%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--app-accent);
  flex-shrink: 0;
  font-family: 'Outfit', system-ui, sans-serif;
}
.sb-user-info {
  flex: 1;
  min-width: 0;
}
.sb-user-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--app-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Outfit', system-ui, sans-serif;
}
.sb-user-role {
  font-size: 0.67rem;
  color: var(--app-text-muted);
  margin-top: 1px;
  font-family: 'Outfit', system-ui, sans-serif;
}
.sb-signout {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: var(--app-text-muted);
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}
.sb-signout:hover {
  background: var(--app-accent-soft);
  color: var(--app-accent);
}
.sb-utility {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px 4px;
}
.sb-utility-label {
  font-size: 0.72rem;
  color: var(--app-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.sb-theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--app-border);
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  color: var(--app-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sb-theme-toggle:hover {
  color: var(--app-accent);
  background: color-mix(in srgb, var(--app-text) 8%, transparent);
}
`;

export default function Sidebar({
  user,
  pathname,
  navigate,
  logout,
  sidebarOpen,
  onClose,
  theme,
  onToggleTheme,
}) {
  const userName = user?.name ?? "Reader";
  const accessLabel = getAccessLabel(user);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const go = (path) => {
    if (pathname !== path) navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="sb-brand-name">InDepth</span>
        </div>

        {/* Main nav */}
        <nav className="sb-nav">
          <div className="sb-label">Menu</div>

          {NAV_ITEMS.map(({ label, path, icon }) => (
            <button
              key={path}
              type="button"
              className={`sb-item ${pathname === path ? "active" : ""}`}
              onClick={() => go(path)}
            >
              <span className="sb-item-icon">{icon}</span>
              <span className="sb-item-label">{label}</span>
            </button>
          ))}

          <div className="sb-divider" />
          <div className="sb-label">Account</div>

          {BOTTOM_ITEMS.map(({ label, path, icon }) => (
            <button
              key={path}
              type="button"
              className={`sb-item ${pathname === path ? "active" : ""}`}
              onClick={() => go(path)}
            >
              <span className="sb-item-icon">{icon}</span>
              <span className="sb-item-label">{label}</span>
            </button>
          ))}

          {user?.role === "admin" && (
            <>
              <div className="sb-divider" />
              <button
                type="button"
                className={`sb-item admin ${pathname === "/admin" ? "active" : ""}`}
                onClick={() => go("/admin")}
              >
                <span className="sb-item-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <span className="sb-item-label">Admin</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer — user info + sign out */}
        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{userName}</div>
              <div className="sb-user-role">{accessLabel}</div>
            </div>
          </div>
          <button type="button" className="sb-signout" onClick={logout}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
          <div className="sb-utility">
            <span className="sb-utility-label">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
            <button
              type="button"
              className="sb-theme-toggle"
              onClick={onToggleTheme}
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 11.5 3z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

import { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Library from "./components/Library";
import UploadBook from "./components/UploadBook";
import Reader from "./components/Reader";
import Coach from "./components/Coach";
import Admin from "./components/Admin";
import Community from "./components/Community";
import CommunityComposer from "./components/CommunityComposer";
import UpgradePanel from "./components/UpgradePanel";
import Profile from "./components/Profile";
import { api } from "./lib/api";
import { readSavedBooks, saveBooks } from "./utils/books";
import { mapUploadToBook } from "./utils/books";
import { hasAccess } from "./utils/subscription";
import ProfileSetup from "./components/ProfileSetup";
import AuthCallback from "./components/AuthCallback";
import LandingPage from "./Home";
import { trackVisit } from "./lib/analytics";
import { ContactPage, PrivacyPage, TermsPage } from "./components/PublicPages";

/* ── Page title map ─────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/library": "Library",
  "/upload": "Upload",
  "/coach": "Coach",
  "/community": "Community",
  "/post": "Create Post",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/contact": "Contact",
  "/profile": "Profile",
  "/profile-setup": "Setup Profile",
  "/admin": "Admin",
};

function getPageTitle(pathname) {
  if (pathname.startsWith("/read/")) return "Reader";
  return PAGE_TITLES[pathname] || "InDepth";
}

/* ── Route helpers ──────────────────────────────────────────────────────── */
function ReaderRoute({ books, onTool }) {
  const { bookId } = useParams();
  const book = books.find((item) => item.id === bookId) || null;
  return <Reader book={book} onTool={onTool} />;
}

function CoachRoute({ books }) {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("book");
  const activeTool = searchParams.get("tool") || "Story Coach";
  const book = books.find((item) => item.id === bookId) || null;
  return <Coach activeTool={activeTool} book={book} />;
}

/* ── Mobile Header ──────────────────────────────────────────────────────── */
const HEADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500;600&display=swap');

.app-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border-soft);
  z-index: 90;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}

@media (max-width: 899px) {
  .app-header { display: flex; }
 .app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--app-bg);
}
}

.app-header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.app-header-logo {
  width: 30px;
  height: 30px;
  background: var(--app-accent-soft);
  border: 1px solid color-mix(in srgb, var(--app-accent) 28%, transparent);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-accent);
}
.app-header-title {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--app-text);
  letter-spacing: -0.01em;
}
.app-header-page {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 0.78rem;
  color: var(--app-text-muted);
}

/* Hamburger button */
.hamburger {
  width: 38px;
  height: 38px;
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.hamburger:hover {
  background: color-mix(in srgb, var(--app-text) 8%, transparent);
}
.hamburger svg {
  color: var(--app-text-soft);
  transition: transform 0.2s;
}
.hamburger.open svg {
  color: var(--app-accent);
}
.theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1px solid var(--app-border);
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  color: var(--app-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.theme-toggle:hover {
  background: color-mix(in srgb, var(--app-text) 8%, transparent);
  color: var(--app-accent);
}

/* Remove the old sidebar-toggle button */
.sidebar-toggle { display: none !important; }

/* App shell layout */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--app-bg);
}
.main-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

}
`;

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
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
    );
  }

  return (
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
  );
}

function MobileHeader({ pageTitle, sidebarOpen, onToggle, theme, onToggleTheme }) {
  return (
    <>
      <style>{HEADER_CSS}</style>
      <header className="app-header">
        <button
          type="button"
          className={`hamburger ${sidebarOpen ? "open" : ""}`}
          onClick={onToggle}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            /* X icon when open */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* Hamburger lines */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        <div className="app-header-brand">
          <div className="app-header-logo">
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="app-header-title">InDepth</span>
        </div>

        <span className="app-header-page">{pageTitle}</span>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <ThemeIcon theme={theme} />
        </button>
      </header>
    </>
  );
}

function RouteVisitTracker() {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname || "/");
  }, [location.pathname]);

  return null;
}

function AppLoadingScreen() {
  return (
    <main className="loading-screen">
      <section className="loading-card">
        <div className="loading-mark" aria-hidden="true">
          <svg
            width="28"
            height="28"
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
        </div>
        <h1 className="loading-title">Loading your reader</h1>
        <p className="loading-copy">
          We are restoring your session, books, and workspace after reload.
        </p>
        <div className="loading-track">
          <div className="loading-fill" />
        </div>
      </section>
    </main>
  );
}

/* ── AppShell ───────────────────────────────────────────────────────────── */
function AppShell() {
  const { user, status, logout, theme, toggleTheme } = useAuth();
  const [books, setBooks] = useState(() => readSavedBooks());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;

    async function loadUploads() {
      try {
        const data = await api("/api/uploads");
        if (ignore) return;
        const savedBooks = readSavedBooks();
        const mappedBooks = (data.files || []).map((upload) => {
          const fallback =
            savedBooks.find((book) => book.uploadId === upload._id) ||
            savedBooks.find(
              (book) =>
                book.title === upload.originalName?.replace(/\.[^.]+$/, ""),
            ) ||
            {};
          return mapUploadToBook(upload, fallback);
        });
        setBooks(mappedBooks);
      } catch (error) {
        console.error("Unable to load uploads:", error.message);
      }
    }

    loadUploads();
    return () => {
      ignore = true;
    };
  }, [user]);

  if (status === "loading") {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return (
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Auth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!hasAccess(user)) {
    if (location.pathname === "/privacy") return <PrivacyPage />;
    if (location.pathname === "/terms") return <TermsPage />;
    if (location.pathname === "/contact") return <ContactPage />;
    if (location.pathname === "/profile") return <Profile />;
    return (
      <UpgradePanel user={user} onOpenProfile={() => navigate("/profile")} />
    );
  }

  const addBook = (book) => {
    setBooks((current) => {
      const existing = current.find((item) => item.id === book.id);
      if (existing) {
        return current.map((item) => (item.id === book.id ? book : item));
      }
      return [book, ...current];
    });
    return book;
  };

  const readBook = (book) => {
    navigate(`/read/${book.id}`);
    setSidebarOpen(false);
  };

  const openCoachForBook = (book, tool = "Story Coach") => {
    const query = new URLSearchParams();
    if (book?.id) query.set("book", book.id);
    query.set("tool", tool);
    navigate(`/coach?${query.toString()}`);
    setSidebarOpen(false);
  };

  const openTool = (tool) => {
    const currentBookId = location.pathname.startsWith("/read/")
      ? location.pathname.split("/").pop()
      : books[0]?.id || "";
    openCoachForBook(currentBookId ? { id: currentBookId } : null, tool);
  };

  return (
    <>
      {/* Mobile top header */}
      <MobileHeader
        pageTitle={pageTitle}
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-shell">
        <Sidebar
          user={user}
          pathname={location.pathname}
          navigate={(next) => {
            navigate(next);
            setSidebarOpen(false);
          }}
          logout={logout}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <section className="main-column">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Home
                  user={user}
                  openUpload={() => navigate("/upload")}
                  openLibrary={() => navigate("/library")}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/library"
              element={<Library books={books} onRead={readBook} />}
            />
            <Route
              path="/upload"
              element={
                <UploadBook
                  onAddBook={addBook}
                  onOpenReader={readBook}
                  onOpenCoach={(book) => openCoachForBook(book, "Story Coach")}
                />
              }
            />
            <Route
              path="/read/:bookId"
              element={<ReaderRoute books={books} onTool={openTool} />}
            />
            <Route path="/coach" element={<CoachRoute books={books} />} />
            <Route path="/community" element={<Community />} />
            <Route path="/post" element={<CommunityComposer />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route
              path="/admin"
              element={
                user.role === "admin" ? (
                  <Admin />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </section>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteVisitTracker />
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, TOKEN_KEY } from "../lib/api";

const AuthContext = createContext(null);
const THEME_KEY = "indepth_reader_theme";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [status, setStatus] = useState("loading");
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  const saveSession = useCallback((payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    if (payload.user) {
      setUser(payload.user);
    }
    setStatus("ready");
    // console.log(user);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus("ready");
    window.history.replaceState({}, "", "/");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem(TOKEN_KEY);
    if (!activeToken) {
      setStatus("ready");
      return;
    }

    try {
      const data = await api("/api/auth/me");
      setToken(activeToken);
      setUser(data.user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setStatus("ready");
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isAuthenticated: Boolean(token && user),
      saveSession,
      refreshUser,
      logout,
      theme,
      setTheme,
      toggleTheme,
    }),
    [logout, refreshUser, saveSession, token, user, status, theme, toggleTheme],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

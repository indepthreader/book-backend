import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Mounted at /auth/callback
 * Google redirects here with ?token=...&expiresAt=...&needsProfile=true|false
 * We save the session then route accordingly.
 */
export default function AuthCallback() {
  const { refreshUser, saveSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresAt = params.get("expiresAt");
    const needsProfile = params.get("needsProfile") === "true";
    const nextPath = params.get("next");
    const error = params.get("error");

    if (error || !token) {
      navigate("/login?error=google_failed", { replace: true });
      return;
    }

    async function finishLogin() {
      saveSession({ token, tokenExpiresAt: expiresAt, success: true });

      try {
        await refreshUser();
      } catch {
        if (active) {
          navigate("/login?error=google_failed", { replace: true });
        }
        return;
      }

      if (!active) return;

      navigate(
        nextPath || (needsProfile ? "/profile-setup" : "/dashboard"),
        { replace: true },
      );
    }

    finishLogin();

    return () => {
      active = false;
    };
  }, [navigate, refreshUser, saveSession]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0c0d",
        color: "#9996a0",
        fontFamily: "system-ui",
        fontSize: "0.9rem",
        gap: "12px",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          border: "2px solid rgba(255,255,255,0.15)",
          borderTopColor: "#e63946",
          borderRadius: "50",
          animation: "spin 0.65s linear infinite",
          display: "inline-block",
        }}
      />
      Signing you in…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

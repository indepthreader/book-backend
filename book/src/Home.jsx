import { useState, useEffect, useRef } from "react";

const DIMENSIONS = [
  {
    icon: "📖",
    title: "Story Coach",
    desc: "Narrative arcs & character journeys",
  },
  { icon: "🧠", title: "Mindset", desc: "Belief systems & mental models" },
  { icon: "⚡", title: "Skills", desc: "Actionable drills & techniques" },
  { icon: "🌱", title: "Life Lessons", desc: "Meaning, joy & relationships" },
  { icon: "💼", title: "Career", desc: "Reputation & strategy" },
  { icon: "💰", title: "Finance", desc: "Wealth from every angle" },
  { icon: "🏃", title: "Health", desc: "Energy, habits & resilience" },
  { icon: "❤️", title: "Relationships", desc: "Empathy & communication" },
  { icon: "🎨", title: "Creativity", desc: "Ideas & creative process" },
  { icon: "🎯", title: "Deep Focus", desc: "Flow state & deep work" },
];

const REVIEWS = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "Entrepreneur",
    text: "BookAI transformed how I extract insights from every book I read. Pure game-changer.",
  },
  {
    initials: "MW",
    name: "Marcus Webb",
    role: "Author",
    text: "The AI analysis helped me understand narrative patterns I never noticed before.",
  },
  {
    initials: "ER",
    name: "Elena Rodriguez",
    role: "Student",
    text: "Finally a tool that helps me learn smarter, not just faster. Absolutely love it.",
  },
  {
    initials: "RK",
    name: "Rahul Kumar",
    role: "Engineer",
    text: "₹149 a month for this level of insight? Best investment I've made for my career growth.",
  },
];

const TICKER_ITEMS = [
  "📖 Story Coach",
  "🧠 Mindset",
  "⚡ Skills",
  "🌱 Life Lessons",
  "💼 Career",
  "💰 Finance",
  "🏃 Health",
  "❤️ Relationships",
  "🎨 Creativity",
  "🎯 Deep Focus",
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:#0a0a0a; color:#f5f5f5; font-family:'Inter',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#0a0a0a; }
  ::-webkit-scrollbar-thumb { background:#cc0000; border-radius:3px; }

  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes card-appear { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse-red { 0%,100%{box-shadow:0 0 0 0 rgba(204,0,0,0.4)} 50%{box-shadow:0 0 0 8px rgba(204,0,0,0)} }
  @keyframes badge-glow { 0%,100%{background:rgba(204,0,0,0.15)} 50%{background:rgba(204,0,0,0.28)} }

  .nav-link { color:#aaa; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
  .nav-link:hover { color:#cc0000; }

  .btn-red {
    background:#cc0000; color:#fff; border:none; border-radius:6px;
    padding:12px 28px; font-size:14px; font-weight:700; cursor:pointer;
    font-family:'Inter',sans-serif; letter-spacing:.5px; transition:all .2s;
  }
  .btn-red:hover { background:#e00; transform:translateY(-2px); box-shadow:0 8px 24px rgba(204,0,0,0.5); }

  .btn-outline {
    background:transparent; color:#fff; border:1px solid #333; border-radius:6px;
    padding:12px 28px; font-size:14px; font-weight:500; cursor:pointer;
    font-family:'Inter',sans-serif; transition:all .2s;
  }
  .btn-outline:hover { border-color:#cc0000; color:#cc0000; }

  .dim-card { transition:all .25s; cursor:default; }
  .dim-card:hover { transform:translateY(-5px); border-color:rgba(204,0,0,0.4)!important; background:rgba(204,0,0,0.06)!important; }

  .feat-card { transition:all .25s; }
  .feat-card:hover { border-color:rgba(204,0,0,0.3)!important; }

  .review-card { transition:all .25s; }
  .review-card:hover { border-color:rgba(204,0,0,0.25)!important; transform:translateY(-4px); }

  .plan-card { transition:all .3s; cursor:pointer; }
  .plan-card:hover { transform:translateY(-6px); }

  .ticker-track {
    display: flex;
    gap: 48px;
    width: max-content;
    animation: ticker-scroll 22s linear infinite;
    will-change: transform;
  }
  .ticker-track:hover { animation-play-state: paused; }
`;

const goToLogin = () => {
  window.location.href = "/login";
};

// ── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let v = 0;
      const step = target / 60;
      const t = setInterval(() => {
        v = Math.min(v + step, target);
        setN(Math.floor(v));
        if (v >= target) clearInterval(t);
      }, 20);
      obs.disconnect();
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── TICKER (CSS-only infinite scroll, no JS) ─────────────────────────────────
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
        background: "#0d0d0d",
        padding: "12px 0",
        userSelect: "none",
      }}
    >
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span
            key={i}
            style={{
              color: "#444",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false);
  const monthly = 149;
  const annualPerMonth = 99;

  return (
    <section
      id="pricing"
      style={{ padding: "100px 24px", maxWidth: "900px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <p
          style={{
            color: "#cc0000",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "3px",
            marginBottom: "14px",
          }}
        >
          PRICING
        </p>
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(32px,4vw,60px)",
            letterSpacing: "3px",
            marginBottom: "14px",
          }}
        >
          START FREE. UPGRADE ANYTIME.
        </h2>
        <p style={{ color: "#555", fontSize: "15px", marginBottom: "28px" }}>
          7 days free — no credit card required.
        </p>

        {/* Toggle */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "6px 6px",
          }}
        >
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: "7px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontWeight: "600",
              fontSize: "13px",
              background: !annual ? "#cc0000" : "transparent",
              color: !annual ? "#fff" : "#555",
              transition: "all .2s",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: "7px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontWeight: "600",
              fontSize: "13px",
              background: annual ? "#cc0000" : "transparent",
              color: annual ? "#fff" : "#555",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Annual
            <span
              style={{
                background: "rgba(34,197,94,0.15)",
                color: "#22c55e",
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 7px",
                borderRadius: "4px",
                letterSpacing: "0.5px",
              }}
            >
              SAVE 34%
            </span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        {/* FREE TRIAL CARD */}
        <div
          className="plan-card"
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "12px",
            padding: "32px 28px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>🎁</div>
          <p
            style={{
              color: "#555",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            FREE TRIAL
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "52px",
                color: "#fff",
                letterSpacing: "2px",
              }}
            >
              ₹0
            </span>
          </div>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "28px" }}>
            7 days, full access — no card needed
          </p>
          <div style={{ marginBottom: "28px" }}>
            {[
              "All 10 AI dimensions",
              "3 books per day",
              "Full insight reports",
              "Cancel anytime",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <span style={{ color: "#22c55e", fontSize: "13px" }}>✓</span>
                <span style={{ color: "#777", fontSize: "13px" }}>{f}</span>
              </div>
            ))}
          </div>
          <button
            className="btn-outline"
            style={{ width: "100%", padding: "13px" }}
            onClick={goToLogin}
          >
            Start Free Trial →
          </button>
        </div>

        {/* PRO CARD */}
        <div
          className="plan-card"
          style={{
            background: "#111",
            border: "2px solid #cc0000",
            borderRadius: "12px",
            padding: "32px 28px",
            position: "relative",
            boxShadow: "0 0 40px rgba(204,0,0,0.15)",
          }}
        >
          {/* POPULAR badge */}
          <div
            style={{
              position: "absolute",
              top: "-13px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#cc0000",
              color: "#fff",
              fontSize: "10px",
              fontWeight: "800",
              padding: "5px 16px",
              borderRadius: "4px",
              letterSpacing: "2px",
            }}
          >
            MOST POPULAR
          </div>

          <div style={{ fontSize: "28px", marginBottom: "12px" }}>🚀</div>
          <p
            style={{
              color: "#cc0000",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            PRO
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "52px",
                color: "#cc0000",
                letterSpacing: "2px",
              }}
            >
              ₹{annual ? annualPerMonth : monthly}
            </span>
            <span style={{ color: "#555", fontSize: "14px" }}>/mo</span>
          </div>
          {annual && (
            <p
              style={{
                color: "#22c55e",
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              ₹{annualPerMonth * 12}/year · save ₹
              {(monthly - annualPerMonth) * 12}
            </p>
          )}
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "28px" }}>
            {annual ? "Billed annually" : "Billed monthly"} · cancel anytime
          </p>

          <div style={{ marginBottom: "28px" }}>
            {[
              "All 10 AI dimensions",
              "Unlimited books",
              "Deep personalized insights",
              "Priority AI processing",
              "Export to PDF / Notion",
              "Early access to new tools",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <span style={{ color: "#cc0000", fontSize: "13px" }}>✓</span>
                <span style={{ color: "#ccc", fontSize: "13px" }}>{f}</span>
              </div>
            ))}
          </div>
          <button
            className="btn-red"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "15px",
              animation: "pulse-red 2s ease-in-out infinite",
            }}
            onClick={goToLogin}
          >
            Start 7-Day Free Trial →
          </button>
          <p
            style={{
              color: "#333",
              fontSize: "11px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            No credit card required for trial
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {[
          "🔒 Secure payments",
          "🇮🇳 UPI & Cards accepted",
          "↩ Cancel anytime",
          "📞 Indian support",
        ].map((t) => (
          <span
            key={t}
            style={{ color: "#333", fontSize: "12px", fontWeight: "600" }}
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function BookAI() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? "10px 14px" : "0 40px",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
          borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          transition: "all .3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>📚</span>
          <span
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "22px",
              letterSpacing: "2px",
            }}
          >
            BookAI
          </span>
        </div>
        <div style={{ display: isMobile ? "none" : "flex", gap: "28px" }}>
          {[
            ["Features", "#"],
            ["Pricing", "#pricing"],
            ["Privacy", "/privacy"],
            ["Terms", "/terms"],
            ["Contact", "/contact"],
          ].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: isMobile ? "8px" : "10px" }}>
          <button
            className="btn-outline"
            style={{ padding: isMobile ? "8px 14px" : "8px 20px", fontSize: "13px" }}
            onClick={goToLogin}
          >
            Sign In
          </button>
          <button
            className="btn-red"
            style={{ padding: isMobile ? "8px 14px" : "8px 20px", fontSize: "13px" }}
            onClick={goToLogin}
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* ── TRIAL BANNER ── */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          right: 0,
          zIndex: 99,
          background: "linear-gradient(90deg,#1a0000,#2d0000,#1a0000)",
          borderBottom: "1px solid rgba(204,0,0,0.3)",
          padding: isMobile ? "10px 12px" : "9px 24px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "8px" : "12px",
          flexWrap: "wrap",
          animation: "badge-glow 3s ease-in-out infinite",
        }}
      >
        <span style={{ fontSize: "14px" }}>🎁</span>
        <span
          style={{
            color: "#f5f5f5",
            fontSize: isMobile ? "11px" : "12px",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          7-day free trial · then just{" "}
          <strong style={{ color: "#cc0000" }}>₹149/month</strong> · No credit
          card needed
        </span>
        <button
          className="btn-red"
          style={{
            padding: isMobile ? "6px 12px" : "5px 16px",
            fontSize: "11px",
            letterSpacing: "0.5px",
          }}
          onClick={goToLogin}
        >
          Claim Trial →
        </button>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: isMobile ? "210px 16px 72px" : "160px 24px 80px",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,0,0,0.12) 0%, transparent 70%)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(204,0,0,0.1)",
            border: "1px solid rgba(204,0,0,0.3)",
            borderRadius: "4px",
            padding: "5px 14px",
            marginBottom: "28px",
            fontSize: "11px",
            color: "#cc0000",
            fontWeight: "700",
            letterSpacing: "2px",
            animation: "fadeIn .8s ease",
          }}
        >
          ● AI-POWERED LEARNING PLATFORM
        </div>

        <div
          style={{
            fontSize: "64px",
            animation: "float 4s ease-in-out infinite",
            marginBottom: "20px",
          }}
        >
          📚
        </div>

        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(56px,10vw,120px)",
            lineHeight: "0.95",
            letterSpacing: "4px",
            color: "#fff",
            marginBottom: "8px",
            animation: "slideUp .7s ease both",
          }}
        >
          LEARN
        </h1>
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(56px,10vw,120px)",
            lineHeight: "0.95",
            letterSpacing: "4px",
            color: "#cc0000",
            marginBottom: "8px",
            animation: "slideUp .7s .1s ease both",
          }}
        >
          10× SMARTER
        </h1>
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(56px,10vw,120px)",
            lineHeight: "0.95",
            letterSpacing: "4px",
            color: "#fff",
            marginBottom: "32px",
            animation: "slideUp .7s .2s ease both",
          }}
        >
          WITH AI
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            maxWidth: "480px",
            lineHeight: "1.8",
            marginBottom: "16px",
            animation: "fadeIn 1s .4s ease both",
          }}
        >
          Upload any book and unlock insights across 10 powerful learning
          dimensions — instantly.
        </p>

        {/* Price highlight */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: isMobile ? "10px 14px" : "10px 20px",
            marginBottom: "36px",
            animation: "fadeIn 1s .45s ease both",
            maxWidth: "100%",
          }}
        >
          <span
            style={{
              color: "#555",
              fontSize: "13px",
              textDecoration: "line-through",
            }}
          >
            ₹499/mo
          </span>
          <span
            style={{ color: "#cc0000", fontSize: "18px", fontWeight: "800" }}
          >
            ₹149/mo
          </span>
          <span
            style={{
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              fontSize: "11px",
              fontWeight: "700",
              padding: "3px 9px",
              borderRadius: "4px",
            }}
          >
            70% OFF
          </span>
            <span style={{ color: "#444", fontSize: "12px" }}>
              after 7-day free trial
            </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeIn 1s .5s ease both",
            marginBottom: "72px",
            width: "100%",
          }}
        >
          <button
            className="btn-red"
            style={{
              padding: isMobile ? "15px 24px" : "15px 40px",
              fontSize: "15px",
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "320px" : "none",
            }}
            onClick={goToLogin}
          >
            🚀 Start 7-Day Free Trial →
          </button>
          <button
            className="btn-outline"
            style={{
              padding: isMobile ? "15px 24px" : "15px 32px",
              fontSize: "15px",
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "320px" : "none",
            }}
          >
            ▶ Watch Demo
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: isMobile ? "28px" : "64px",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeIn 1s .7s ease both",
          }}
        >
          {[
            { val: 50000, sfx: "+", label: "Books Analyzed" },
            { val: 100000, sfx: "+", label: "Active Learners" },
            { val: 99, sfx: "%", label: "Satisfaction" },
          ].map(({ val, sfx, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "44px",
                  color: "#cc0000",
                  letterSpacing: "2px",
                }}
              >
                <Counter target={val} suffix={sfx} />
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  marginTop: "4px",
                }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Ticker />

      {/* ── DIMENSIONS ── */}
      <section
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              color: "#cc0000",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "3px",
              marginBottom: "14px",
            }}
          >
            10 DIMENSIONS
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(36px,5vw,64px)",
              letterSpacing: "3px",
              marginBottom: "14px",
            }}
          >
            10 WAYS TO UNLOCK ANY BOOK
          </h2>
          <p style={{ color: "#555", fontSize: "15px" }}>
            Every book analyzed across every lens that matters.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
            gap: "12px",
          }}
        >
          {DIMENSIONS.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="dim-card"
              style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: "8px",
                padding: "24px 18px",
                animation: "card-appear .5s ease both",
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "10px" }}>
                {icon}
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "13px",
                  color: "#fff",
                  marginBottom: "5px",
                }}
              >
                {title}
              </div>
              <div
                style={{ color: "#444", fontSize: "12px", lineHeight: "1.6" }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "#0d0d0d",
          borderTop: "1px solid #111",
          borderBottom: "1px solid #111",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p
              style={{
                color: "#cc0000",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "3px",
                marginBottom: "14px",
              }}
            >
              FEATURES
            </p>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(32px,4vw,56px)",
                letterSpacing: "3px",
              }}
            >
              WHY CHOOSE BOOKAI?
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                icon: "⚡",
                title: "Ultra-Fast Analysis",
                desc: "Insights in seconds, not hours. Upload and explore immediately.",
              },
              {
                icon: "🔒",
                title: "Privacy First",
                desc: "End-to-end encryption. Your books stay completely private.",
              },
              {
                icon: "🤖",
                title: "AI-Powered Insights",
                desc: "Advanced NLP extracts lessons and actionable wisdom.",
              },
              {
                icon: "💡",
                title: "Multiple Perspectives",
                desc: "Career, finance, health, and more — all covered.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="feat-card"
                style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: "8px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "rgba(204,0,0,0.1)",
                    border: "1px solid rgba(204,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    marginBottom: "16px",
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "8px",
                    color: "#fff",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{ color: "#444", fontSize: "13px", lineHeight: "1.7" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <Pricing />

      {/* ── REVIEWS ── */}
      <section
        style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              color: "#cc0000",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "3px",
              marginBottom: "14px",
            }}
          >
            REVIEWS
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(32px,4vw,56px)",
              letterSpacing: "3px",
            }}
          >
            LOVED BY LEARNERS
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "16px",
          }}
        >
          {REVIEWS.map(({ initials, name, role, text }) => (
            <div
              key={name}
              className="review-card"
              style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: "8px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  color: "#cc0000",
                  fontSize: "16px",
                  marginBottom: "14px",
                  letterSpacing: "3px",
                }}
              >
                ★★★★★
              </div>
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  marginBottom: "20px",
                }}
              >
                {text}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#cc0000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: "12px",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      color: "#fff",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      color: "#444",
                      fontSize: "11px",
                      marginTop: "1px",
                    }}
                  >
                    {role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(204,0,0,0.1) 0%, transparent 70%)",
          borderTop: "1px solid #111",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(36px,6vw,72px)",
            letterSpacing: "4px",
            marginBottom: "14px",
          }}
        >
          READY TO LEARN SMARTER?
        </h2>
        <p style={{ color: "#555", fontSize: "15px", marginBottom: "12px" }}>
          Join 100K+ learners transforming how they extract wisdom from books.
        </p>
        <p
          style={{
            color: "#cc0000",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "36px",
          }}
        >
          7 days free → then only ₹149/month
        </p>
        <button
          className="btn-red"
          style={{
            padding: isMobile ? "16px 24px" : "17px 52px",
            fontSize: "16px",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? "320px" : "none",
          }}
          onClick={goToLogin}
        >
          Start Free Trial →
        </button>
        <p style={{ color: "#2a2a2a", fontSize: "12px", marginTop: "14px" }}>
          No credit card required. Cancel anytime.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #111",
          padding: isMobile ? "40px 16px 28px" : "48px 40px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
            gap: isMobile ? "28px" : "40px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📚</span>
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "20px",
                  letterSpacing: "2px",
                }}
              >
                BookAI
              </span>
            </div>
            <p
              style={{
                color: "#333",
                fontSize: "13px",
                lineHeight: "1.8",
                maxWidth: "220px",
              }}
            >
              AI-powered learning for the modern reader.
            </p>
            <p
              style={{
                color: "#cc0000",
                fontSize: "13px",
                fontWeight: "700",
                marginTop: "10px",
              }}
            >
              ₹149/month after free trial
            </p>
          </div>
          {[
            {
              h: "Product",
              links: [
                { label: "Features", href: "#" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              h: "Company",
              links: [
                { label: "Home", href: "/" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ],
            },
            {
              h: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ],
            },
          ].map(({ h, links }) => (
            <div key={h}>
              <p
                style={{
                  color: "#333",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  marginBottom: "14px",
                }}
              >
                {h.toUpperCase()}
              </p>
              {links.map((link) => (
                <div key={link.label} style={{ marginBottom: "10px" }}>
                  <a
                    href={link.href}
                    className="nav-link"
                    style={{ fontSize: "13px" }}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid #111",
            paddingTop: "20px",
            color: "#222",
            fontSize: "12px",
          }}
        >
          © 2026 BookAI. Built for learners who demand more.
        </div>
      </footer>
    </>
  );
}

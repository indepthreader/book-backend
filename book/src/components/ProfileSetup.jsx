import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = {
  User: () => (
    <svg
      width="15"
      height="15"
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
  MapPin: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Briefcase: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Target: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: () => (
    <svg
      width="14"
      height="14"
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
  Heart: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Chevron: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Arrow: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Book: () => (
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
  ),
  Globe: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Skip: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13 12 23 18 23 6" />
      <rect x="1" y="6" width="11" height="12" rx="2" ry="2" />
    </svg>
  ),
};

// ── Constants ─────────────────────────────────────────────────────────────────
const INTERESTS = [
  "Self-help",
  "Business",
  "Technology",
  "Finance",
  "Leadership",
  "Psychology",
  "History",
  "Science",
  "Marketing",
  "Philosophy",
  "Productivity",
  "Startups",
];
const STATUSES = ["student", "working", "business", "freelancer", "other"];
const LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Bengali",
  "Punjabi",
];
const STEPS = ["profile", "career", "goals", "family", "siblings"];
const STEP_META = {
  profile: { label: "Personal", icon: <Ic.User /> },
  career: { label: "Career", icon: <Ic.Briefcase /> },
  goals: { label: "Goals", icon: <Ic.Target /> },
  family: { label: "Family", icon: <Ic.Users /> },
  siblings: { label: "Siblings", icon: <Ic.Heart /> },
};
const STEP_HEADS = {
  profile: {
    tag: "Step 1 of 5 — Personal info",
    title: "Tell us about yourself",
    sub: "This helps personalise your AI coaching experience.",
  },
  career: {
    tag: "Step 2 of 5 — Career",
    title: "Your education & career",
    sub: "We tailor book recommendations to your field and level.",
  },
  goals: {
    tag: "Step 3 of 5 — Goals",
    title: "What are you working towards?",
    sub: "Your goals and challenges shape every AI insight you get.",
  },
  family: {
    tag: "Step 4 of 5 — Family",
    title: "Family background",
    sub: "Helps the AI coach give contextual, grounded advice.",
  },
  siblings: {
    tag: "Step 5 of 5 — Siblings",
    title: "Your siblings",
    sub: "Optional — adds context for family-related coaching.",
  },
};

const EMPTY_FORM = {
  age: "",
  gender: "",
  city: "",
  state: "",
  country: "India",
  education: "",
  currentStatus: "",
  profession: "",
  goals: "",
  challenges: "",
  interests: [],
  preferredLanguage: "English",
  fatherOccupation: "",
  motherOccupation: "",
  siblings: [],
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
[data-theme="dark"]{
  --bg:var(--app-bg);--s1:var(--app-surface);--s2:#1a1a1d;--s3:#222226;
  --b1:rgba(255,255,255,0.06);--b2:rgba(255,255,255,0.11);--b3:rgba(255,255,255,0.18);
  --txt:var(--app-text);--txt2:#9996a0;--txt3:#55535e;
  --red:var(--app-accent);--red2:#ff6b6b;--red-dim:rgba(230,57,70,0.08);
  --red-b:rgba(230,57,70,0.22);--red-glow:rgba(230,57,70,0.15);--red-deep:#c1121f;
  --green:#52b788;--r:10px;--r2:14px;
  --serif:'Syne',system-ui,sans-serif;--sans:'Outfit',system-ui,sans-serif;
}
[data-theme="light"]{
  --bg:var(--app-bg);--s1:var(--app-surface);--s2:var(--app-surface-2);--s3:#ece5db;
  --b1:rgba(31,29,34,0.08);--b2:rgba(31,29,34,0.14);--b3:rgba(31,29,34,0.2);
  --txt:var(--app-text);--txt2:#6e6673;--txt3:#8c8490;
  --red:var(--app-accent);--red2:#cb5a3c;--red-dim:rgba(203,90,60,0.08);
  --red-b:rgba(203,90,60,0.24);--red-glow:rgba(203,90,60,0.12);--red-deep:#b0482d;
  --green:#52b788;--r:10px;--r2:14px;
  --serif:'Syne',system-ui,sans-serif;--sans:'Outfit',system-ui,sans-serif;
}
html,body{background:var(--bg);color:var(--txt);font-family:var(--sans);}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 var(--red-glow)}50%{box-shadow:0 0 0 8px transparent}}

.ps-wrap{min-height:100vh;display:grid;grid-template-columns:320px 1fr;}

.ps-side{
  background:var(--s1);border-right:1px solid var(--b1);
  padding:44px 32px;display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;overflow:hidden;
}
.ps-side::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 300px 400px at 0% 80%,rgba(230,57,70,0.06) 0%,transparent 65%);
  pointer-events:none;
}
.ps-logo{display:flex;align-items:center;gap:9px;color:var(--red2);font-family:var(--serif);font-size:0.95rem;font-weight:700;margin-bottom:40px;position:relative;}
.ps-logo-icon{width:32px;height:32px;background:var(--red-dim);border:1px solid var(--red-b);border-radius:9px;display:flex;align-items:center;justify-content:center;color:var(--red2);}
.ps-welcome{position:relative;margin-bottom:36px;}
.ps-tag{font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--red2);display:flex;align-items:center;gap:6px;margin-bottom:10px;}
.ps-tag::before{content:'';width:5px;height:5px;background:var(--red);border-radius:50%;animation:pulse 2s infinite;}
.ps-welcome h2{font-family:var(--serif);font-size:1.45rem;font-weight:700;color:var(--txt);line-height:1.2;letter-spacing:-0.01em;margin-bottom:8px;}
.ps-welcome p{font-size:0.82rem;color:var(--txt2);line-height:1.7;font-weight:300;}
.ps-name{color:var(--red2);}

.ps-steps{display:flex;flex-direction:column;gap:4px;margin-bottom:auto;}
.ps-step{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:var(--r);cursor:default;transition:all 0.2s;}
.ps-step.done{color:var(--green);}
.ps-step.active{background:var(--red-dim);color:var(--txt);}
.ps-step.future{color:var(--txt3);}
.ps-step-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid var(--b1);flex-shrink:0;transition:all 0.2s;}
.ps-step.done .ps-step-icon{background:rgba(82,183,136,0.1);border-color:rgba(82,183,136,0.25);color:var(--green);}
.ps-step.active .ps-step-icon{background:var(--red-dim);border-color:var(--red-b);color:var(--red2);}
.ps-step.future .ps-step-icon{color:var(--txt3);}
.ps-step-info{flex:1;}
.ps-step-label{font-size:0.8rem;font-weight:500;line-height:1;}
.ps-step-sub{font-size:0.68rem;color:var(--txt3);margin-top:2px;}

.ps-pbar{margin-top:28px;padding-top:20px;border-top:1px solid var(--b1);}
.ps-pbar-row{display:flex;justify-content:space-between;font-size:0.67rem;color:var(--txt3);margin-bottom:7px;}
.ps-pbar-track{height:3px;background:var(--b1);border-radius:3px;overflow:hidden;}
.ps-pbar-fill{height:100%;background:linear-gradient(90deg,var(--red-deep),var(--red2));border-radius:3px;transition:width 0.4s cubic-bezier(.4,0,.2,1);}

.ps-main{padding:48px 56px;display:flex;flex-direction:column;align-items:flex-start;max-width:680px;}
.ps-main::before{content:'';position:fixed;top:0;left:320px;right:0;height:3px;background:linear-gradient(90deg,var(--red-deep),var(--red),var(--red2));background-size:200% 100%;animation:shimmer 3s linear infinite;z-index:10;}
.ps-head{margin-bottom:28px;}
.ps-step-tag{font-size:0.62rem;font-weight:600;letter-spacing:0.13em;text-transform:uppercase;color:var(--red);margin-bottom:6px;}
.ps-head h1{font-family:var(--serif);font-size:1.9rem;font-weight:700;color:var(--txt);letter-spacing:-0.015em;line-height:1.15;}
.ps-head p{font-size:0.87rem;color:var(--txt2);margin-top:6px;line-height:1.65;font-weight:300;}

.ps-prefill-banner{
  display:flex;align-items:center;gap:8px;
  background:rgba(82,183,136,0.07);border:1px solid rgba(82,183,136,0.2);
  border-radius:var(--r);padding:9px 14px;margin-bottom:16px;
  font-size:0.76rem;color:var(--green);width:100%;animation:fadeUp 0.2s ease;
}
.ps-prefill-dot{width:6px;height:6px;background:var(--green);border-radius:50%;flex-shrink:0;}

.form-anim{animation:slideIn 0.25s ease;width:100%;}

.sec{display:flex;align-items:center;gap:7px;font-size:0.62rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--txt3);margin:16px 0 10px;}
.sec::after{content:'';flex:1;height:1px;background:var(--b1);}
.sec svg{color:var(--red);}

.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.fld{margin-bottom:10px;}
.lbl{display:block;font-size:0.68rem;font-weight:500;color:var(--txt2);margin-bottom:5px;letter-spacing:0.04em;}

.fld.has-value .lbl::after{content:' ✓';color:var(--green);font-size:0.62rem;}
.fld.has-value .iw input,
.fld.has-value .iw select,
.fld.has-value .iw textarea{border-color:rgba(82,183,136,0.25);background:rgba(82,183,136,0.03);}

.iw{position:relative;display:flex;align-items:center;}
.ii{position:absolute;left:12px;color:var(--txt3);display:flex;align-items:center;pointer-events:none;z-index:1;}
.iw input,.iw select,.iw textarea{
  width:100%;padding:10px 12px 10px 36px;
  background:var(--bg);border:1px solid var(--b1);
  border-radius:var(--r);color:var(--txt);
  font-family:var(--sans);font-size:0.855rem;font-weight:400;
  transition:border-color 0.18s,box-shadow 0.18s;
  outline:none;-webkit-appearance:none;appearance:none;
}
.iw.ni input,.iw.ni select,.iw.ni textarea{padding-left:12px;}
.iw select{cursor:pointer;padding-right:28px;}
.sarr{position:absolute;right:9px;color:var(--txt3);pointer-events:none;}
.iw textarea{resize:vertical;min-height:72px;padding-top:10px;line-height:1.55;}
.iw input::placeholder,.iw textarea::placeholder{color:var(--txt3);}
.iw select option{background:var(--s2);color:var(--txt);}
.iw input:focus,.iw select:focus,.iw textarea:focus{border-color:var(--red);box-shadow:0 0 0 3px var(--red-dim);}
.char{font-size:0.62rem;color:var(--txt3);text-align:right;margin-top:3px;}

.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;}
.chip{padding:5px 12px;border-radius:100px;border:1px solid var(--b1);background:transparent;color:var(--txt2);font-size:0.73rem;font-family:var(--sans);cursor:pointer;transition:all 0.15s;font-weight:400;}
.chip:hover{border-color:var(--b2);color:var(--txt);}
.chip.sel{background:var(--red-dim);border-color:var(--red-b);color:var(--red2);}

.sib-card{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r2);padding:14px;margin-bottom:10px;animation:fadeUp 0.2s ease;}
.sib-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.sib-num{font-size:0.67rem;color:var(--txt3);letter-spacing:0.08em;text-transform:uppercase;}
.sib-del{background:var(--red-dim);border:1px solid var(--red-b);color:var(--red);border-radius:6px;padding:2px 8px;cursor:pointer;font-size:1rem;line-height:1.4;transition:background 0.15s;}
.sib-del:hover{background:rgba(230,57,70,0.14);}

.add-sib{display:flex;align-items:center;gap:7px;font-size:0.78rem;color:var(--red2);cursor:pointer;background:none;border:1px dashed var(--red-b);font-family:var(--sans);padding:9px 14px;border-radius:var(--r);width:100%;justify-content:center;margin-top:4px;transition:all 0.18s;}
.add-sib:hover{background:var(--red-dim);}

.btn-row{display:flex;gap:10px;margin-top:24px;width:100%;}
.btn-primary{flex:1;padding:12px;border-radius:var(--r);border:none;background:linear-gradient(135deg,var(--red-deep) 0%,var(--red) 50%,var(--red2) 100%);background-size:200% 100%;color:#fff;font-family:var(--sans);font-size:0.88rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.22s;letter-spacing:0.02em;box-shadow:0 4px 20px rgba(230,57,70,0.2);}
.btn-primary:hover:not(:disabled){background-position:right center;box-shadow:0 6px 28px rgba(230,57,70,0.35);transform:translateY(-1px);}
.btn-primary:disabled{opacity:0.38;cursor:not-allowed;box-shadow:none;}
.btn-skip{padding:12px 18px;border-radius:var(--r);border:1px solid var(--b2);background:transparent;color:var(--txt2);font-family:var(--sans);font-size:0.83rem;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:6px;}
.btn-skip:hover{border-color:var(--b3);color:var(--txt);}

.msg{padding:10px 14px;border-radius:var(--r);font-size:0.79rem;line-height:1.6;border:1px solid transparent;margin-bottom:14px;animation:fadeUp 0.2s ease;width:100%;}
.msg-err{background:var(--red-dim);color:#f8a0a6;border-left:3px solid var(--red)!important;border-top-color:var(--red-b)!important;border-right-color:var(--red-b)!important;border-bottom-color:var(--red-b)!important;box-shadow:0 0 18px var(--red-glow);}
.msg-ok{background:rgba(82,183,136,0.08);color:var(--green);border-left:3px solid var(--green)!important;border-top-color:rgba(82,183,136,0.2)!important;border-right-color:rgba(82,183,136,0.2)!important;border-bottom-color:rgba(82,183,136,0.2)!important;}

.spin{width:14px;height:14px;border:2px solid rgba(255,255,255,0.2);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;}

.skel{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:var(--r);height:40px;margin-bottom:10px;}

@media(max-width:780px){
  .ps-wrap{grid-template-columns:1fr;}
  .ps-side{display:none;}
  .ps-main{padding:36px 18px;max-width:100%;}
  .ps-main::before{left:0;}
  .row2{grid-template-columns:1fr;}
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function hasValue(v) {
  if (Array.isArray(v)) return v.length > 0;
  return v !== "" && v !== null && v !== undefined;
}

function Fld({ value, children, style }) {
  return (
    <div className={`fld${hasValue(value) ? " has-value" : ""}`} style={style}>
      {children}
    </div>
  );
}

// ── KEY FIX: safely extract a string field from profile data ──────────────────
// Checks both p.field and falls back to empty string — never leaves undefined
function str(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const mainRef = useRef(null);

  const [step, setStep] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [err, setErr] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  // ── Fetch existing profile on mount and pre-fill form ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/api/auth/profile");
        if (cancelled) return;
        // console.log("Fetched profile data:", data);

        // ── KEY FIX: Support both flat and nested response shapes ──
        // API might return { profile: {...} } OR { gender, age, ... } directly
        const p = data.profile || data || {};

        const merged = {
          age: str(p.age),
          gender: str(p.gender),
          city: str(p.city),
          state: str(p.state),
          country: str(p.country) || "India",
          education: str(p.education),
          currentStatus: str(p.currentStatus),
          profession: str(p.profession),
          goals: str(p.goals),
          challenges: str(p.challenges),
          interests: Array.isArray(p.interests) ? p.interests : [],
          preferredLanguage: str(p.preferredLanguage) || "English",

          // ✅ FIXED (family se read karo)
          fatherOccupation: str(p.family?.fatherOccupation),
          motherOccupation: str(p.family?.motherOccupation),

          siblings:
            Array.isArray(p.family?.siblings) && p.family.siblings.length
              ? p.family.siblings.map((s) => ({
                  relation: s.relation || "Brother",
                  occupation: s.occupation || "",
                  working: Boolean(s.working),
                }))
              : [],
        };

        setForm(merged);

        // Show green banner if any meaningful field was saved
        const anyFilled = Object.entries(merged).some(([k, v]) => {
          if (k === "country" || k === "preferredLanguage") return false; // defaults don't count
          return hasValue(v);
        });
        if (anyFilled) setPrefilled(true);
      } catch (e) {
        console.error("Profile fetch error:", e);
        // Silently ignore — user just won't get pre-filled fields
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upd = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const clear = () => setErr("");

  useEffect(() => {
    if (mainRef.current)
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const toggleInterest = (v) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(v)
        ? f.interests.filter((i) => i !== v)
        : [...f.interests, v],
    }));

  const addSibling = () =>
    setForm((f) => ({
      ...f,
      siblings: [
        ...f.siblings,
        { relation: "Brother", occupation: "", working: false },
      ],
    }));
  const updSibling = (i, k, v) =>
    setForm((f) => {
      const s = [...f.siblings];
      s[i] = { ...s[i], [k]: v };
      return { ...f, siblings: s };
    });
  const delSibling = (i) =>
    setForm((f) => ({ ...f, siblings: f.siblings.filter((_, j) => j !== i) }));

  const curIdx = STEPS.indexOf(step);
  const pct = Math.round((curIdx / (STEPS.length - 1)) * 100);

  const advance = async (e) => {
    e.preventDefault();
    clear();
    const next = STEPS[curIdx + 1];
    if (next) {
      setStep(next);
      return;
    }
    await save();
  };

  const skip = async () => {
    clear();
    const next = STEPS[curIdx + 1];
    if (next) {
      setStep(next);
      return;
    }
    await save();
  };

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        siblings: form.siblings.map((s) => ({
          relation: s.relation || "",
          working: Boolean(s.working),
          occupation: s.occupation || "",
        })),
      };
      const data = await api("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      if (updateUser) updateUser(data.user);
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const head = STEP_HEADS[step];

  // ── Skeleton while loading ──
  if (fetching) {
    return (
      <>
        <style>{CSS}</style>
        <div className="ps-wrap">
          <aside className="ps-side">
            <div className="ps-logo">
              <div className="ps-logo-icon">
                <Ic.Book />
              </div>
              InDepth Reader
            </div>
            <div className="ps-welcome">
              <div className="ps-tag">Almost there</div>
              <h2>
                Welcome,
                <br />
                <span className="ps-name">
                  {user?.name?.split(" ")[0] || "Reader"}
                </span>
              </h2>
              <p>Loading your profile…</p>
            </div>
          </aside>
          <main className="ps-main" ref={mainRef}>
            <div className="ps-head">
              <div className="ps-step-tag">Loading…</div>
              <h1>Fetching your profile</h1>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="skel"
                style={{
                  width: i % 2 === 0 ? "60%" : "100%",
                  opacity: 1 - i * 0.15,
                }}
              />
            ))}
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ps-wrap">
        {/* ── Sidebar ── */}
        <aside className="ps-side">
          <div className="ps-logo">
            <div className="ps-logo-icon">
              <Ic.Book />
            </div>
            InDepth Reader
          </div>

          <div className="ps-welcome">
            <div className="ps-tag">Almost there</div>
            <h2>
              Welcome,
              <br />
              <span className="ps-name">
                {user?.name?.split(" ")[0] || "Reader"}
              </span>
            </h2>
            <p>
              Set up your profile once to unlock fully personalised AI coaching
              across every book you read.
            </p>
          </div>

          <div className="ps-steps">
            {STEPS.map((s, i) => {
              const ci = STEPS.indexOf(step);
              const st = i < ci ? "done" : i === ci ? "active" : "future";
              return (
                <div key={s} className={`ps-step ${st}`}>
                  <div className="ps-step-icon">
                    {st === "done" ? <Ic.Check /> : STEP_META[s].icon}
                  </div>
                  <div className="ps-step-info">
                    <div className="ps-step-label">{STEP_META[s].label}</div>
                    <div className="ps-step-sub">
                      {st === "done"
                        ? "Saved"
                        : st === "active"
                          ? "In progress"
                          : "Up next"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ps-pbar">
            <div className="ps-pbar-row">
              <span>Profile complete</span>
              <span>{pct}%</span>
            </div>
            <div className="ps-pbar-track">
              <div className="ps-pbar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ps-main" ref={mainRef}>
          <div className="ps-head">
            <div className="ps-step-tag">{head.tag}</div>
            <h1>{head.title}</h1>
            <p>{head.sub}</p>
          </div>

          {prefilled && (
            <div className="ps-prefill-banner">
              <div className="ps-prefill-dot" />
              Your previously saved info has been loaded — just update what's
              changed.
            </div>
          )}

          {err && <div className="msg msg-err">{err}</div>}

          <div className="form-anim" key={step}>
            {/* ── PROFILE ── */}
            {step === "profile" && (
              <form onSubmit={advance}>
                <div className="sec">
                  <Ic.User />
                  Personal
                </div>
                <div className="row2">
                  <Fld value={form.age}>
                    <label className="lbl">Age</label>
                    <div className="iw ni">
                      <input
                        name="age"
                        type="number"
                        min="10"
                        max="90"
                        value={form.age}
                        onChange={upd}
                        placeholder="25"
                      />
                    </div>
                  </Fld>
                  <Fld value={form.gender}>
                    <label className="lbl">Gender</label>
                    <div className="iw ni">
                      <select name="gender" value={form.gender} onChange={upd}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                      <span className="sarr">
                        <Ic.Chevron />
                      </span>
                    </div>
                  </Fld>
                </div>

                <div className="sec">
                  <Ic.MapPin />
                  Location
                </div>
                <div className="row2">
                  <Fld value={form.city}>
                    <label className="lbl">City</label>
                    <div className="iw ni">
                      <input
                        name="city"
                        value={form.city}
                        onChange={upd}
                        placeholder="Mumbai"
                      />
                    </div>
                  </Fld>
                  <Fld value={form.state}>
                    <label className="lbl">State</label>
                    <div className="iw ni">
                      <input
                        name="state"
                        value={form.state}
                        onChange={upd}
                        placeholder="Maharashtra"
                      />
                    </div>
                  </Fld>
                </div>
                <Fld value={form.country}>
                  <label className="lbl">Country</label>
                  <div className="iw ni">
                    <input
                      name="country"
                      value={form.country}
                      onChange={upd}
                      placeholder="India"
                    />
                  </div>
                </Fld>

                <div className="btn-row">
                  <button className="btn-primary" type="submit">
                    <span>Continue</span>
                    <Ic.Arrow />
                  </button>
                  <button className="btn-skip" type="button" onClick={skip}>
                    Skip
                  </button>
                </div>
              </form>
            )}

            {/* ── CAREER ── */}
            {step === "career" && (
              <form onSubmit={advance}>
                <div className="sec">
                  <Ic.Briefcase />
                  Education
                </div>
                <Fld value={form.education}>
                  <label className="lbl">Highest education</label>
                  <div className="iw ni">
                    <input
                      name="education"
                      value={form.education}
                      onChange={upd}
                      placeholder="B.Tech / MBA / 12th Pass..."
                    />
                  </div>
                </Fld>

                <div className="sec">
                  <Ic.Briefcase />
                  Current situation
                </div>
                <div className="row2">
                  <Fld value={form.currentStatus}>
                    <label className="lbl">Current status</label>
                    <div className="iw ni">
                      <select
                        name="currentStatus"
                        value={form.currentStatus}
                        onChange={upd}
                      >
                        <option value="">Select</option>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <span className="sarr">
                        <Ic.Chevron />
                      </span>
                    </div>
                  </Fld>
                  <Fld value={form.profession}>
                    <label className="lbl">Profession / Field</label>
                    <div className="iw ni">
                      <input
                        name="profession"
                        value={form.profession}
                        onChange={upd}
                        placeholder="Software engineer, Sales..."
                      />
                    </div>
                  </Fld>
                </div>

                <div className="sec">
                  <Ic.Globe />
                  Language
                </div>
                <Fld value={form.preferredLanguage}>
                  <label className="lbl">
                    Preferred language for AI coaching
                  </label>
                  <div className="iw ni">
                    <select
                      name="preferredLanguage"
                      value={form.preferredLanguage}
                      onChange={upd}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <span className="sarr">
                      <Ic.Chevron />
                    </span>
                  </div>
                </Fld>

                <div className="btn-row">
                  <button className="btn-primary" type="submit">
                    <span>Continue</span>
                    <Ic.Arrow />
                  </button>
                  <button className="btn-skip" type="button" onClick={skip}>
                    Skip
                  </button>
                </div>
              </form>
            )}

            {/* ── GOALS ── */}
            {step === "goals" && (
              <form onSubmit={advance}>
                <div className="sec">
                  <Ic.Target />
                  Ambitions
                </div>
                <Fld value={form.goals}>
                  <label className="lbl">Main goal (next 6 months)</label>
                  <div className="iw ni">
                    <textarea
                      name="goals"
                      value={form.goals}
                      onChange={upd}
                      placeholder="What do you want to achieve? Be specific."
                      maxLength={300}
                    />
                  </div>
                  <div className="char">{form.goals.length}/300</div>
                </Fld>
                <Fld value={form.challenges}>
                  <label className="lbl">Current challenges</label>
                  <div className="iw ni">
                    <textarea
                      name="challenges"
                      value={form.challenges}
                      onChange={upd}
                      placeholder="What's blocking you right now?"
                      maxLength={300}
                    />
                  </div>
                  <div className="char">{form.challenges.length}/300</div>
                </Fld>

                <div className="sec">
                  <Ic.Target />
                  Reading interests
                </div>
                <div className="fld" style={{ position: "relative" }}>
                  {form.interests.length > 0 && (
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--green)",
                        marginBottom: 6,
                      }}
                    >
                      ✓ {form.interests.length} interest
                      {form.interests.length > 1 ? "s" : ""} saved
                    </div>
                  )}
                  <div className="chips">
                    {INTERESTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`chip ${form.interests.includes(t) ? "sel" : ""}`}
                        onClick={() => toggleInterest(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="btn-row">
                  <button className="btn-primary" type="submit">
                    <span>Continue</span>
                    <Ic.Arrow />
                  </button>
                  <button className="btn-skip" type="button" onClick={skip}>
                    Skip
                  </button>
                </div>
              </form>
            )}

            {/* ── FAMILY ── */}
            {step === "family" && (
              <form onSubmit={advance}>
                <div className="sec">
                  <Ic.Users />
                  Parents
                </div>
                <Fld value={form.fatherOccupation}>
                  <label className="lbl">Father's occupation</label>
                  <div className="iw ni">
                    <input
                      name="fatherOccupation"
                      value={form.fatherOccupation}
                      onChange={upd}
                      placeholder="e.g. Farmer, Government employee, Business..."
                    />
                  </div>
                </Fld>
                <Fld value={form.motherOccupation}>
                  <label className="lbl">Mother's occupation</label>
                  <div className="iw ni">
                    <input
                      name="motherOccupation"
                      value={form.motherOccupation}
                      onChange={upd}
                      placeholder="e.g. Homemaker, Teacher, Business..."
                    />
                  </div>
                </Fld>

                <div className="btn-row">
                  <button className="btn-primary" type="submit">
                    <span>Continue</span>
                    <Ic.Arrow />
                  </button>
                  <button className="btn-skip" type="button" onClick={skip}>
                    Skip
                  </button>
                </div>
              </form>
            )}

            {/* ── SIBLINGS ── */}
            {step === "siblings" && (
              <form onSubmit={advance}>
                {form.siblings.length > 0 && prefilled && (
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--green)",
                      marginBottom: 12,
                    }}
                  >
                    ✓ {form.siblings.length} sibling
                    {form.siblings.length > 1 ? "s" : ""} loaded from your
                    profile — update as needed.
                  </div>
                )}

                {form.siblings.map((sib, i) => (
                  <div className="sib-card" key={i}>
                    <div className="sib-head">
                      <span className="sib-num">Sibling {i + 1}</span>
                      <button
                        type="button"
                        className="sib-del"
                        onClick={() => delSibling(i)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="row2" style={{ marginBottom: 8 }}>
                      <div className="fld" style={{ margin: 0 }}>
                        <label className="lbl">Relation</label>
                        <div className="iw ni">
                          <select
                            value={sib.relation}
                            onChange={(e) =>
                              updSibling(i, "relation", e.target.value)
                            }
                          >
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                          </select>
                          <span className="sarr">
                            <Ic.Chevron />
                          </span>
                        </div>
                      </div>
                      <div className="fld" style={{ margin: 0 }}>
                        <label className="lbl">Working?</label>
                        <div className="iw ni">
                          <select
                            value={sib.working ? "yes" : "no"}
                            onChange={(e) =>
                              updSibling(i, "working", e.target.value === "yes")
                            }
                          >
                            <option value="no">No / Student</option>
                            <option value="yes">Yes, working</option>
                          </select>
                          <span className="sarr">
                            <Ic.Chevron />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="fld" style={{ margin: 0 }}>
                      <label className="lbl">Occupation / Field</label>
                      <div className="iw ni">
                        <input
                          value={sib.occupation}
                          onChange={(e) =>
                            updSibling(i, "occupation", e.target.value)
                          }
                          placeholder="e.g. Engineer, Student, Business..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {form.siblings.length < 6 && (
                  <button
                    type="button"
                    className="add-sib"
                    onClick={addSibling}
                  >
                    + Add sibling
                  </button>
                )}

                <div className="btn-row">
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spin" />
                    ) : (
                      <>
                        <span>Save & Finish</span>
                        <Ic.Check />
                      </>
                    )}
                  </button>
                  <button
                    className="btn-skip"
                    type="button"
                    onClick={skip}
                    disabled={loading}
                  >
                    Skip
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

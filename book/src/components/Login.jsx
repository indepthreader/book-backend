import { useState, useEffect, useRef } from "react";
import { API_URL, api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = {
  Mail: () => (
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
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
  Phone: () => (
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Lock: () => (
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
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Key: () => (
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
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  ),
  Google: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  Book: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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
  Eye: () => (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
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
  Zap: () => (
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  UserMinus: () => (
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  Home: () => (
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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
const SIBLING_ROLES = ["Brother", "Sister"];
const STEPS_NEW = ["email", "basic", "profile", "family", "siblings", "otp"];
const STEPS_EX = ["email", "otp"];

const STEP_META = {
  email: { label: "Start", icon: null },
  basic: { label: "Account", icon: <Ic.User /> },
  profile: { label: "Profile", icon: <Ic.Target /> },
  family: { label: "Family", icon: <Ic.Users /> },
  siblings: { label: "Siblings", icon: <Ic.Heart /> },
  otp: { label: "Verify", icon: <Ic.Key /> },
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root {
  --bg:       #0c0c0d;
  --s1:       #131315;
  --s2:       #1a1a1d;
  --s3:       #222226;
  --b1:       rgba(255,255,255,0.06);
  --b2:       rgba(255,255,255,0.10);
  --b3:       rgba(255,255,255,0.16);
  --txt:      #f2f0eb;
  --txt2:     #9996a0;
  --txt3:     #55535e;
  --red:      #e63946;
  --red2:     #ff6b6b;
  --red-dim:  rgba(230,57,70,0.08);
  --red-b:    rgba(230,57,70,0.22);
  --red-glow: rgba(230,57,70,0.15);
  --red-deep: #c1121f;
  --green:    #52b788;
  --amber:    #e9c46a;
  --r:        10px;
  --r2:       14px;
  --serif:    'Syne', system-ui, sans-serif;
  --sans:     'Outfit', system-ui, sans-serif;
}

html,body{background:var(--bg);color:var(--txt);font-family:var(--sans);}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 var(--red-glow); }
  50%      { box-shadow: 0 0 0 8px transparent; }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes slideIn {
  from { opacity:0; transform:translateX(18px); }
  to   { opacity:1; transform:translateX(0); }
}

.page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 420px;
  animation: fadeIn 0.4s ease;
}

/* ─── HERO ─── */
.hero {
  position: relative;
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-right: 1px solid var(--b1);
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 10% 70%, rgba(230,57,70,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 400px 300px at 90% 15%, rgba(230,57,70,0.04) 0%, transparent 55%),
    radial-gradient(ellipse 800px 600px at 50% 50%, rgba(20,0,0,0.3) 0%, transparent 70%);
  pointer-events: none;
}
.hero-grid-bg {
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image:
    linear-gradient(var(--b3) 1px, transparent 1px),
    linear-gradient(90deg, var(--b3) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
}

.hlogo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--red2);
  font-family: var(--serif);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  position: relative;
}
.hlogo-icon {
  width: 36px; height: 36px;
  background: var(--red-dim);
  border: 1px solid var(--red-b);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--red2);
}

.hcontent { position: relative; max-width: 520px; }

.htag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--red2);
  background: var(--red-dim); border: 1px solid var(--red-b);
  border-radius: 100px; padding: 4px 12px; margin-bottom: 20px;
}
.htag::before {
  content: '';
  width: 6px; height: 6px;
  background: var(--red);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.htitle {
  font-family: var(--serif);
  font-size: clamp(2rem, 3.4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--txt);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.htitle .accent { color: var(--red); }
.htitle .italic { font-style: italic; color: var(--txt2); }

.hsub {
  font-size: 0.9rem;
  color: var(--txt2);
  line-height: 1.75;
  margin-bottom: 36px;
  max-width: 420px;
  font-weight: 300;
}

.feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.feat {
  background: var(--s1);
  border: 1px solid var(--b1);
  border-radius: var(--r2);
  padding: 16px;
  transition: border-color 0.2s, transform 0.2s;
}
.feat:hover { border-color: var(--b2); transform: translateY(-1px); }
.feat-tag {
  display: flex; align-items: center; gap: 6px;
  color: var(--red2); font-size: 0.63rem;
  font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; margin-bottom: 8px;
}
.feat h4 { font-size: 0.82rem; font-weight: 500; color: var(--txt); margin-bottom: 4px; }
.feat p  { font-size: 0.75rem; color: var(--txt2); line-height: 1.6; font-weight: 300; }

.hfoot {
  position: relative;
  display: flex; align-items: center; gap: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--b1);
}
.hstat .n { font-family: var(--serif); font-size: 1.5rem; font-weight: 700; color: var(--txt); line-height: 1; }
.hstat .l { font-size: 0.67rem; color: var(--txt3); margin-top: 3px; letter-spacing: 0.04em; }
.hdiv { width: 1px; height: 30px; background: var(--b1); }

/* ─── AUTH PANEL ─── */
.panel {
  background: var(--s1);
  display: flex; flex-direction: column; justify-content: center;
  padding: 40px 34px;
  position: relative; overflow-y: auto;
  border-left: 1px solid var(--b1);
}
.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--red-deep), var(--red), var(--red2));
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

.ptop { margin-bottom: 20px; }
.plabel {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--red); margin-bottom: 4px;
}
.ptitle {
  font-family: var(--serif);
  font-size: 1.7rem; font-weight: 700;
  color: var(--txt); line-height: 1.15;
  letter-spacing: -0.01em;
}

/* step indicator */
.steps {
  display: flex; align-items: center;
  gap: 0; margin-bottom: 20px;
  background: var(--s2); border: 1px solid var(--b1);
  border-radius: 100px; padding: 4px;
}
.step-dot {
  flex: 1; display: flex; align-items: center; justify-content: center;
  gap: 5px; padding: 5px 8px; border-radius: 100px;
  font-size: 0.63rem; font-weight: 500; letter-spacing: 0.04em;
  color: var(--txt3); transition: all 0.25s; white-space: nowrap;
}
.step-dot.active {
  background: var(--red); color: #fff;
  box-shadow: 0 0 12px var(--red-glow);
}
.step-dot.done { color: var(--green); }

/* progress bar */
.pbar { margin-bottom: 18px; }
.pbar-row {
  display: flex; justify-content: space-between;
  font-size: 0.67rem; color: var(--txt3); margin-bottom: 6px;
}
.pbar-track { height: 2px; background: var(--b1); border-radius: 2px; overflow: hidden; }
.pbar-fill  {
  height: 100%; background: linear-gradient(90deg, var(--red-deep), var(--red2));
  border-radius: 2px; transition: width 0.4s cubic-bezier(.4,0,.2,1);
}

/* back btn */
.back {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.72rem; color: var(--txt3); cursor: pointer;
  background: none; border: none; padding: 0; margin-bottom: 14px;
  font-family: var(--sans); transition: color 0.18s; letter-spacing: 0.02em;
}
.back:hover { color: var(--txt); }

/* form anim */
.form-wrap { animation: slideIn 0.25s ease; }

/* google btn */
.goog {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px;
  padding: 11px; border-radius: var(--r); border: 1px solid var(--b2);
  background: var(--s2); color: var(--txt); font-family: var(--sans);
  font-size: 0.84rem; font-weight: 400; cursor: pointer;
  transition: all 0.18s; margin-bottom: 16px;
  letter-spacing: 0.01em;
}
.goog:hover { border-color: var(--b3); background: var(--s3); }

.div-line {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px; color: var(--txt3); font-size: 0.7rem;
}
.div-line::before,.div-line::after {
  content: ''; flex: 1; height: 1px; background: var(--b1);
}

/* section label */
.sec {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--txt3); margin: 14px 0 10px;
}
.sec::after { content: ''; flex: 1; height: 1px; background: var(--b1); }
.sec svg { color: var(--red); }

/* fields */
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.fld { margin-bottom: 10px; }
.lbl {
  display: block; font-size: 0.68rem; font-weight: 500;
  color: var(--txt2); margin-bottom: 5px; letter-spacing: 0.04em;
}
.iw { position: relative; display: flex; align-items: center; }
.ii {
  position: absolute; left: 12px; color: var(--txt3);
  display: flex; align-items: center; pointer-events: none;
  z-index: 1;
}
.iend {
  position: absolute; right: 11px; color: var(--txt3);
  display: flex; align-items: center; cursor: pointer; z-index: 1;
  background: none; border: none; padding: 2px; transition: color 0.18s;
}
.iend:hover { color: var(--txt); }
.iw input,.iw select,.iw textarea {
  width: 100%; padding: 10px 12px 10px 36px;
  background: var(--bg); border: 1px solid var(--b1);
  border-radius: var(--r); color: var(--txt);
  font-family: var(--sans); font-size: 0.855rem; font-weight: 400;
  transition: border-color 0.18s, box-shadow 0.18s;
  outline: none; -webkit-appearance: none; appearance: none;
}
.iw.ni input,.iw.ni select,.iw.ni textarea { padding-left: 12px; }
.iw select { cursor: pointer; padding-right: 28px; }
.sarr { position: absolute; right: 9px; color: var(--txt3); pointer-events: none; }
.iw textarea { resize: vertical; min-height: 68px; padding-top: 10px; line-height: 1.55; }
.iw input::placeholder,.iw select::placeholder,.iw textarea::placeholder { color: var(--txt3); }
.iw select option { background: var(--s2); color: var(--txt); }
.iw input:focus,.iw select:focus,.iw textarea:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 3px var(--red-dim);
}
.iw input:focus + .ii,.iw select:focus + .ii { color: var(--red); }

/* otp input */
.otp-iw input {
  letter-spacing: 0.4em; font-size: 1.3rem; font-family: var(--serif);
  text-align: center; font-weight: 700;
}

/* hint */
.hint {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 12px; background: var(--s2);
  border: 1px solid var(--b1); border-radius: var(--r);
  margin-bottom: 12px; font-size: 0.8rem; color: var(--txt2);
}
.hint svg { color: var(--red2); flex-shrink: 0; }

/* primary btn */
.btn {
  width: 100%; padding: 12px; margin-top: 6px;
  border-radius: var(--r); border: none;
  background: linear-gradient(135deg, var(--red-deep) 0%, var(--red) 50%, var(--red2) 100%);
  background-size: 200% 100%;
  color: #fff; font-family: var(--sans); font-size: 0.875rem;
  font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.22s; letter-spacing: 0.02em;
  box-shadow: 0 4px 20px rgba(230,57,70,0.2);
}
.btn:hover:not(:disabled) {
  background-position: right center;
  box-shadow: 0 6px 28px rgba(230,57,70,0.35);
  transform: translateY(-1px);
}
.btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 10px rgba(230,57,70,0.2); }
.btn:disabled { opacity: 0.38; cursor: not-allowed; box-shadow: none; }

/* messages */
.msg {
  margin-top: 10px; padding: 10px 13px;
  border-radius: var(--r); font-size: 0.79rem; line-height: 1.6;
  border-left: 3px solid transparent;
  border: 1px solid transparent;
  animation: fadeUp 0.2s ease;
}
.msg-err {
  background: var(--red-dim); color: #f8a0a6;
  border-left: 3px solid var(--red) !important;
  border-top-color: var(--red-b) !important;
  border-right-color: var(--red-b) !important;
  border-bottom-color: var(--red-b) !important;
  box-shadow: 0 0 20px var(--red-glow);
}
.msg-ok {
  background: rgba(82,183,136,0.08); color: var(--green);
  border-left: 3px solid var(--green) !important;
  border-top-color: rgba(82,183,136,0.2) !important;
  border-right-color: rgba(82,183,136,0.2) !important;
  border-bottom-color: rgba(82,183,136,0.2) !important;
}

/* interest chips */
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.chip {
  padding: 5px 12px; border-radius: 100px;
  border: 1px solid var(--b1); background: transparent;
  color: var(--txt2); font-size: 0.73rem; font-family: var(--sans);
  cursor: pointer; transition: all 0.15s; font-weight: 400;
}
.chip:hover { border-color: var(--b2); color: var(--txt); }
.chip.sel {
  background: var(--red-dim); border-color: var(--red-b);
  color: var(--red2);
}

/* sibling row */
.sib-row {
  display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px;
  align-items: end; margin-bottom: 8px;
  animation: fadeUp 0.2s ease;
}
.sib-row .del {
  height: 38px; width: 38px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; border: 1px solid var(--red-b);
  background: var(--red-dim); color: var(--red);
  cursor: pointer; font-size: 1.1rem; transition: all 0.15s;
  font-family: monospace; flex-shrink: 0;
}
.sib-row .del:hover { background: rgba(230,57,70,0.15); }
.add-sib {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.76rem; color: var(--red2); cursor: pointer;
  background: none; border: none; font-family: var(--sans);
  padding: 6px 0; transition: opacity 0.18s;
}
.add-sib:hover { opacity: 0.75; }

/* helper */
.helper { font-size: 0.74rem; color: var(--txt3); line-height: 1.65; margin-bottom: 12px; }

/* spinner */
.spin {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.6s linear infinite;
}

/* char count */
.char { font-size: 0.63rem; color: var(--txt3); text-align: right; margin-top: 3px; }

/* strength meter */
.strength { display: flex; gap: 4px; margin-top: 5px; }
.sb { flex: 1; height: 3px; border-radius: 2px; background: var(--b1); transition: background 0.3s; }

@media (max-width: 820px) {
  .page { grid-template-columns: 1fr; }
  .hero { display: none; }
  .panel { padding: 32px 18px; min-height: 100vh; justify-content: flex-start; padding-top: 48px; border-left: none; }
}
@media (max-width: 380px) {
  .row2 { grid-template-columns: 1fr; }
  .steps { gap: 2px; }
  .step-dot { font-size: 0; padding: 6px 8px; }
  .step-dot svg { display: block; }
}
`;

// ── Password strength ─────────────────────────────────────────────────────────
function pwStrength(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const STR_COLORS = ["", "#e63946", "#e9c46a", "#e9c46a", "#52b788", "#52b788"];

function normalizeSpaces(value) {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeTextField(name, value) {
  const limitMap = {
    name: 60,
    city: 50,
    state: 50,
    country: 50,
    education: 80,
    profession: 80,
    fatherOccupation: 80,
    motherOccupation: 80,
  };

  if (name === "phone") {
    return value.replace(/\D/g, "").slice(0, 15);
  }

  if (name === "otp") {
    return value.replace(/\D/g, "").slice(0, 6);
  }

  if (name === "age") {
    return value.replace(/\D/g, "").slice(0, 2);
  }

  if (limitMap[name]) {
    return value.slice(0, limitMap[name]);
  }

  return value;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Login() {
  const { saveSession } = useAuth();
  const panelRef = useRef(null);

  const [step, setStep] = useState("email");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    otp: "",
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
  });

  const upd = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: sanitizeTextField(e.target.name, e.target.value),
    }));
  const clear = () => {
    setErr("");
    setInfo("");
  };

  // scroll panel to top on step change
  useEffect(() => {
    if (panelRef.current)
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const toggleInterest = (v) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(v)
        ? f.interests.filter((i) => i !== v)
        : [...f.interests, v],
    }));

  // siblings — shape matches schema: { relation, working, occupation }
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
      s[i] = {
        ...s[i],
        [k]:
          k === "occupation"
            ? String(v).slice(0, 80)
            : v,
      };
      return { ...f, siblings: s };
    });
  const delSibling = (i) =>
    setForm((f) => ({ ...f, siblings: f.siblings.filter((_, j) => j !== i) }));

  // ── Email check ──
  const handleEmail = async (e) => {
    e.preventDefault();
    clear();
    if (!form.email.trim()) return setErr("Email is required.");
    setLoading(true);
    try {
      const res = await api("/api/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      if (res.needsAdditionalInfo) {
        setIsNew(true);
        setStep("basic");
      } else {
        setIsNew(false);
        await doSendOtp({ email: form.email });
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Basic ──
  const handleBasic = (e) => {
    e.preventDefault();
    clear();
    const cleanName = normalizeSpaces(form.name);
    if (!cleanName) return setErr("Name is required.");
    if (cleanName.length < 3) return setErr("Name must be at least 3 characters.");
    if (!/^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(cleanName)) {
      return setErr("Name can contain only letters, spaces, dot, apostrophe, and hyphen.");
    }
    if (!form.phone.trim()) return setErr("Phone number is required.");
    if (form.phone.length < 10 || form.phone.length > 15) {
      return setErr("Phone number must be 10 to 15 digits.");
    }
    if (form.password.length < 6)
      return setErr("Password must be at least 6 characters.");
    setForm((f) => ({ ...f, name: cleanName }));
    setStep("profile");
  };

  // ── Profile ──
  const handleProfile = (e) => {
    e.preventDefault();
    clear();
    if (form.age && (Number(form.age) < 10 || Number(form.age) > 90)) {
      return setErr("Age must be between 10 and 90.");
    }
    if (form.city.trim() && normalizeSpaces(form.city).length < 2) {
      return setErr("City must be at least 2 characters.");
    }
    if (form.state.trim() && normalizeSpaces(form.state).length < 2) {
      return setErr("State must be at least 2 characters.");
    }
    if (form.country.trim() && normalizeSpaces(form.country).length < 2) {
      return setErr("Country must be at least 2 characters.");
    }
    setStep("family");
  };

  // ── Family ──
  const handleFamily = (e) => {
    e.preventDefault();
    clear();
    if (
      form.fatherOccupation.trim() &&
      normalizeSpaces(form.fatherOccupation).length < 2
    ) {
      return setErr("Father occupation must be at least 2 characters.");
    }
    if (
      form.motherOccupation.trim() &&
      normalizeSpaces(form.motherOccupation).length < 2
    ) {
      return setErr("Mother occupation must be at least 2 characters.");
    }
    setStep("siblings");
  };

  // ── Siblings → send OTP ──
  const handleSiblings = async (e) => {
    e.preventDefault();
    clear();
    const invalidSibling = form.siblings.find(
      (sib) =>
        sib.occupation.trim() &&
        normalizeSpaces(sib.occupation).length < 2,
    );
    if (invalidSibling) {
      return setErr("Each sibling occupation must be at least 2 characters.");
    }
    setLoading(true);
    try {
      await doSendOtp(form);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP — build payload matching backend's expected flat structure ──
  const doSendOtp = async (f) => {
    // For existing users just send email
    const isExisting = !isNew && f === form ? false : isNew;
    const payload = isNew
      ? {
          email: f.email.trim(),
          // basic
          name: normalizeSpaces(f.name),
          phone: f.phone,
          password: f.password,
          // profile (flat — backend nests them into profile{})
          age: f.age,
          gender: f.gender,
          city: normalizeSpaces(f.city),
          state: normalizeSpaces(f.state),
          country: normalizeSpaces(f.country),
          education: normalizeSpaces(f.education),
          currentStatus: f.currentStatus,
          profession: normalizeSpaces(f.profession),
          goals: normalizeSpaces(f.goals),
          challenges: normalizeSpaces(f.challenges),
          interests: f.interests,
          preferredLanguage: f.preferredLanguage,
          // family (flat — backend nests into profile.family{})
          fatherOccupation: normalizeSpaces(f.fatherOccupation),
          motherOccupation: normalizeSpaces(f.motherOccupation),
          // siblings: [{relation, working, occupation}] — already correct shape
          siblings: f.siblings.map((sib) => ({
            ...sib,
            occupation: normalizeSpaces(sib.occupation || ""),
          })),
        }
      : { email: f.email.trim() };

    const data = await api("/api/auth/otp/request", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setStep("otp");
    setInfo(data.message || "OTP sent to your email.");
  };

  // ── OTP verify ──
  const handleOtp = async (e) => {
    e.preventDefault();
    clear();
    if (!form.otp.trim()) return setErr("Please enter the OTP.");
    if (form.otp.trim().length !== 6) return setErr("OTP must be 6 digits.");
    setLoading(true);
    try {
      const data = await api("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      saveSession(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ──
  const handleResend = async () => {
    clear();
    setLoading(true);
    try {
      await doSendOtp(form);
      setInfo("New OTP sent.");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Back ──
  const goBack = () => {
    clear();
    if (step === "otp" && isNew) return setStep("siblings");
    if (step === "siblings") return setStep("family");
    if (step === "family") return setStep("profile");
    if (step === "profile") return setStep("basic");
    return setStep("email");
  };

  // ── Progress ──
  const allSteps = isNew ? STEPS_NEW : STEPS_EX;
  const curIdx = allSteps.indexOf(step);
  const pct =
    allSteps.length > 1
      ? Math.round((curIdx / (allSteps.length - 1)) * 100)
      : 0;
  const pwStr = pwStrength(form.password);

  const TITLES = {
    email: "Welcome back",
    basic: "Create account",
    profile: "Your profile",
    family: "Family background",
    siblings: "Your siblings",
    otp: "Verify email",
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        {/* ── HERO ── */}
        <aside className="hero">
          <div className="hero-grid-bg" />

          <div className="hlogo">
            <div className="hlogo-icon">
              <Ic.Book />
            </div>
            InDepth Reader
          </div>

          <div className="hcontent">
            <div className="htag">AI-powered reading workspace</div>
            <h1 className="htitle">
              Read deeper.
              <br />
              <span className="accent">Think</span> sharper.
              <br />
              <span className="italic">Apply faster.</span>
            </h1>
            <p className="hsub">
              Upload books, get AI coaching tailored to your profession and
              goals, track your progress, and join a community of serious
              learners.
            </p>
            <div className="feat-grid">
              {[
                {
                  icon: <Ic.Zap />,
                  tag: "AI Coach",
                  title: "Personalised Insights",
                  body: "Coaching specific to your profession, goals, and challenges — not generic summaries.",
                },
                {
                  icon: <Ic.Globe />,
                  tag: "Languages",
                  title: "Hindi & English",
                  body: "Full support for Hindi, Hinglish, Marathi, Gujarati, and 6 more languages.",
                },
                {
                  icon: <Ic.Shield />,
                  tag: "Privacy",
                  title: "Your data, secured",
                  body: "Uploaded content and profile info power your experience only. Never sold.",
                },
                {
                  icon: <Ic.Heart />,
                  tag: "Plans",
                  title: "₹149 / month",
                  body: "7-day free trial. Cancel anytime. Full access from day one.",
                },
              ].map((f) => (
                <div className="feat" key={f.tag}>
                  <div className="feat-tag">
                    {f.icon}
                    {f.tag}
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hfoot">
            <div className="hstat">
              <div className="n">10+</div>
              <div className="l">Indian languages</div>
            </div>
            <div className="hdiv" />
            <div className="hstat">
              <div className="n">GPT & Gemini</div>
              <div className="l">AI providers</div>
            </div>
            <div className="hdiv" />
            <div className="hstat">
              <div className="n">PDF & DOCX</div>
              <div className="l">Book formats</div>
            </div>
          </div>
        </aside>

        {/* ── PANEL ── */}
        <main className="panel" ref={panelRef}>
          <div className="ptop">
            <p className="plabel">InDepth Reader</p>
            <h2 className="ptitle">{TITLES[step]}</h2>
          </div>

          {/* Step indicator — new user */}
          {isNew && step !== "email" && (
            <div className="steps">
              {STEPS_NEW.filter((s) => s !== "email").map((s, i) => {
                const si = STEPS_NEW.indexOf(s);
                const ci = STEPS_NEW.indexOf(step);
                return (
                  <div
                    key={s}
                    className={`step-dot ${si === ci ? "active" : si < ci ? "done" : ""}`}
                  >
                    {STEP_META[s].icon}
                    <span>{STEP_META[s].label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress bar */}
          {isNew && step !== "email" && (
            <div className="pbar">
              <div className="pbar-row">
                <span>{STEP_META[step].label}</span>
                <span>
                  {curIdx}/{allSteps.length - 1}
                </span>
              </div>
              <div className="pbar-track">
                <div className="pbar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {step !== "email" && (
            <button type="button" className="back" onClick={goBack}>
              ← Back
            </button>
          )}

          <div className="form-wrap" key={step}>
            {/* ── EMAIL ── */}
            {step === "email" && (
              <>
                <button
                  type="button"
                  className="goog"
                  onClick={() => {
                    window.location.href = `${API_URL}/api/auth/google`;
                  }}
                >
                  <Ic.Google /> Continue with Google
                </button>
                <div className="div-line">or continue with email</div>
                <form onSubmit={handleEmail}>
                  <div className="fld">
                    <label className="lbl">Email address</label>
                    <div className="iw">
                      <span className="ii">
                        <Ic.Mail />
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={upd}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? (
                      <span className="spin" />
                    ) : (
                      <>
                        <span>Continue</span>
                        <Ic.Arrow />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── BASIC ── */}
            {step === "basic" && (
              <form onSubmit={handleBasic}>
                <div className="hint">
                  <Ic.Mail />
                  <span>{form.email}</span>
                </div>
                <div className="fld">
                  <label className="lbl">Full name</label>
                  <div className="iw">
                    <span className="ii">
                      <Ic.User />
                    </span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={upd}
                      placeholder="Your full name"
                      autoComplete="name"
                      maxLength={60}
                      required
                    />
                  </div>
                </div>
                <div className="fld">
                  <label className="lbl">Phone number</label>
                  <div className="iw">
                    <span className="ii">
                      <Ic.Phone />
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={upd}
                      placeholder="9876543210"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={15}
                      required
                    />
                  </div>
                </div>
                <div className="fld">
                  <label className="lbl">Create password</label>
                  <div className="iw">
                    <span className="ii">
                      <Ic.Lock />
                    </span>
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={upd}
                      minLength={6}
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button
                      type="button"
                      className="iend"
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? <Ic.EyeOff /> : <Ic.Eye />}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="strength">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="sb"
                          style={{
                            background:
                              i <= pwStr ? STR_COLORS[pwStr] : undefined,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button className="btn" type="submit">
                  <span>Next: Your profile</span>
                  <Ic.Arrow />
                </button>
              </form>
            )}

            {/* ── PROFILE ── */}
            {step === "profile" && (
              <form onSubmit={handleProfile}>
                <div className="sec">
                  <Ic.User />
                  Personal
                </div>
                <div className="row2">
                  <div className="fld">
                    <label className="lbl">Age</label>
                    <div className="iw ni">
                      <input
                        name="age"
                        type="number"
                        min="10"
                        max="90"
                        value={form.age}
                        onChange={upd}
                        inputMode="numeric"
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <div className="fld">
                    <label className="lbl">Gender</label>
                    <div className="iw ni">
                      <select name="gender" value={form.gender} onChange={upd}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                      <span className="sarr">
                        <Ic.Chevron />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sec">
                  <Ic.MapPin />
                  Location
                </div>
                <div className="row2">
                  <div className="fld">
                    <label className="lbl">City</label>
                    <div className="iw ni">
                      <input
                        name="city"
                        value={form.city}
                        onChange={upd}
                        maxLength={50}
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>
                  <div className="fld">
                    <label className="lbl">State</label>
                    <div className="iw ni">
                      <input
                        name="state"
                        value={form.state}
                        onChange={upd}
                        maxLength={50}
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>
                </div>
                <div className="fld">
                  <label className="lbl">Country</label>
                  <div className="iw ni">
                    <input
                      name="country"
                      value={form.country}
                      onChange={upd}
                      maxLength={50}
                      placeholder="India"
                    />
                  </div>
                </div>

                <div className="sec">
                  <Ic.Briefcase />
                  Career
                </div>
                <div className="fld">
                  <label className="lbl">Education</label>
                  <div className="iw ni">
                    <input
                      name="education"
                      value={form.education}
                      onChange={upd}
                      maxLength={80}
                      placeholder="B.Tech / MBA / 12th..."
                    />
                  </div>
                </div>
                <div className="row2">
                  <div className="fld">
                    <label className="lbl">Current status</label>
                    <div className="iw ni">
                      <select
                        name="currentStatus"
                        value={form.currentStatus}
                        onChange={upd}
                      >
                        <option value="">Select</option>
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <span className="sarr">
                        <Ic.Chevron />
                      </span>
                    </div>
                  </div>
                  <div className="fld">
                    <label className="lbl">Profession / Field</label>
                    <div className="iw ni">
                      <input
                        name="profession"
                        value={form.profession}
                        onChange={upd}
                        maxLength={80}
                        placeholder="Software engineer..."
                      />
                    </div>
                  </div>
                </div>

                <div className="sec">
                  <Ic.Target />
                  Goals & Interests
                </div>
                <div className="fld">
                  <label className="lbl">Main goal</label>
                  <div className="iw ni">
                    <textarea
                      name="goals"
                      value={form.goals}
                      onChange={upd}
                      placeholder="What do you want to achieve in the next 6 months?"
                      maxLength={300}
                    />
                  </div>
                  <div className="char">{form.goals.length}/300</div>
                </div>
                <div className="fld">
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
                </div>
                <div className="fld">
                  <label className="lbl">Reading interests</label>
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
                <div className="fld">
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
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                    <span className="sarr">
                      <Ic.Chevron />
                    </span>
                  </div>
                </div>

                <button className="btn" type="submit">
                  <span>Next: Family background</span>
                  <Ic.Arrow />
                </button>
              </form>
            )}

            {/* ── FAMILY ── */}
            {step === "family" && (
              <form onSubmit={handleFamily}>
                <div className="sec">
                  <Ic.Users />
                  Family background
                </div>
                <p className="helper">
                  Helps the AI coach give more personalised, contextual advice
                  based on your background.
                </p>
                <div className="fld">
                  <label className="lbl">Father's occupation</label>
                  <div className="iw ni">
                    <input
                      name="fatherOccupation"
                      value={form.fatherOccupation}
                      onChange={upd}
                      maxLength={80}
                      placeholder="e.g. Farmer, Government employee, Business..."
                    />
                  </div>
                </div>
                <div className="fld">
                  <label className="lbl">Mother's occupation</label>
                  <div className="iw ni">
                    <input
                      name="motherOccupation"
                      value={form.motherOccupation}
                      onChange={upd}
                      maxLength={80}
                      placeholder="e.g. Homemaker, Teacher, Business..."
                    />
                  </div>
                </div>
                <button className="btn" type="submit">
                  <span>Next: Siblings</span>
                  <Ic.Arrow />
                </button>
              </form>
            )}

            {/* ── SIBLINGS ── */}
            {step === "siblings" && (
              <form onSubmit={handleSiblings}>
                <div className="sec">
                  <Ic.Heart />
                  Siblings
                </div>
                <p className="helper">
                  Add your siblings if any — helps the AI coach personalise
                  advice. Schema fields: relation, occupation, working.
                </p>

                {form.siblings.map((sib, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--s2)",
                      border: "1px solid var(--b1)",
                      borderRadius: "var(--r)",
                      padding: "12px",
                      marginBottom: "10px",
                      animation: "fadeUp 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--txt3)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Sibling {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => delSibling(i)}
                        style={{
                          background: "var(--red-dim)",
                          border: "1px solid var(--red-b)",
                          color: "var(--red)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          lineHeight: 1.4,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="row2" style={{ marginBottom: "8px" }}>
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
                    <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>{" "}
                    Add sibling
                  </button>
                )}

                <button
                  className="btn"
                  type="submit"
                  disabled={loading}
                  style={{ marginTop: 14 }}
                >
                  {loading ? (
                    <span className="spin" />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <Ic.Arrow />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleOtp}>
                <div className="hint">
                  <Ic.Mail />
                  <span>
                    OTP sent to <strong>{form.email}</strong>
                  </span>
                </div>
                <div className="fld">
                  <label className="lbl">6-digit OTP</label>
                  <div className="iw otp-iw">
                    <span className="ii">
                      <Ic.Key />
                    </span>
                    <input
                      name="otp"
                      value={form.otp}
                      onChange={upd}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="••••••"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="spin" />
                  ) : (
                    <>
                      <span>Verify & Sign in</span>
                      <Ic.Arrow />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="back"
                  style={{ marginTop: 13, marginBottom: 0 }}
                  onClick={handleResend}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </form>
            )}
          </div>
          {/* form-wrap */}

          {err && <div className="msg msg-err">{err}</div>}
          {info && !err && <div className="msg msg-ok">{info}</div>}
        </main>
      </div>
    </>
  );
}

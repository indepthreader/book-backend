// import { useEffect, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { api } from "../lib/api";

// // ─── Tool categories scroll bar ───────────────────────────────────────────────
// const TOOL_CATEGORIES = [
//   {
//     id: "story",
//     label: "📖 Story Coach",
//     color: "#ff4d5a",
//     desc: "Narrative & plot analysis",
//   },
//   {
//     id: "mindset",
//     label: "🧠 Mindset",
//     color: "#a855f7",
//     desc: "Mental models & beliefs",
//   },
//   {
//     id: "skills",
//     label: "⚡ Skills",
//     color: "#3b82f6",
//     desc: "Practical skill building",
//   },
//   {
//     id: "life",
//     label: "🌱 Life Lessons",
//     color: "#22c55e",
//     desc: "Deep life wisdom",
//   },
//   {
//     id: "career",
//     label: "💼 Career",
//     color: "#f59e0b",
//     desc: "Professional growth",
//   },
//   {
//     id: "finance",
//     label: "💰 Finance",
//     color: "#14b8a6",
//     desc: "Money & investment ideas",
//   },
//   {
//     id: "health",
//     label: "🏃 Health",
//     color: "#ef4444",
//     desc: "Physical & mental wellness",
//   },
//   {
//     id: "relation",
//     label: "❤️ Relationships",
//     color: "#ec4899",
//     desc: "People & communication",
//   },
//   {
//     id: "creative",
//     label: "🎨 Creativity",
//     color: "#f97316",
//     desc: "Ideas & innovation",
//   },
//   {
//     id: "focus",
//     label: "🎯 Deep Focus",
//     color: "#6366f1",
//     desc: "Concentration & flow",
//   },
// ];

// // ─── Section tabs ─────────────────────────────────────────────────────────────
// const TABS = [
//   { id: "insight", label: "💡 Insight", color: "#ff4d5a" },
//   { id: "relatableExamples", label: "🔗 Examples", color: "#a855f7" },
//   { id: "lifeLearnings", label: "🌱 Life Learnings", color: "#22c55e" },
//   { id: "developmentSuggestions", label: "⚡ Development", color: "#3b82f6" },
//   { id: "actionableQuestions", label: "❓ Questions", color: "#f59e0b" },
// ];

// // ─── Voice helpers ────────────────────────────────────────────────────────────
// function getTabText(answer, tabId) {
//   if (!answer) return "";
//   const val = answer[tabId];
//   if (!val) return "";
//   if (typeof val === "string") return val;
//   if (Array.isArray(val)) return val.join(". ");
//   return "";
// }

// function detectLang(...values) {
//   const combined = values.filter(Boolean).join(" ").trim();
//   if (!combined) return "";
//   if (/[ऀ-ॿ]/.test(combined) || /\b(hindi|hinglish)\b/i.test(combined))
//     return "Hindi";
//   if (/\benglish\b/i.test(combined)) return "English";
//   return "";
// }

// // ─── Icons ────────────────────────────────────────────────────────────────────
// const PlayIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
//     <polygon points="2,1 14,8 2,15" />
//   </svg>
// );
// const PauseIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
//     <rect x="2" y="2" width="4" height="12" rx="1" />
//     <rect x="10" y="2" width="4" height="12" rx="1" />
//   </svg>
// );
// const StopIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
//     <rect x="2" y="2" width="12" height="12" rx="2" />
//   </svg>
// );
// const SendIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
//   </svg>
// );
// const ChevronIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//     <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
//   </svg>
// );

// // ─── Voice bar ────────────────────────────────────────────────────────────────
// function VoiceBar({ text }) {
//   const [playing, setPlaying] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [rate, setRate] = useState(1);
//   const [lang, setLang] = useState("en");

//   useEffect(() => {
//     window.speechSynthesis?.cancel();
//     setPlaying(false);
//     setPaused(false);
//   }, [text]);

//   if (!("speechSynthesis" in window)) return null;

//   const speak = () => {
//     window.speechSynthesis.cancel();
//     const utt = new SpeechSynthesisUtterance(text);
//     const all = window.speechSynthesis.getVoices();
//     const voice =
//       lang === "hi"
//         ? all.find(
//             (v) =>
//               v.lang.includes("hi") || v.name.toLowerCase().includes("hindi"),
//           )
//         : all.find((v) => v.lang === "en-US") ||
//           all.find((v) => v.lang.startsWith("en"));
//     if (voice) {
//       utt.voice = voice;
//       utt.lang = voice.lang;
//     } else utt.lang = lang === "hi" ? "hi-IN" : "en-US";
//     utt.rate = rate;
//     utt.onend = () => {
//       setPlaying(false);
//       setPaused(false);
//     };
//     utt.onerror = () => {
//       setPlaying(false);
//       setPaused(false);
//     };
//     window.speechSynthesis.speak(utt);
//     setPlaying(true);
//     setPaused(false);
//   };

//   const pause = () => {
//     window.speechSynthesis.pause();
//     setPaused(true);
//   };
//   const resume = () => {
//     window.speechSynthesis.resume();
//     setPaused(false);
//   };
//   const stop = () => {
//     window.speechSynthesis.cancel();
//     setPlaying(false);
//     setPaused(false);
//   };

//   return (
//     <div
//       style={{
//         background: "rgba(0,0,0,0.4)",
//         border: "1px solid rgba(255,77,90,0.15)",
//         borderRadius: 12,
//         padding: "12px 14px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           alignItems: "center",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Lang pills */}
//         {["en", "hi"].map((l) => (
//           <button
//             key={l}
//             onClick={() => {
//               stop();
//               setLang(l);
//             }}
//             style={{
//               padding: "5px 12px",
//               borderRadius: 20,
//               border: "1.5px solid",
//               fontSize: 12,
//               fontWeight: 700,
//               cursor: "pointer",
//               background: lang === l ? "#ff4d5a" : "transparent",
//               borderColor: lang === l ? "#ff4d5a" : "rgba(255,77,90,0.3)",
//               color: lang === l ? "#fff" : "#888",
//             }}
//           >
//             {l.toUpperCase()}
//           </button>
//         ))}

//         {/* Play/Pause/Stop */}
//         {!playing ? (
//           <button
//             onClick={speak}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//               padding: "6px 14px",
//               borderRadius: 8,
//               border: "none",
//               background: "#ff4d5a",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             <PlayIcon /> Listen
//           </button>
//         ) : paused ? (
//           <button
//             onClick={resume}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//               padding: "6px 14px",
//               borderRadius: 8,
//               border: "none",
//               background: "#ff4d5a",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             <PlayIcon /> Resume
//           </button>
//         ) : (
//           <button
//             onClick={pause}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//               padding: "6px 14px",
//               borderRadius: 8,
//               border: "none",
//               background: "rgba(255,77,90,0.3)",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             <PauseIcon /> Pause
//           </button>
//         )}
//         {playing && (
//           <button
//             onClick={stop}
//             style={{
//               padding: "6px 10px",
//               borderRadius: 8,
//               border: "none",
//               background: "rgba(100,100,100,0.4)",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             <StopIcon />
//           </button>
//         )}

//         {/* Wave */}
//         {playing && !paused && (
//           <div
//             style={{
//               display: "flex",
//               gap: 3,
//               alignItems: "flex-end",
//               height: 20,
//             }}
//           >
//             {[0, 0.1, 0.2, 0.3, 0.4].map((d, i) => (
//               <span
//                 key={i}
//                 style={{
//                   width: 3,
//                   background: "#ff4d5a",
//                   borderRadius: 2,
//                   animation: `wave 0.6s ${d}s ease-in-out infinite`,
//                 }}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Speed */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//         <span
//           style={{ fontSize: 11, color: "#666", fontWeight: 600, minWidth: 44 }}
//         >
//           SPEED
//         </span>
//         <input
//           type="range"
//           min="0.5"
//           max="2"
//           step="0.1"
//           value={rate}
//           onChange={(e) => setRate(parseFloat(e.target.value))}
//           disabled={playing}
//           style={{ flex: 1, accentColor: "#ff4d5a" }}
//         />
//         <span
//           style={{
//             fontSize: 12,
//             color: "#ff4d5a",
//             fontWeight: 700,
//             minWidth: 36,
//           }}
//         >
//           {rate.toFixed(1)}x
//         </span>
//       </div>
//     </div>
//   );
// }

// // ─── Thinking animation ───────────────────────────────────────────────────────
// function ThinkingAnim() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 14,
//         padding: 24,
//         background: "rgba(255,77,90,0.04)",
//         border: "1px solid rgba(255,77,90,0.15)",
//         borderRadius: 14,
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <div
//           style={{
//             width: 28,
//             height: 28,
//             border: "3px solid rgba(255,77,90,0.2)",
//             borderTopColor: "#ff4d5a",
//             borderRadius: "50%",
//             animation: "spin 1s linear infinite",
//           }}
//         />
//         <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
//           Deep thinking...
//         </span>
//       </div>
//       <div style={{ display: "flex", gap: 5 }}>
//         {[0, 0.2, 0.4].map((d, i) => (
//           <div
//             key={i}
//             style={{
//               width: 8,
//               height: 8,
//               borderRadius: "50%",
//               background: "#ff4d5a",
//               animation: `pulse 1.4s ${d}s ease-in-out infinite`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Answer display ───────────────────────────────────────────────────────────
// function AnswerDisplay({ answer, activeTab, streaming }) {
//   if (!answer) return null;
//   const tab = TABS.find((t) => t.id === activeTab) || TABS[0];
//   const val = answer[activeTab];
//   const text = getTabText(answer, activeTab);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {/* Tab content */}
//       <div
//         style={{
//           background: `${tab.color}10`,
//           border: `1px solid ${tab.color}30`,
//           borderRadius: 12,
//           padding: 18,
//         }}
//       >
//         {activeTab === "insight" ? (
//           <p
//             style={{
//               color: "#e0e0e0",
//               fontSize: 15,
//               lineHeight: 1.8,
//               margin: 0,
//               wordBreak: "break-word",
//             }}
//           >
//             {val || ""}
//             {streaming && (
//               <span
//                 style={{
//                   display: "inline-block",
//                   width: 2,
//                   height: "1em",
//                   background: "#ff4d5a",
//                   marginLeft: 2,
//                   animation: "blink 1s infinite",
//                 }}
//               />
//             )}
//           </p>
//         ) : Array.isArray(val) ? (
//           <ol
//             style={{
//               margin: 0,
//               padding: 0,
//               listStyle: "none",
//               display: "flex",
//               flexDirection: "column",
//               gap: 12,
//             }}
//           >
//             {val.map((item, i) => (
//               <li
//                 key={i}
//                 style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
//               >
//                 <span
//                   style={{
//                     minWidth: 26,
//                     height: 26,
//                     borderRadius: "50%",
//                     background: tab.color,
//                     color: "#fff",
//                     fontSize: 12,
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                     marginTop: 1,
//                   }}
//                 >
//                   {i + 1}
//                 </span>
//                 <span
//                   style={{ color: "#e0e0e0", fontSize: 14, lineHeight: 1.7 }}
//                 >
//                   {item}
//                 </span>
//               </li>
//             ))}
//           </ol>
//         ) : (
//           <p
//             style={{
//               color: "#e0e0e0",
//               fontSize: 14,
//               lineHeight: 1.7,
//               margin: 0,
//             }}
//           >
//             {val || ""}
//           </p>
//         )}
//       </div>

//       {/* Voice bar */}
//       {!streaming && text && <VoiceBar text={text} />}

//       {/* Provider chip */}
//       {!streaming && (
//         <span
//           style={{
//             display: "inline-block",
//             padding: "5px 12px",
//             background: "rgba(255,77,90,0.1)",
//             border: "1px solid rgba(255,77,90,0.2)",
//             borderRadius: 20,
//             fontSize: 11,
//             fontWeight: 700,
//             color: "#ff4d5a",
//             width: "fit-content",
//           }}
//         >
//           {answer.provider || "AI"}
//         </span>
//       )}
//     </div>
//   );
// }

// // ─── Main component ───────────────────────────────────────────────────────────
// export default function Coach({ activeTool }) {
//   const [searchParams] = useSearchParams();
//   const bookId = searchParams.get("book");

//   const [form, setForm] = useState({
//     topic: "Personal Growth",
//     background: "I am learning new skills and want to improve",
//     goal: "Give me practical advice with steps to follow",
//   });
//   const [answer, setAnswer] = useState(null);
//   const [displayAnswer, setDisplayAnswer] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [streaming, setStreaming] = useState(false);
//   const [message, setMessage] = useState("");
//   const [formOpen, setFormOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("insight");
//   const [activeCategory, setActiveCategory] = useState("story");
//   const scrollRef = useRef(null);

//   // Streaming effect
//   useEffect(() => {
//     if (!answer) {
//       setDisplayAnswer(null);
//       setStreaming(false);
//       return;
//     }
//     const insight = String(answer.insight || "");
//     let index = 0;
//     setStreaming(true);
//     setDisplayAnswer({ ...answer, insight: "" });
//     const iv = setInterval(() => {
//       if (index < insight.length) {
//         index += insight[index] === " " ? 3 : 2;
//         setDisplayAnswer((cur) => ({
//           ...(cur || answer),
//           insight: insight.slice(0, index),
//         }));
//         return;
//       }
//       setDisplayAnswer(answer);
//       setStreaming(false);
//       clearInterval(iv);
//     }, 22);
//     return () => clearInterval(iv);
//   }, [answer]);

//   const update = (e) =>
//     setForm((cur) => ({ ...cur, [e.target.name]: e.target.value }));

//   const submit = async () => {
//     if (!form.topic.trim() || !form.background.trim() || !form.goal.trim()) {
//       setMessage("Please fill all fields ❌");
//       return;
//     }
//     if (!bookId) {
//       setMessage("No book selected ❌");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     setAnswer(null);
//     setActiveTab("insight");

//     try {
//       const data = await api("/api/ai/coach", {
//         method: "POST",
//         body: JSON.stringify({
//           tool:
//             TOOL_CATEGORIES.find((c) => c.id === activeCategory)?.label ||
//             activeTool,
//           bookId,
//           preferredLanguage: detectLang(form.topic, form.background, form.goal),
//           ...form,
//         }),
//       });

//       // ── Frontend validation layer ─────────────────────────────────────────
//       if (data.error === "subscription_required") {
//         setMessage(`🔒 ${data.message}`);
//         return;
//       }

//       // Normalize — handle old field names from any AI response
//       const normalized = {
//         provider: data.provider || "AI",
//         insight: data.insight || data.explanation || "",
//         relatableExamples: data.relatableExamples || [],
//         lifeLearnings: data.lifeLearnings || [],
//         developmentSuggestions:
//           data.developmentSuggestions || data.practice || [],
//         actionableQuestions:
//           data.actionableQuestions ||
//           (data.reflectionQuestion ? [data.reflectionQuestion] : []),
//       };

//       if (!normalized.insight) {
//         setMessage("AI returned an incomplete response. Please try again.");
//         return;
//       }

//       setAnswer(normalized);
//       setFormOpen(false);
//     } catch (err) {
//       setMessage(err.message || "Something went wrong ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categoryColor =
//     TOOL_CATEGORIES.find((c) => c.id === activeCategory)?.color || "#ff4d5a";

//   return (
//     <>
//       <style>{`
//         * { margin:0; padding:0; box-sizing:border-box; }
//         html,body { background:#0a0a0a; color:#fff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }

//         @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//         @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes spin    { to{transform:rotate(360deg)} }
//         @keyframes pulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
//         @keyframes blink   { 0%,49%{opacity:1} 50%,100%{opacity:0} }
//         @keyframes wave    { 0%,100%{height:6px} 50%{height:18px} }

//         .coach-shell {
//           display: grid;
//           grid-template-columns: 360px 1fr;
//           gap: 20px;
//           padding: 20px;
//           padding-top: 24px;
//           min-height: 100vh;
//           background: #0a0a0a;
//           animation: fadeIn .4s ease;
//         }

//         @media(max-width:1024px) {
//           .coach-shell { grid-template-columns:1fr; padding:16px; gap:16px; }
//         }

//         /* Category scroll bar */
//         .cat-scroll {
//           display: flex;
//           gap: 8px;
//           overflow-x: auto;
//           padding: 4px 2px 10px;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//           margin-bottom: 4px;
//         }
//         .cat-scroll::-webkit-scrollbar { display:none; }

//         .cat-pill {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 4px;
//           padding: 10px 14px;
//           border-radius: 14px;
//           border: 1.5px solid rgba(255,255,255,0.08);
//           background: #111;
//           cursor: pointer;
//           white-space: nowrap;
//           transition: all .2s ease;
//           flex-shrink: 0;
//           min-width: 90px;
//         }
//         .cat-pill:hover { transform:translateY(-2px); }
//         .cat-pill.active { border-width:2px; transform:translateY(-2px); }
//         .cat-pill-label { font-size:12px; font-weight:700; color:#fff; }
//         .cat-pill-desc  { font-size:10px; color:#666; text-align:center; }

//         /* Form panel */
//         .form-panel {
//           background: linear-gradient(135deg,#141414,#0f0f0f);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 16px;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           position: sticky;
//           top: 20px;
//           max-height: calc(100vh - 40px);
//           overflow-y: auto;
//           scrollbar-width: thin;
//         }

//         @media(max-width:1024px) { .form-panel { position:static; max-height:none; } }

//         .eyebrow { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#ff4d5a; }

//         .form-panel h2 { font-size:20px; font-weight:700; color:#fff; line-height:1.2; }

//         label { display:flex; flex-direction:column; gap:6px; font-size:13px; font-weight:600; color:#ccc; }

//         textarea {
//           width:100%; min-height:80px; padding:12px; border-radius:10px;
//           background:#000; border:1.5px solid rgba(255,255,255,0.08); color:#fff;
//           font-size:14px; font-family:inherit; resize:vertical; transition:all .2s;
//         }
//         textarea:focus { outline:none; border-color:#ff4d5a; background:#0a0a0a; }
//         textarea::placeholder { color:#444; }

//         @media(max-width:768px) { textarea { font-size:16px; } }

//         .submit-btn {
//           background: linear-gradient(135deg,#ff4d5a,#ff3d4a);
//           border:none; padding:13px 20px; border-radius:12px;
//           color:#fff; font-weight:700; font-size:15px; cursor:pointer;
//           display:flex; align-items:center; justify-content:center; gap:8px;
//           transition:all .2s;
//         }
//         .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,77,90,.4); }
//         .submit-btn:disabled { opacity:.6; cursor:not-allowed; }

//         .form-msg {
//           padding:10px 14px; background:rgba(255,77,90,.1);
//           border:1px solid rgba(255,77,90,.3); border-radius:8px;
//           color:#ff6b78; font-size:13px;
//         }

//         /* Answer panel */
//         .ans-panel {
//           background: linear-gradient(135deg,#141414,#0f0f0f);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 16px;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           animation: slideUp .4s ease;
//         }

//         /* Section tabs */
//         .tab-row {
//           display: flex;
//           gap: 6px;
//           overflow-x: auto;
//           padding-bottom: 4px;
//           scrollbar-width: none;
//         }
//         .tab-row::-webkit-scrollbar { display:none; }

//         .tab-btn {
//           padding: 7px 14px;
//           border-radius: 20px;
//           border: 1.5px solid rgba(255,255,255,0.08);
//           background: transparent;
//           color: #888;
//           font-size: 12px;
//           font-weight: 700;
//           cursor: pointer;
//           white-space: nowrap;
//           flex-shrink: 0;
//           transition: all .2s;
//         }
//         .tab-btn:hover { color:#fff; }
//         .tab-btn.active { color:#fff; border-width:2px; }

//         .muted { color:#555; font-size:14px; text-align:center; padding:20px 0; }

//         .toggle-btn {
//           background:none; border:none; color:#ff4d5a; cursor:pointer;
//           font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; padding:0;
//         }
//         .toggle-icon { display:inline-flex; transition:transform .3s; }
//         .toggle-icon.open { transform:rotate(180deg); }

//         .form-content { overflow:hidden; transition:all .3s ease; }
//         .form-content.closed { max-height:0; opacity:0; }
//         .form-content.open { max-height:2000px; opacity:1; }
//       `}</style>

//       <div className="coach-shell">
//         {/* ── LEFT: Form panel ───────────────────────────────────────────── */}
//         <div className="form-panel">
//           {/* Category scroll bar */}
//           <div>
//             <p className="eyebrow" style={{ marginBottom: 8 }}>
//               Select focus area
//             </p>
//             <div className="cat-scroll" ref={scrollRef}>
//               {TOOL_CATEGORIES.map((cat) => (
//                 <button
//                   key={cat.id}
//                   className={`cat-pill${activeCategory === cat.id ? " active" : ""}`}
//                   onClick={() => setActiveCategory(cat.id)}
//                   style={
//                     activeCategory === cat.id
//                       ? {
//                           borderColor: cat.color,
//                           background: `${cat.color}15`,
//                           boxShadow: `0 0 12px ${cat.color}30`,
//                         }
//                       : {}
//                   }
//                 >
//                   <span className="cat-pill-label">{cat.label}</span>
//                   <span className="cat-pill-desc">{cat.desc}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Toggle */}
//           <button className="toggle-btn" onClick={() => setFormOpen(!formOpen)}>
//             <span className={`toggle-icon${formOpen ? " open" : ""}`}>
//               <ChevronIcon />
//             </span>
//             {formOpen ? "Hide form" : "Show form"}
//           </button>

//           <div className={`form-content ${formOpen ? "open" : "closed"}`}>
//             <p className="eyebrow" style={{ marginBottom: 4 }}>
//               {TOOL_CATEGORIES.find((c) => c.id === activeCategory)?.label ||
//                 activeTool ||
//                 "AI Coaching"}
//             </p>
//             <h2>Personal AI coaching</h2>

//             <label style={{ marginTop: 8 }}>
//               Topic or Theme
//               <textarea
//                 name="topic"
//                 value={form.topic}
//                 onChange={update}
//                 placeholder="E.g. discipline, growth mindset, public speaking"
//               />
//             </label>

//             <label>
//               Your Background
//               <textarea
//                 name="background"
//                 value={form.background}
//                 onChange={update}
//                 placeholder="E.g. I am a developer building products"
//               />
//             </label>

//             <label>
//               Your Goal
//               <textarea
//                 name="goal"
//                 value={form.goal}
//                 onChange={update}
//                 placeholder="E.g. Give practical steps with examples"
//               />
//             </label>
//             <br />
//             <button className="submit-btn" onClick={submit} disabled={loading}>
//               {loading ? (
//                 <>
//                   <div
//                     style={{
//                       width: 16,
//                       height: 16,
//                       border: "2px solid rgba(255,255,255,0.3)",
//                       borderTopColor: "#fff",
//                       borderRadius: "50%",
//                       animation: "spin 1s linear infinite",
//                     }}
//                   />{" "}
//                   Thinking...
//                 </>
//               ) : (
//                 <>
//                   <SendIcon /> Start Session
//                 </>
//               )}
//             </button>

//             {message && <p className="form-msg">{message}</p>}
//           </div>
//         </div>

//         {/* ── RIGHT: Answer panel ────────────────────────────────────────── */}
//         <div className="ans-panel">
//           <div>
//             <p className="eyebrow">Session Response</p>
//             <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
//               {loading && !displayAnswer
//                 ? "Deep AI thinking..."
//                 : displayAnswer
//                   ? "Personalised insight"
//                   : "Ready to begin?"}
//             </h2>
//           </div>

//           {/* Section tabs — only when answer available */}
//           {displayAnswer && !streaming && (
//             <div className="tab-row">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab.id}
//                   className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
//                   onClick={() => setActiveTab(tab.id)}
//                   style={
//                     activeTab === tab.id
//                       ? {
//                           borderColor: tab.color,
//                           color: tab.color,
//                           background: `${tab.color}15`,
//                         }
//                       : {}
//                   }
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           )}

//           {loading && !displayAnswer ? (
//             <ThinkingAnim />
//           ) : displayAnswer ? (
//             <AnswerDisplay
//               answer={displayAnswer}
//               activeTab={activeTab}
//               streaming={streaming}
//             />
//           ) : (
//             <p className="muted">
//               Select a focus area, fill the form, and start your personalised
//               coaching session
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
// Coach.jsx — 3-tool AI interface
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <polygon points="2,1 14,8 2,15" />
  </svg>
);
const PauseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="4" height="12" rx="1" />
    <rect x="10" y="2" width="4" height="12" rx="1" />
  </svg>
);
const StopIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="12" rx="2" />
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
  </svg>
);

// ─── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "coach",
    label: "🎯 AI Coach",
    color: "#ff4d5a",
    desc: "Personal coaching from any topic or book",
    endpoint: "/api/ai/coach",
  },
  {
    id: "book",
    label: "📚 Book Learning",
    color: "#a855f7",
    desc: "Break down any book or passage instantly",
    endpoint: "/api/ai/book-learning",
  },
  {
    id: "tools",
    label: "⚡ AI Tools",
    color: "#3b82f6",
    desc: "Restyle • Quiz • Learning tracker",
    endpoint: "/api/ai/tools",
  },
];

// Sub-tool tabs per tool
const COACH_TABS = [
  { id: "insight", label: "💡 Insight", color: "#ff4d5a" },
  { id: "relatableExamples", label: "🔗 Examples", color: "#a855f7" },
  { id: "lifeLearnings", label: "🌱 Life Lessons", color: "#22c55e" },
  { id: "developmentSuggestions", label: "⚡ Steps", color: "#3b82f6" },
  { id: "actionableQuestions", label: "❓ Questions", color: "#f59e0b" },
];

const BOOK_TABS = [
  { id: "explanation", label: "💡 Explanation", color: "#a855f7" },
  { id: "realLifeExamples", label: "🌍 Examples", color: "#22c55e" },
  { id: "keyLessons", label: "🔑 Key Lessons", color: "#f59e0b" },
  { id: "conceptMap", label: "🗺 Concept Map", color: "#3b82f6" },
];

const AI_TOOL_TYPES = [
  { id: "restyle", label: "✏️ Restyle", desc: "Rewrite in 5 tones" },
  {
    id: "test_generator",
    label: "📝 Quiz Maker",
    desc: "Auto-generate test questions",
  },
  {
    id: "learning_tracker",
    label: "📅 Learning Tracker",
    desc: "4-week personalised plan",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function detectLang(...vals) {
  const txt = vals.filter(Boolean).join(" ");
  if (/[ऀ-ॿ]/.test(txt) || /\b(hindi|hinglish)\b/i.test(txt)) return "Hindi";
  return "English";
}

function toText(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.join(". ");
  return "";
}

// ─── Voice bar ────────────────────────────────────────────────────────────────
function VoiceBar({ text }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setPaused(false);
  }, [text]);

  if (!("speechSynthesis" in window) || !text) return null;

  const speak = () => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const all = window.speechSynthesis.getVoices();
    const voice =
      lang === "hi"
        ? all.find(
            (v) =>
              v.lang.includes("hi") || v.name.toLowerCase().includes("hindi"),
          )
        : all.find((v) => v.lang === "en-US") ||
          all.find((v) => v.lang.startsWith("en"));
    if (voice) {
      utt.voice = voice;
      utt.lang = voice.lang;
    } else utt.lang = lang === "hi" ? "hi-IN" : "en-US";
    utt.rate = rate;
    utt.onend = utt.onerror = () => {
      setPlaying(false);
      setPaused(false);
    };
    window.speechSynthesis.speak(utt);
    setPlaying(true);
    setPaused(false);
  };

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {["en", "hi"].map((l) => (
          <button
            key={l}
            onClick={() => {
              window.speechSynthesis?.cancel();
              setPlaying(false);
              setLang(l);
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              border: "1.5px solid",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              background: lang === l ? "#ff4d5a" : "transparent",
              borderColor: lang === l ? "#ff4d5a" : "rgba(255,77,90,0.3)",
              color: lang === l ? "#fff" : "#888",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
        {!playing ? (
          <button
            onClick={speak}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 14px",
              borderRadius: 8,
              border: "none",
              background: "#ff4d5a",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <PlayIcon /> Listen
          </button>
        ) : paused ? (
          <button
            onClick={() => {
              window.speechSynthesis.resume();
              setPaused(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 14px",
              borderRadius: 8,
              border: "none",
              background: "#ff4d5a",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <PlayIcon /> Resume
          </button>
        ) : (
          <button
            onClick={() => {
              window.speechSynthesis.pause();
              setPaused(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 14px",
              borderRadius: 8,
              border: "none",
              background: "rgba(255,77,90,0.3)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <PauseIcon /> Pause
          </button>
        )}
        {playing && (
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setPlaying(false);
              setPaused(false);
            }}
            style={{
              padding: "5px 10px",
              borderRadius: 8,
              border: "none",
              background: "rgba(100,100,100,0.4)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <StopIcon />
          </button>
        )}
        {playing && !paused && (
          <div
            style={{
              display: "flex",
              gap: 3,
              alignItems: "flex-end",
              height: 18,
            }}
          >
            {[0, 0.1, 0.2, 0.3, 0.4].map((d, i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  background: "#ff4d5a",
                  borderRadius: 2,
                  animation: `wave 0.6s ${d}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{ fontSize: 10, color: "#555", fontWeight: 700, minWidth: 40 }}
        >
          SPEED
        </span>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          disabled={playing}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: "#ff4d5a" }}
        />
        <span
          style={{
            fontSize: 11,
            color: "#ff4d5a",
            fontWeight: 700,
            minWidth: 34,
          }}
        >
          {rate.toFixed(1)}x
        </span>
      </div>
    </div>
  );
}

// ─── Thinking animation ───────────────────────────────────────────────────────
function Thinking() {
  return (
    <div
      style={{
        padding: 24,
        background: "rgba(255,77,90,0.04)",
        border: "1px solid rgba(255,77,90,0.15)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 26,
            height: 26,
            border: "3px solid rgba(255,77,90,0.2)",
            borderTopColor: "#ff4d5a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          AI is thinking...
        </span>
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff4d5a",
              animation: `pulse 1.4s ${d}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab row ──────────────────────────────────────────────────────────────────
function TabRow({ tabs, active, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 4,
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            border: `1.5px solid`,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all .2s",
            background: active === tab.id ? `${tab.color}18` : "transparent",
            borderColor:
              active === tab.id ? tab.color : "rgba(255,255,255,0.1)",
            color: active === tab.id ? tab.color : "#666",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── List renderer ────────────────────────────────────────────────────────────
function ListItems({ items, color }) {
  return (
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {(items || []).map((item, i) => (
        <li
          key={i}
          style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
        >
          <span
            style={{
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
              background: color,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {i + 1}
          </span>
          <span style={{ color: "#e0e0e0", fontSize: 14, lineHeight: 1.7 }}>
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY — AI COACH
// ═══════════════════════════════════════════════════════════════════════════════
function CoachDisplay({ answer, streaming }) {
  const [activeTab, setActiveTab] = useState("insight");
  if (!answer) return null;

  const tab = COACH_TABS.find((t) => t.id === activeTab) || COACH_TABS[0];
  const val = answer[activeTab];
  const text = toText(val);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!streaming && (
        <TabRow tabs={COACH_TABS} active={activeTab} onSelect={setActiveTab} />
      )}

      <div
        style={{
          background: `${tab.color}10`,
          border: `1px solid ${tab.color}25`,
          borderRadius: 12,
          padding: 18,
        }}
      >
        {activeTab === "insight" ? (
          <p
            style={{
              color: "#e0e0e0",
              fontSize: 15,
              lineHeight: 1.85,
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {val || ""}
            {streaming && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  background: "#ff4d5a",
                  marginLeft: 2,
                  animation: "blink 1s infinite",
                }}
              />
            )}
          </p>
        ) : Array.isArray(val) ? (
          <ListItems items={val} color={tab.color} />
        ) : (
          <p
            style={{
              color: "#e0e0e0",
              fontSize: 14,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {val || ""}
          </p>
        )}
      </div>

      {!streaming && text && <VoiceBar text={text} />}
      {!streaming && <ProviderChip label={answer.provider} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY — BOOK LEARNING
// ═══════════════════════════════════════════════════════════════════════════════
function BookDisplay({ answer }) {
  const [activeTab, setActiveTab] = useState("explanation");
  if (!answer) return null;

  const tab = BOOK_TABS.find((t) => t.id === activeTab) || BOOK_TABS[0];
  const val = answer[activeTab];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TabRow tabs={BOOK_TABS} active={activeTab} onSelect={setActiveTab} />

      <div
        style={{
          background: `${tab.color}10`,
          border: `1px solid ${tab.color}25`,
          borderRadius: 12,
          padding: 18,
        }}
      >
        {activeTab === "conceptMap" ? (
          <ConceptMapView items={val} />
        ) : Array.isArray(val) ? (
          <ListItems items={val} color={tab.color} />
        ) : (
          <p
            style={{
              color: "#e0e0e0",
              fontSize: 15,
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            {val || ""}
          </p>
        )}
      </div>

      {toText(val) && <VoiceBar text={toText(val)} />}
      <ProviderChip label={answer.provider} />
    </div>
  );
}

function ConceptMapView({ items = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((node, i) => (
        <div
          key={i}
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: 10,
            padding: "12px 14px",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
              {node.concept}
            </span>
          </div>
          <p
            style={{
              color: "#aaa",
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
              paddingLeft: 16,
            }}
          >
            {node.meaning}
          </p>
          {node.linkedTo?.length > 0 && (
            <div
              style={{
                paddingLeft: 16,
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {node.linkedTo.map((link, j) => (
                <span
                  key={j}
                  style={{
                    padding: "2px 8px",
                    background: "rgba(59,130,246,0.15)",
                    borderRadius: 12,
                    fontSize: 11,
                    color: "#3b82f6",
                    fontWeight: 600,
                  }}
                >
                  → {link}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY — AI TOOLS
// ═══════════════════════════════════════════════════════════════════════════════
function ToolsDisplay({ answer, toolType }) {
  if (!answer) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {toolType === "restyle" && <RestyleView data={answer} />}
      {toolType === "test_generator" && <QuizView data={answer} />}
      {toolType === "learning_tracker" && <TrackerView data={answer} />}
      <ProviderChip label={answer.provider} />
    </div>
  );
}

const RESTYLE_LABELS = [
  { key: "formal", label: "👔 Formal", color: "#3b82f6" },
  { key: "casual", label: "😊 Casual", color: "#22c55e" },
  { key: "concise", label: "⚡ Concise", color: "#f59e0b" },
  { key: "storytelling", label: "📖 Story", color: "#a855f7" },
  { key: "social", label: "📱 Social Media", color: "#ec4899" },
];

function RestyleView({ data }) {
  const [active, setActive] = useState("formal");
  const cur = RESTYLE_LABELS.find((r) => r.key === active);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {RESTYLE_LABELS.map((r) => (
          <button
            key={r.key}
            onClick={() => setActive(r.key)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: `1.5px solid`,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: active === r.key ? `${r.color}20` : "transparent",
              borderColor: active === r.key ? r.color : "rgba(255,255,255,0.1)",
              color: active === r.key ? r.color : "#666",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: `${cur?.color || "#fff"}10`,
          border: `1px solid ${cur?.color || "#fff"}25`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{ color: "#e0e0e0", fontSize: 14, lineHeight: 1.8, margin: 0 }}
        >
          {data[active] || ""}
        </p>
      </div>
      <VoiceBar text={data[active] || ""} />
    </div>
  );
}

function QuizView({ data }) {
  const [sel, setSel] = useState({});
  const [shown, setShown] = useState({});
  const questions = data.questions || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: 0 }}>
        {data.title || "Quiz"}
      </h3>
      {questions.map((q, qi) => (
        <div
          key={qi}
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            padding: 16,
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p
            style={{
              color: "#e0e0e0",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {qi + 1}. {q.q}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(q.options || []).map((opt, oi) => {
              const isSelected = sel[qi] === opt;
              const isCorrect = shown[qi] && opt === q.answer;
              const isWrong = shown[qi] && isSelected && opt !== q.answer;
              return (
                <button
                  key={oi}
                  onClick={() => {
                    setSel((s) => ({ ...s, [qi]: opt }));
                    setShown((s) => ({ ...s, [qi]: true }));
                  }}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 9,
                    border: `1.5px solid`,
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "all .15s",
                    background: isCorrect
                      ? "rgba(34,197,94,0.15)"
                      : isWrong
                        ? "rgba(239,68,68,0.15)"
                        : isSelected
                          ? "rgba(59,130,246,0.15)"
                          : "rgba(255,255,255,0.03)",
                    borderColor: isCorrect
                      ? "#22c55e"
                      : isWrong
                        ? "#ef4444"
                        : isSelected
                          ? "#3b82f6"
                          : "rgba(255,255,255,0.08)",
                    color: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#ccc",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {shown[qi] && (
            <p
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#888",
                lineHeight: 1.6,
              }}
            >
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TrackerView({ data }) {
  const [openWeek, setOpenWeek] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.summary && (
        <p
          style={{
            color: "#e0e0e0",
            fontSize: 14,
            lineHeight: 1.75,
            margin: 0,
            padding: "12px 16px",
            background: "rgba(99,102,241,0.08)",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          {data.summary}
        </p>
      )}
      {(data.weeklyPlan || []).map((week) => (
        <div
          key={week.week}
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() =>
              setOpenWeek(openWeek === week.week ? null : week.week)
            }
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              Week {week.week} — {week.focus}
            </span>
            <span
              style={{
                color: "#555",
                fontSize: 18,
                transform: openWeek === week.week ? "rotate(180deg)" : "none",
                transition: "transform .2s",
              }}
            >
              ⌄
            </span>
          </button>
          {openWeek === week.week && (
            <div
              style={{
                padding: "0 16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {(week.tasks || []).map((task, ti) => (
                <div
                  key={ti}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      color: "#6366f1",
                      fontWeight: 700,
                      fontSize: 13,
                      minWidth: 20,
                    }}
                  >
                    {ti + 1}.
                  </span>
                  <span
                    style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6 }}
                  >
                    {task}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {data.milestones?.length > 0 && (
        <div
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <p
            style={{
              color: "#22c55e",
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Milestones
          </p>
          {data.milestones.map((m, i) => (
            <p
              key={i}
              style={{
                color: "#ccc",
                fontSize: 13,
                lineHeight: 1.6,
                margin: "4px 0",
              }}
            >
              🎯 {m}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared small components ─────────────────────────────────────────────────
function ProviderChip({ label }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        background: "rgba(255,77,90,0.1)",
        border: "1px solid rgba(255,77,90,0.2)",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        color: "#ff4d5a",
        width: "fit-content",
      }}
    >
      {label || "AI"}
    </span>
  );
}

function Textarea({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: "#aaa",
      }}
    >
      {label}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "11px 13px",
          borderRadius: 10,
          background: "var(--app-surface-2)",
          border: "1.5px solid var(--app-border)",
          color: "var(--app-text)",
          fontSize: 14,
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          transition: "border-color .2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#ff4d5a")}
        onBlur={(e) => (e.target.style.borderColor = "var(--app-border)")}
      />
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM — AI COACH
// ═══════════════════════════════════════════════════════════════════════════════
function CoachForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    topic: "Personal Growth",
    background: "I am learning new skills and want to improve",
    goal: "Give me practical advice with steps to follow",
  });
  const up = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Textarea
        label="Topic or Theme"
        name="topic"
        value={form.topic}
        onChange={up}
        placeholder="E.g. discipline, public speaking, focus"
      />
      <Textarea
        label="Your Situation"
        name="background"
        value={form.background}
        onChange={up}
        placeholder="E.g. I'm a developer trying to build better habits"
      />
      <Textarea
        label="What you want"
        name="goal"
        value={form.goal}
        onChange={up}
        placeholder="E.g. Give me practical steps I can follow today"
      />
      <SubmitBtn
        loading={loading}
        onClick={() =>
          onSubmit({
            ...form,
            preferredLanguage: detectLang(form.topic, form.background),
          })
        }
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM — BOOK LEARNING
// ═══════════════════════════════════════════════════════════════════════════════
function BookForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ focusSection: "", learningGoal: "" });
  const up = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Textarea
        label="Paste a section or paragraph"
        name="focusSection"
        value={form.focusSection}
        onChange={up}
        placeholder="Paste the book text or chapter you want to understand..."
        rows={5}
      />
      <Textarea
        label="What you want to learn"
        name="learningGoal"
        value={form.learningGoal}
        onChange={up}
        placeholder="E.g. Understand the main idea and how to apply it"
      />
      <SubmitBtn
        loading={loading}
        onClick={() =>
          onSubmit({
            ...form,
            preferredLanguage: detectLang(form.focusSection),
          })
        }
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM — AI TOOLS
// ═══════════════════════════════════════════════════════════════════════════════
function AIToolsForm({ onSubmit, loading }) {
  const [toolType, setToolType] = useState("restyle");
  const [form, setForm] = useState({ inputText: "", context: "" });
  const up = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const placeholders = {
    restyle: "Paste any text you want rewritten in different styles...",
    test_generator:
      "Paste the content you want to generate quiz questions from...",
    learning_tracker: "What topic or skill do you want to learn?",
  };
  const contextLabels = {
    restyle: null,
    test_generator: "Focus / difficulty level (optional)",
    learning_tracker: "Your current level (beginner / intermediate / advanced)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Sub-tool selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#aaa" }}>
          Select tool
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {AI_TOOL_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setToolType(t.id)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: `1.5px solid`,
                cursor: "pointer",
                textAlign: "left",
                transition: "all .2s",
                background:
                  toolType === t.id
                    ? "rgba(59,130,246,0.12)"
                    : "rgba(0,0,0,0.3)",
                borderColor:
                  toolType === t.id ? "#3b82f6" : "rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                {t.label}
              </div>
              <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>
                {t.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Input"
        name="inputText"
        value={form.inputText}
        onChange={up}
        placeholder={placeholders[toolType]}
        rows={4}
      />

      {contextLabels[toolType] && (
        <Textarea
          label={contextLabels[toolType]}
          name="context"
          value={form.context}
          onChange={up}
          placeholder="Optional context..."
          rows={2}
        />
      )}

      <SubmitBtn
        loading={loading}
        onClick={() =>
          onSubmit({
            toolType,
            ...form,
            preferredLanguage: detectLang(form.inputText),
          })
        }
      />
    </div>
  );
}

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitBtn({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "13px 20px",
        borderRadius: 12,
        border: "none",
        background: loading
          ? "rgba(255,77,90,0.5)"
          : "linear-gradient(135deg,#ff4d5a,#ff3040)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all .2s",
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: 15,
              height: 15,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          Processing...
        </>
      ) : (
        <>
          <SendIcon /> Generate
        </>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Coach() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("book");

  const [activeTool, setActiveTool] = useState("coach");
  const [answer, setAnswer] = useState(null);
  const [displayAns, setDisplayAns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [message, setMessage] = useState("");
  const [toolType, setToolType] = useState("restyle"); // for AI tools display

  const tool = TOOLS.find((t) => t.id === activeTool) || TOOLS[0];

  // ── Streaming effect (coach only) ─────────────────────────────────────────
  useEffect(() => {
    if (!answer || activeTool !== "coach") {
      setDisplayAns(answer);
      setStreaming(false);
      return;
    }
    const insight = String(answer.insight || "");
    let idx = 0;
    setStreaming(true);
    setDisplayAns({ ...answer, insight: "" });
    const iv = setInterval(() => {
      if (idx < insight.length) {
        idx += insight[idx] === " " ? 3 : 2;
        setDisplayAns((cur) => ({
          ...(cur || answer),
          insight: insight.slice(0, idx),
        }));
        return;
      }
      setDisplayAns(answer);
      setStreaming(false);
      clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [answer, activeTool]);

  const handleToolSwitch = (id) => {
    setActiveTool(id);
    setAnswer(null);
    setDisplayAns(null);
    setMessage("");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage("");
    setAnswer(null);
    setDisplayAns(null);

    // remember toolType for display
    if (activeTool === "tools") setToolType(formData.toolType || "restyle");

    try {
      const body =
        activeTool === "book"
          ? { bookId, ...formData }
          : activeTool === "coach"
            ? { bookId, ...formData }
            : { ...formData };

      const data = await api(tool.endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (data.error === "subscription_required") {
        setMessage(`🔒 ${data.message}`);
        return;
      }

      setAnswer(data);
    } catch (err) {
      setMessage(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ── Result heading ─────────────────────────────────────────────────────────
  const resultTitle =
    loading && !displayAns
      ? "Thinking..."
      : displayAns
        ? activeTool === "coach"
          ? "Your coaching insight"
          : activeTool === "book"
            ? "Book breakdown"
            : "Result"
        : "Ready when you are";

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{background:var(--app-bg);color:var(--app-text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes slideUp {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin    {to{transform:rotate(360deg)}}
        @keyframes pulse   {0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes blink   {0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes wave    {0%,100%{height:5px}50%{height:17px}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:color-mix(in srgb, var(--app-text) 10%, transparent);border-radius:4px}

        .shell{display:grid;grid-template-columns:340px 1fr;gap:20px;padding:20px;min-height:100vh;background:var(--app-bg);animation:fadeIn .3s ease;}
        @media(max-width:900px){.shell{grid-template-columns:1fr;padding:14px;gap:14px;}}

        .panel{background:linear-gradient(135deg,var(--app-surface),var(--app-surface-2));border:1px solid var(--app-border);border-radius:16px;padding:20px;}
        .left-panel{display:flex;flex-direction:column;gap:16px;position:sticky;top:20px;max-height:calc(100vh - 40px);overflow-y:auto;}
        @media(max-width:900px){.left-panel{position:static;max-height:none;}}
        .right-panel{display:flex;flex-direction:column;gap:16px;animation:slideUp .3s ease;}

        .tool-btn{width:100%;padding:14px 16px;border-radius:12px;border:1.5px solid var(--app-border);background:var(--app-surface-2);cursor:pointer;text-align:left;transition:all .2s;}
        .tool-btn:hover{transform:translateY(-1px);}

        .eyebrow{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;}
        .muted{color:var(--app-text-muted);font-size:14px;text-align:center;padding:28px 0;line-height:1.8;}
        .err-msg{padding:10px 14px;background:rgba(255,77,90,.08);border:1px solid rgba(255,77,90,.25);border-radius:8px;color:#ff6b78;font-size:13px;}
      `}</style>

      <div className="shell">
        {/* ══ LEFT: tool selector + form ════════════════════════════════════ */}
        <div className="panel left-panel">
          {/* Tool selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="eyebrow" style={{ color: "var(--app-text-muted)" }}>
              Choose your tool
            </p>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className="tool-btn"
                onClick={() => handleToolSwitch(t.id)}
                style={
                  activeTool === t.id
                    ? {
                        borderColor: t.color,
                        background: `${t.color}12`,
                        boxShadow: `0 0 14px ${t.color}20`,
                      }
                    : {}
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        activeTool === t.id
                          ? t.color
                          : "color-mix(in srgb, var(--app-text) 20%, transparent)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: activeTool === t.id ? t.color : "var(--app-text)",
                      }}
                    >
                      {t.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--app-text-muted)", marginTop: 2 }}>
                      {t.desc}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--app-border-soft)" }} />

          {/* Active form */}
          <div>
            <p
              className="eyebrow"
              style={{ color: tool.color, marginBottom: 14 }}
            >
              {tool.label}
            </p>
            {activeTool === "coach" && (
              <CoachForm onSubmit={handleSubmit} loading={loading} />
            )}
            {activeTool === "book" && (
              <BookForm onSubmit={handleSubmit} loading={loading} />
            )}
            {activeTool === "tools" && (
              <AIToolsForm onSubmit={handleSubmit} loading={loading} />
            )}
            {message && (
              <p className="err-msg" style={{ marginTop: 12 }}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* ══ RIGHT: result panel ════════════════════════════════════════════ */}
        <div className="panel right-panel">
          <div>
            <p
              className="eyebrow"
              style={{ color: tool.color, marginBottom: 4 }}
            >
              Session Result
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--app-text)" }}>
              {resultTitle}
            </h2>
          </div>

          {loading && !displayAns ? (
            <Thinking />
          ) : displayAns ? (
            <>
              {activeTool === "coach" && (
                <CoachDisplay answer={displayAns} streaming={streaming} />
              )}
              {activeTool === "book" && <BookDisplay answer={displayAns} />}
              {activeTool === "tools" && (
                <ToolsDisplay answer={displayAns} toolType={toolType} />
              )}
            </>
          ) : (
            <p className="muted">
              Select a tool on the left, fill in your details,
              <br />
              and hit <strong style={{ color: "var(--app-accent)" }}>Generate</strong> —
              AI handles the rest.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

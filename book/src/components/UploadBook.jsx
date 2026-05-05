// import { useRef, useState } from "react";
// import { API_URL, TOKEN_KEY } from "../lib/api";
// import { makeCover, mapUploadToBook } from "../utils/books";

// const CSS = `
// .upload-wrap {
//   padding: 16px;
//   padding-top: 40px;
//   background: #0c0c0d;
//   min-height: 100vh;
//   color: #fff;
//   font-family: system-ui, sans-serif;
// }
// @media (max-width: 600px) {
//   .upload-wrap { padding-top: 70px; }
// }
// .upload-panel {
//   background: #131315;
//   border: 1px solid rgba(255,255,255,0.08);
//   border-radius: 16px;
//   padding: 16px;
// }
// .upload-title {
//   font-size: 1.2rem;
//   font-weight: 700;
//   margin-bottom: 10px;
// }
// .upload-form { display: grid; gap: 12px; }
// .upload-input {
//   width: 100%;
//   padding: 10px;
//   border-radius: 10px;
//   background: #0f0f11;
//   border: 1px solid rgba(255,255,255,0.08);
//   color: #fff;
// }
// .upload-label { font-size: 0.8rem; color: #aaa; }
// .upload-btn {
//   background: #ff4d5a;
//   border: none;
//   padding: 12px;
//   border-radius: 999px;
//   color: #fff;
//   cursor: pointer;
//   font-weight: 600;
//   font-size: 1rem;
// }
// .upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }
// .cover-preview img {
//   width: 100%;
//   max-height: 180px;
//   object-fit: cover;
//   border-radius: 10px;
// }
// .success { color: #4ade80; }
// .error { color: #ff6b6b; }
// .queue-item {
//   background: #0f0f11;
//   padding: 10px;
//   border-radius: 10px;
//   margin-top: 10px;
// }
// .progress-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 6px;
// }
// .progress-pct {
//   font-size: 0.8rem;
//   color: #ff4d5a;
//   font-weight: 700;
// }
// .progress-name {
//   font-size: 0.85rem;
//   color: #ddd;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 70%;
// }
// .progress-status {
//   font-size: 0.75rem;
//   color: #aaa;
//   margin-top: 4px;
// }
// .progress-track {
//   height: 8px;
//   background: rgba(255,255,255,0.1);
//   border-radius: 999px;
//   overflow: hidden;
// }
// .progress-fill {
//   height: 100%;
//   background: linear-gradient(90deg, #ff4d5a, #ff8a5a);
//   border-radius: 999px;
//   transition: width 0.3s ease;
// }
// `;

// export default function UploadBook({ onAddBook }) {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [file, setFile] = useState(null);
//   const [queue, setQueue] = useState([]);
//   const [coverPreview, setCoverPreview] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [type, setType] = useState("private");
//   const coverInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const allowedTypes = [
//     "application/pdf",
//     "text/plain",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];

//   const selectCover = (file) => {
//     if (!file || !file.type.startsWith("image/")) {
//       setMessage("Only image allowed for cover ❌");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = () => setCoverPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const updateQueue = (id, patch) =>
//     setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

//   const handleUpload = () => {
//     setMessage("");

//     if (!title.trim()) return setMessage("Title required ❌");
//     if (title.trim().length < 3) return setMessage("Min 3 characters ❌");
//     if (!file) return setMessage("Select document file ❌");
//     if (!allowedTypes.includes(file.type))
//       return setMessage("Only PDF, DOC, DOCX, TXT allowed ❌");
//     if (author && author.length < 2) return setMessage("Author too short ❌");

//     setLoading(true);

//     const id = crypto.randomUUID();
//     setQueue([{ id, name: file.name, progress: 0, status: "Uploading..." }]);

//     const body = new FormData();
//     body.append("file", file);
//     body.append("title", title.trim());
//     body.append("author", author || "Unknown");
//     body.append("type", type);
//     const coverFile = coverInputRef.current?.files?.[0];
//     if (coverFile) body.append("cover", coverFile);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", `${API_URL}/api/uploads`);

//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

//     // ✅ FIX: Mobile Chrome pe XHR progress fix
//     // upload.onprogress ke saath async setState batching issue hota hai
//     // isliye direct DOM update karo progress ke liye, React state sirf final pe
//     const progressFill = { current: null }; // ref-style trick

//     xhr.upload.addEventListener(
//       "progress",
//       (e) => {
//         if (!e.lengthComputable) {
//           // Mobile pe kabhi kabhi lengthComputable false hota hai
//           // Fake animated progress dikhao
//           updateQueue(id, { progress: -1, status: "Uploading..." });
//           return;
//         }
//         const pct = Math.round((e.loaded / e.total) * 100);
//         updateQueue(id, { progress: pct, status: `Uploading... ${pct}%` });
//       },
//       { passive: true },
//     );

//     xhr.upload.addEventListener("loadstart", () => {
//       updateQueue(id, { progress: 0, status: "Starting..." });
//     });

//     xhr.upload.addEventListener("load", () => {
//       updateQueue(id, { progress: 100, status: "Processing on server..." });
//     });

//     xhr.onload = () => {
//       setLoading(false);
//       try {
//         let data;
//         try {
//           data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
//         } catch (e) {
//           console.error("Invalid JSON:", xhr.responseText);
//           setLoading(false);
//           updateQueue(id, { progress: 0, status: "Bad response ❌" });
//           return;
//         }
//         if (!data.file) throw new Error();

//         onAddBook(
//           mapUploadToBook(data.file, {
//             title,
//             author,
//             color: makeCover(title),
//           }),
//         );

//         updateQueue(id, { progress: 100, status: "Done ✅" });
//         setMessage("Upload successful ✅");

//         setTitle("");
//         setAuthor("");
//         setFile(null);
//         setCoverPreview("");
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         if (coverInputRef.current) coverInputRef.current.value = "";
//       } catch {
//         updateQueue(id, { progress: 0, status: "Failed ❌" });
//         setMessage("Upload failed ❌");
//       }
//     };

//     xhr.onerror = () => {
//       setLoading(false);
//       updateQueue(id, { progress: 0, status: "Network error ❌" });
//       setMessage("Network error ❌");
//     };

//     xhr.ontimeout = () => {
//       setLoading(false);
//       updateQueue(id, { progress: 0, status: "Timeout ❌" });
//       setMessage("Upload timed out ❌");
//     };

//     // ✅ Mobile Chrome fix: timeout thoda zyada rakho
//     xhr.timeout = 5 * 60 * 1000; // 5 minutes

//     xhr.send(body);
//   };

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="upload-wrap">
//         <div className="upload-panel">
//           <h2 className="upload-title">📚 Upload Book</h2>

//           <div className="upload-form">
//             <label className="upload-label">Book Title *</label>
//             <input
//               className="upload-input"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label className="upload-label">Author</label>
//             <input
//               className="upload-input"
//               value={author}
//               onChange={(e) => setAuthor(e.target.value)}
//             />

//             <label className="upload-label">
//               📄 Book File (PDF / DOC / TXT)
//             </label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="upload-input"
//               accept=".pdf,.doc,.docx,.txt"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//             {file && <p className="upload-label">Selected: {file.name}</p>}

//             <label className="upload-label">🖼 Cover Image</label>
//             <input
//               type="file"
//               ref={coverInputRef}
//               className="upload-input"
//               accept="image/*"
//               onChange={(e) => selectCover(e.target.files[0])}
//             />
//             {coverPreview && (
//               <div className="cover-preview">
//                 <img src={coverPreview} alt="preview" />
//               </div>
//             )}

//             <label className="upload-label">🔒 Visibility</label>
//             <select
//               className="upload-input"
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//             >
//               <option value="private">Private 🔒</option>
//               <option value="public">Public 🌍</option>
//             </select>

//             <button
//               className="upload-btn"
//               onClick={handleUpload}
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload Book"}
//             </button>

//             {message && (
//               <p
//                 className={message.includes("successful") ? "success" : "error"}
//               >
//                 {message}
//               </p>
//             )}
//           </div>

//           {/* ✅ Progress UI with % */}
//           {queue.map((q) => (
//             <div className="queue-item" key={q.id}>
//               <div className="progress-header">
//                 <span className="progress-name">{q.name}</span>
//                 <span className="progress-pct">
//                   {q.progress === -1 ? "..." : `${q.progress}%`}
//                 </span>
//               </div>
//               <div className="progress-track">
//                 <div
//                   className="progress-fill"
//                   style={{
//                     width: q.progress === -1 ? "60%" : `${q.progress}%`,
//                     // Animated shimmer when progress unknown
//                     animation:
//                       q.progress === -1 ? "shimmer 1.5s infinite" : "none",
//                   }}
//                 />
//               </div>
//               <div className="progress-status">{q.status}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Shimmer animation for unknown progress */}
//       <style>{`
//         @keyframes shimmer {
//           0% { opacity: 1; }
//           50% { opacity: 0.4; }
//           100% { opacity: 1; }
//         }
//       `}</style>
//     </>
//   );
// }
import { useRef, useState } from "react";
import { API_URL, TOKEN_KEY } from "../lib/api";
import { makeCover, mapUploadToBook } from "../utils/books";

const CSS = `
.upload-wrap {
  padding: 16px;
  padding-top: 40px;
  background: var(--app-bg);
  min-height: 100vh;
  color: var(--app-text);
  font-family: system-ui, sans-serif;
}
@media (max-width: 600px) {
  .upload-wrap { padding-top: 70px; }
}
.upload-panel {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  padding: 16px;
}
.upload-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.upload-form { display: grid; gap: 12px; }
.upload-input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  color: var(--app-text);
}
.upload-input::placeholder { color: var(--app-text-muted); }
.upload-label { font-size: 0.8rem; color: var(--app-text-muted); }
.upload-btn {
  background: var(--app-accent);
  border: none;
  padding: 12px;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}
.upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.upload-btn.secondary {
  background: color-mix(in srgb, var(--app-text) 6%, transparent);
  border: 1px solid var(--app-border);
  color: var(--app-text);
}
.cover-preview img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 10px;
}
.success { color: #4ade80; }
.error { color: var(--app-accent); }
.queue-item {
  background: var(--app-surface-2);
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.progress-pct { font-size: 0.8rem; color: #ff4d5a; font-weight: 700; }
.progress-name {
  font-size: 0.85rem; color: var(--app-text-soft);
  white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; max-width: 70%;
}
.progress-status { font-size: 0.75rem; color: var(--app-text-muted); margin-top: 4px; }
.progress-track {
  height: 8px;
  background: color-mix(in srgb, var(--app-text) 10%, transparent);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, color-mix(in srgb, var(--app-accent) 60%, white), var(--app-accent));
  border-radius: 999px;
  transition: width 0.25s ease;
}
@keyframes shimmer {
  0%,100% { opacity: 1; } 50% { opacity: 0.4; }
}
.upload-success-card {
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(74,222,128,0.12), rgba(74,222,128,0.04));
  border: 1px solid rgba(74,222,128,0.2);
}
.upload-success-title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #d6ffe4;
}
.upload-success-copy {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--app-text-soft);
}
.upload-success-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
@media (max-width: 600px) {
  .upload-success-actions {
    grid-template-columns: 1fr;
  }
}
`;

export default function UploadBook({ onAddBook, onOpenReader, onOpenCoach }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [queue, setQueue] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("private");
  const [uploadedBook, setUploadedBook] = useState(null);
  const coverInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // ✅ Mobile Chrome sometimes gives wrong MIME — fallback by extension
  const extMimeMap = {
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const getEffectiveMime = (f) => {
    if (allowedTypes.includes(f.type)) return f.type;
    const ext = "." + f.name.split(".").pop().toLowerCase();
    return extMimeMap[ext] || f.type;
  };

  const selectCover = (f) => {
    if (!f || !f.type.startsWith("image/")) {
      setMessage("Only image allowed for cover ❌");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const titleDraft = title.trim().replace(/\s+/g, " ");
  const authorDraft = author.trim().replace(/\s+/g, " ");
  const titleLiveError =
    title && titleDraft.length < 3
      ? "Title must be at least 3 characters."
      : "";
  const authorLiveError =
    author && authorDraft.length > 0 && authorDraft.length < 2
      ? "Author must be at least 2 characters."
      : "";

  const handleUpload = async () => {
    setMessage("");
    setUploadedBook(null);

    const cleanTitle = titleDraft;
    const cleanAuthor = authorDraft;

    if (!cleanTitle) return setMessage("Title required ❌");
    if (cleanTitle.length < 3)
      return setMessage("Title must be at least 3 characters ❌");
    if (cleanTitle.length > 40)
      return setMessage("Title must stay under 40 characters ❌");
    if (!file) return setMessage("Select document file ❌");

    const effectiveMime = getEffectiveMime(file);
    if (!allowedTypes.includes(effectiveMime))
      return setMessage(`File type not allowed: ${file.type} ❌`);
    if (cleanAuthor && cleanAuthor.length < 2)
      return setMessage("Author must be at least 2 characters ❌");
    if (cleanAuthor && cleanAuthor.length > 20)
      return setMessage("Author must stay under 20 characters ❌");

    setLoading(true);
    const id = crypto.randomUUID();

    // Smooth fake progress (real XHR progress unreliable on mobile)
    const fileSizeMB = file.size / (1024 * 1024);
    const estimatedMs = Math.max(6000, fileSizeMB * 4000);
    let fakeProgress = 0;
    const totalTicks = estimatedMs / 100;

    setQueue([{ id, name: file.name, progress: 0, status: "Starting..." }]);

    const ticker = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 88 / totalTicks, 88);
      const pct = Math.round(fakeProgress);
      setQueue([
        { id, name: file.name, progress: pct, status: `Uploading... ${pct}%` },
      ]);
    }, 100);

    try {
      const body = new FormData();
      // ✅ KEY FIX: append file with explicit corrected MIME type
      // Mobile Chrome sends wrong MIME — create new Blob with correct type
      const fileBlob =
        effectiveMime !== file.type
          ? new Blob([file], { type: effectiveMime })
          : file;
      body.append("file", fileBlob, file.name);
      body.append("title", cleanTitle);
      body.append("author", cleanAuthor || "Unknown");
      body.append("type", type);

      const coverFile = coverInputRef.current?.files?.[0];
      if (coverFile) body.append("cover", coverFile, coverFile.name);

      const token = localStorage.getItem(TOKEN_KEY);

      // ✅ fetch — more reliable than XHR on mobile
      // ✅ NO Content-Type header — browser sets multipart boundary automatically
      const res = await fetch(`${API_URL}/api/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      clearInterval(ticker);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status} (invalid response)`);
      }

      if (!res.ok) {
        throw new Error(data?.message || `Server error ${res.status}`);
      }

      if (!data.file) throw new Error("No file in response");

      const nextBook = mapUploadToBook(data.file, {
        title: cleanTitle,
        author: cleanAuthor,
        color: makeCover(cleanTitle),
      });

      onAddBook?.(nextBook);
      setUploadedBook(nextBook);

      setQueue([{ id, name: file.name, progress: 100, status: "Done ✅" }]);
      setMessage("Upload successful. Continue with this book ✅");

      setTitle("");
      setAuthor("");
      setFile(null);
      setCoverPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";
    } catch (err) {
      clearInterval(ticker);
      setQueue([{ id, name: file.name, progress: 0, status: "Failed ❌" }]);
      setMessage(`Upload failed: ${err.message} ❌`);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="upload-wrap">
        <div className="upload-panel">
          <h2 className="upload-title">📚 Upload Book</h2>

          <div className="upload-form">
            <label className="upload-label">Book Title *</label>
            <input
              className="upload-input"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              maxLength={40}
            />
            <p className="upload-label">
              {title.length}/40
              {titleLiveError ? ` • ${titleLiveError}` : ""}
            </p>

            <label className="upload-label">Author</label>
            <input
              className="upload-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value.slice(0, 20))}
              maxLength={20}
            />
            <p className="upload-label">
              {author.length}/20
              {authorLiveError ? ` • ${authorLiveError}` : ""}
            </p>

            <label className="upload-label">
              📄 Book File (PDF / DOC / TXT)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="upload-input"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <p className="upload-label">
                Selected: {file.name}
                {!allowedTypes.includes(file.type) && (
                  <span style={{ color: "#facc15" }}>
                    {" "}
                    (type corrected automatically)
                  </span>
                )}
              </p>
            )}

            <label className="upload-label">🖼 Cover Image</label>
            <input
              type="file"
              ref={coverInputRef}
              className="upload-input"
              accept="image/*"
              onChange={(e) => selectCover(e.target.files[0])}
            />
            {coverPreview && (
              <div className="cover-preview">
                <img src={coverPreview} alt="preview" />
              </div>
            )}

            <label className="upload-label">🔒 Visibility</label>
            <select
              className="upload-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="private">Private 🔒</option>
              <option value="public">Public 🌍</option>
            </select>

            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Book"}
            </button>

            {message && (
              <p
                className={message.includes("successful") ? "success" : "error"}
              >
                {message}
              </p>
            )}
          </div>

          {queue.map((q) => (
            <div className="queue-item" key={q.id}>
              <div className="progress-header">
                <span className="progress-name">{q.name}</span>
                <span className="progress-pct">{q.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${q.progress}%` }}
                />
              </div>
              <div className="progress-status">{q.status}</div>
            </div>
          ))}

          {uploadedBook && (
            <div className="upload-success-card">
              <p className="upload-success-title">
                {uploadedBook.title} is ready
              </p>
              <p className="upload-success-copy">
                No need to go manually. Open the reader or jump straight into
                coach with this same book.
              </p>
              <div className="upload-success-actions">
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => onOpenCoach?.(uploadedBook)}
                >
                  Go to Coach
                </button>
                <button
                  type="button"
                  className="upload-btn secondary"
                  onClick={() => onOpenReader?.(uploadedBook)}
                >
                  Open Reader
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

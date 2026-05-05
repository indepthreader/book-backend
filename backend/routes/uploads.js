// const fs = require("fs");
// const fsp = require("fs/promises");
// const path = require("path");
// const multer = require("multer");
// const express = require("express");
// const mammoth = require("mammoth");
// const pdfParse = require("pdf-parse");

// const Upload = require("../models/Upload");
// const { auth } = require("../middleware/auth");

// const router = express.Router();
// const uploadDir = path.join(__dirname, "..", "storage", "uploads");
// const documentTypes = new Set([
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/msword",
//   "text/plain",
// ]);
// const imageTypes = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ]);

// fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
//     cb(null, `${Date.now()}-${safeName}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE || 10 * 1024 * 1024) },
//   fileFilter: (req, file, cb) => {
//     const isDocument =
//       file.fieldname === "file" && documentTypes.has(file.mimetype);
//     const isCover = file.fieldname === "cover" && imageTypes.has(file.mimetype);

//     if (!isDocument && !isCover) {
//       cb(
//         new Error(
//           file.fieldname === "cover"
//             ? "Only JPG, PNG, WEBP, and GIF cover images are allowed"
//             : "Only PDF, DOC, DOCX, and TXT files are allowed",
//         ),
//       );
//       return;
//     }
//     cb(null, true);
//   },
// });

// async function scanFile() {
//   return process.env.CLAMAV_SCAN_COMMAND ? "pending" : "skipped";
// }

// const mimeMap = {
//   ".jpg": "image/jpeg",
//   ".jpeg": "image/jpeg",
//   ".png": "image/png",
//   ".webp": "image/webp",
//   ".gif": "image/gif",
// };

// // Read image from disk → base64 data URI
// async function fileToBase64(filePath, mimeType) {
//   try {
//     const buffer = await fsp.readFile(filePath);
//     return `data:${mimeType};base64,${buffer.toString("base64")}`;
//   } catch {
//     return "";
//   }
// }

// // Append coverImageBase64 to any Upload doc before sending to client
// async function attachCoverBase64(doc) {
//   const obj = doc.toObject ? doc.toObject() : { ...doc };
//   if (obj.coverImagePath && obj.coverImageStoredName) {
//     const ext = path.extname(obj.coverImageStoredName).toLowerCase();
//     const mime = mimeMap[ext] || "image/jpeg";
//     obj.coverImageBase64 = await fileToBase64(obj.coverImagePath, mime);
//   } else {
//     obj.coverImageBase64 = "";
//   }
//   return obj;
// }

// async function extractText(file) {
//   try {
//     if (file.mimetype === "text/plain") {
//       const text = await fsp.readFile(file.path, "utf8");
//       return {
//         textContent: text,
//         textExtractStatus: text.trim() ? "extracted" : "empty",
//       };
//     }

//     if (file.mimetype === "application/pdf") {
//       const buffer = await fsp.readFile(file.path);
//       const result = await pdfParse(buffer);
//       const text = result.text || "";
//       return {
//         textContent: text,
//         textExtractStatus: text.trim() ? "extracted" : "empty",
//       };
//     }

//     if (
//       file.mimetype ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//       file.mimetype === "application/msword"
//     ) {
//       const result = await mammoth.extractRawText({ path: file.path });
//       const text = result.value || "";
//       return {
//         textContent: text,
//         textExtractStatus: text.trim() ? "extracted" : "empty",
//       };
//     }

//     return { textContent: "", textExtractStatus: "unsupported" };
//   } catch (error) {
//     return {
//       textContent: "",
//       textExtractStatus: "failed",
//       textExtractError: error.message,
//     };
//   }
// }

// // GET /uploads/my — current user's uploads
// router.get("/my", auth, async (req, res, next) => {
//   try {
//     const files = await Upload.find({ user: req.user.id }).sort({
//       createdAt: -1,
//     });
//     const result = await Promise.all(files.map(attachCoverBase64));
//     res.json({ success: true, files: result });
//   } catch (error) {
//     next(error);
//   }
// });

// // GET /uploads — all uploads (admin)
// router.get("/", auth, async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const isAdmin = req.user.role === "admin";

//     let query;

//     if (isAdmin) {
//       // 🔥 admin sees everything
//       query = {};
//     } else {
//       // 👇 normal user rules
//       query = {
//         $or: [
//           { type: "public" }, // 🌍 everyone sees public
//           { type: "private", user: userId }, // 🔒 only owner sees private
//         ],
//       };
//     }

//     const files = await Upload.find(query).sort({ createdAt: -1 });

//     const result = await Promise.all(files.map(attachCoverBase64));

//     res.json({
//       success: true,
//       count: result.length,
//       files: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // POST /uploads — upload document + optional cover

// router.post(
//   "/",
//   auth,
//   upload.fields([
//     { name: "file", maxCount: 1 },
//     { name: "cover", maxCount: 1 },
//   ]),
//   async (req, res, next) => {
//     try {
//       const documentFile = req.files?.file?.[0];
//       const coverFile = req.files?.cover?.[0];

//       // ✅ Proper validation
//       if (!documentFile) {
//         return res.status(400).json({
//           success: false,
//           message: "Document file is required",
//         });
//       }

//       // Extra safety (optional)
//       if (!documentTypes.has(documentFile.mimetype)) {
//         return res.status(400).json({
//           success: false,
//           message: "Only PDF, DOC, DOCX, and TXT files are allowed",
//         });
//       }

//       // Extract text
//       const textExtraction = await extractText(documentFile);

//       // Cover handling
//       const coverFields = coverFile
//         ? {
//             coverImageOriginalName: coverFile.originalname,
//             coverImageStoredName: coverFile.filename,
//             coverImagePath: coverFile.path,
//             coverImageUrl: `/api/storage/uploads/${coverFile.filename}`,
//           }
//         : {
//             coverImageOriginalName: "",
//             coverImageStoredName: "",
//             coverImagePath: "",
//             coverImageUrl: "",
//           };
//       if (!["private", "public"].includes(req.body.type)) {
//         req.body.type = "private";
//       }
//       // Save DB
//       const file = await Upload.create({
//         user: req.user.id,
//         title: String(req.body.title || "").trim(),
//         author: String(req.body.author || "").trim(),
//         originalName: documentFile.originalname,
//         storedName: documentFile.filename,
//         path: documentFile.path,
//         fileUrl: `/api/storage/uploads/${documentFile.filename}`,
//         mimeType: documentFile.mimetype,
//         size: documentFile.size,
//         category: req.body.category || "book",
//         uploadStatus: "saved",
//         ...textExtraction,
//         scanStatus: await scanFile(documentFile.path),
//         storageProvider: process.env.CLOUD_STORAGE_BUCKET
//           ? "cloud-pending"
//           : "local",
//         ...coverFields,
//         type: req.body.type || "private",
//       });

//       const fileWithCover = await attachCoverBase64(file);

//       res.status(201).json({
//         success: true,
//         message: "Upload successful ✅",
//         file: fileWithCover,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );
// // DELETE /uploads/:id
// router.delete("/:id", auth, async (req, res, next) => {
//   try {
//     const file = await Upload.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!file) {
//       return res
//         .status(404)
//         .json({ success: false, message: "File not found" });
//     }

//     if (file.coverImagePath) {
//       fs.rm(file.coverImagePath, { force: true }, () => {});
//     }

//     fs.rm(file.path, { force: true }, async () => {
//       await file.deleteOne();
//       res.json({ success: true });
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const multer = require("multer");
const express = require("express");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const Upload = require("../models/Upload");
const { auth } = require("../middleware/auth");
const {
  DEFAULT_MAX_UPLOAD_SIZE,
  getAppConfigValue,
} = require("../servies/appConfig");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "storage", "uploads");

const documentTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
]);
const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // ✅ FIX: Mobile Chrome sends weird filenames sometimes — sanitize properly
    const ext = path.extname(file.originalname) || "";
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function createUploadMiddleware(maxUploadSize) {
  return multer({
    storage,
    limits: {
      fileSize: Number(maxUploadSize) || DEFAULT_MAX_UPLOAD_SIZE,
      // ✅ FIX: Mobile Chrome sometimes splits fields — increase field limits
      fields: 20,
      files: 5,
    },
    fileFilter: (req, file, cb) => {
      // ✅ FIX: Mobile Chrome may send wrong MIME for .docx — check by extension too
      const ext = path.extname(file.originalname).toLowerCase();
      const extMimeMap = {
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      let effectiveMime = file.mimetype;

      // Mobile Chrome fix: if mime is wrong but extension is valid, correct it
      if (file.fieldname === "file" && !documentTypes.has(file.mimetype)) {
        if (extMimeMap[ext]) {
          effectiveMime = extMimeMap[ext];
          file.mimetype = effectiveMime; // patch it
        }
      }

      const isDocument =
        file.fieldname === "file" && documentTypes.has(effectiveMime);
      const isCover =
        file.fieldname === "cover" && imageTypes.has(file.mimetype);

      if (!isDocument && !isCover) {
        return cb(
          new Error(
            file.fieldname === "cover"
              ? "Only JPG, PNG, WEBP, GIF allowed for cover"
              : `File type not allowed: ${file.mimetype} (${ext})`,
          ),
        );
      }
      cb(null, true);
    },
  });
}

async function scanFile() {
  return process.env.CLAMAV_SCAN_COMMAND ? "pending" : "skipped";
}

async function getMaxUploadSize() {
  const value = await getAppConfigValue("MAX_UPLOAD_SIZE");
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0
    ? numeric
    : DEFAULT_MAX_UPLOAD_SIZE;
}

const mimeMap = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

async function fileToBase64(filePath, mimeType) {
  try {
    const buffer = await fsp.readFile(filePath);
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
}

async function attachCoverBase64(doc) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj.coverImagePath && obj.coverImageStoredName) {
    const ext = path.extname(obj.coverImageStoredName).toLowerCase();
    const mime = mimeMap[ext] || "image/jpeg";
    obj.coverImageBase64 = await fileToBase64(obj.coverImagePath, mime);
  } else {
    obj.coverImageBase64 = "";
  }
  return obj;
}

async function extractText(file) {
  try {
    if (file.mimetype === "text/plain") {
      const text = await fsp.readFile(file.path, "utf8");
      return {
        textContent: text,
        textExtractStatus: text.trim() ? "extracted" : "empty",
      };
    }

    if (file.mimetype === "application/pdf") {
      const buffer = await fsp.readFile(file.path);
      const result = await pdfParse(buffer);
      const text = result.text || "";
      return {
        textContent: text,
        textExtractStatus: text.trim() ? "extracted" : "empty",
      };
    }

    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      const text = result.value || "";
      return {
        textContent: text,
        textExtractStatus: text.trim() ? "extracted" : "empty",
      };
    }

    return { textContent: "", textExtractStatus: "unsupported" };
  } catch (error) {
    return {
      textContent: "",
      textExtractStatus: "failed",
      textExtractError: error.message,
    };
  }
}

// ✅ Multer error handler middleware
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      const fallbackSize = Number(req.maxUploadSize) || DEFAULT_MAX_UPLOAD_SIZE;
      return res.status(400).json({
        success: false,
        message: `File too large. Max size: ${Math.round(fallbackSize / 1024 / 1024)}MB`,
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
}

// GET /uploads/my
router.get("/my", auth, async (req, res, next) => {
  try {
    const files = await Upload.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    const result = await Promise.all(files.map(attachCoverBase64));
    res.json({ success: true, files: result });
  } catch (error) {
    next(error);
  }
});

// GET /uploads — all (admin) or filtered (user)
router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const query = isAdmin
      ? {}
      : { $or: [{ type: "public" }, { type: "private", user: userId }] };

    const files = await Upload.find(query).sort({ createdAt: -1 });
    const result = await Promise.all(files.map(attachCoverBase64));

    res.json({ success: true, count: result.length, files: result });
  } catch (error) {
    next(error);
  }
});

// POST /uploads
router.post(
  "/",
  auth,
  // ✅ FIX: Wrap multer in custom middleware to catch its errors properly
  async (req, res, next) => {
    try {
      req.maxUploadSize = await getMaxUploadSize();
      createUploadMiddleware(req.maxUploadSize).fields([
        { name: "file", maxCount: 1 },
        { name: "cover", maxCount: 1 },
      ])(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const documentFile = req.files?.file?.[0];
      const coverFile = req.files?.cover?.[0];

      if (!documentFile) {
        return res.status(400).json({
          success: false,
          message:
            "Document file is required. Got fields: " +
            JSON.stringify(Object.keys(req.files || {})),
        });
      }

      if (!documentTypes.has(documentFile.mimetype)) {
        // Clean up uploaded file
        fs.rm(documentFile.path, { force: true }, () => {});
        return res.status(400).json({
          success: false,
          message: `File type not allowed: ${documentFile.mimetype}`,
        });
      }

      const textExtraction = await extractText(documentFile);

      const coverFields = coverFile
        ? {
            coverImageOriginalName: coverFile.originalname,
            coverImageStoredName: coverFile.filename,
            coverImagePath: coverFile.path,
            coverImageUrl: `/api/storage/uploads/${coverFile.filename}`,
          }
        : {
            coverImageOriginalName: "",
            coverImageStoredName: "",
            coverImagePath: "",
            coverImageUrl: "",
          };

      const type = ["private", "public"].includes(req.body.type)
        ? req.body.type
        : "private";

      const file = await Upload.create({
        user: req.user.id,
        title: String(req.body.title || "").trim(),
        author: String(req.body.author || "").trim(),
        originalName: documentFile.originalname,
        storedName: documentFile.filename,
        path: documentFile.path,
        fileUrl: `/api/storage/uploads/${documentFile.filename}`,
        mimeType: documentFile.mimetype,
        size: documentFile.size,
        category: req.body.category || "book",
        uploadStatus: "saved",
        ...textExtraction,
        scanStatus: await scanFile(documentFile.path),
        storageProvider: process.env.CLOUD_STORAGE_BUCKET
          ? "cloud-pending"
          : "local",
        ...coverFields,
        type,
      });

      const fileWithCover = await attachCoverBase64(file);

      res.status(201).json({
        success: true,
        message: "Upload successful",
        file: fileWithCover,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /uploads/:id
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const file = await Upload.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    if (file.coverImagePath) {
      fs.rm(file.coverImagePath, { force: true }, () => {});
    }

    fs.rm(file.path, { force: true }, async () => {
      await file.deleteOne();
      res.json({ success: true });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

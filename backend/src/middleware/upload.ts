import multer from "multer";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  },
});

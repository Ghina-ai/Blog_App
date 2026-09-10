import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //max 5MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const extension = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(new Error("hanya file JPG, JPEG, dan PNG yang diperbolehkan!!"));
        }
        },
}).single("image"); //"image" adalah nama key/field saat upload file
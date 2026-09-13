import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //max 5MB
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("hanya file gambar yang diperbolehkan!!"));
        }
    },
});//"image" adalah nama key/field saat upload file

export const uploadSingleImage = upload.single("image");
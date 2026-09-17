import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // max 5MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        const allowedExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
        ];

        const fileExtension = file.originalname
            .toLowerCase()
            .substring(file.originalname.lastIndexOf("."));

        if (
            allowedMimeTypes.includes(file.mimetype) ||
            allowedExtensions.includes(fileExtension)
        ) {
            cb(null, true);
        } else {
            cb(new Error("hanya file gambar yang diperbolehkan!!"));
        }
    },
});

// "image" adalah nama key/field saat upload file
export const uploadSingleImage = upload.single("image");
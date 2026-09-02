const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads folder exists
const uploadPath = path.join(__dirname, "..", "PL", "public", "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {

    // Employee photo OR Carousel photo → images
    if (file.fieldname === "photo" || file.fieldname === "carouselPhoto") {

        const allowedExt = /jpeg|jpg|png|gif/;
        const extName = allowedExt.test(path.extname(file.originalname).toLowerCase());
        const mimeType = file.mimetype.startsWith("image/");

        if (extName && mimeType) return cb(null, true);
        else return cb(new Error("Image must be jpeg, jpg, png or gif"));

    } else if (file.fieldname === "resume") {

        if (file.mimetype === "application/pdf")
            return cb(null, true);
        else
            return cb(new Error("Resume must be a PDF"));

    } else {
        return cb(new Error("Invalid file"));
    }
};


const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

module.exports = upload;

const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require("../controllers/complaintController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

const cloudinary = require("../config/cloudinary");

const router = express.Router();


// ================================
// Image Upload Settings
// ================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});


// ================================
// Upload Image to Cloudinary
// ================================

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "civicfix",
        resource_type: "image"
      },

      (error, result) => {

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }

      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);

  });
};


// ================================
// User Routes
// ================================

router.post(
  "/",
  protect,
  upload.single("image"),

  async (req, res, next) => {

    try {

      // Upload image to Cloudinary
      if (req.file) {

        const result =
          await uploadToCloudinary(req.file);

        // Store Cloudinary URL
        req.file.cloudinaryUrl =
          result.secure_url;

      }

      next();

    } catch (error) {

      console.error(
        "Cloudinary upload error:",
        error.message
      );

      return res.status(500).json({
        message: "Image upload failed"
      });

    }

  },

  createComplaint
);


router.get(
  "/my",
  protect,
  getMyComplaints
);


// ================================
// Admin Routes
// ================================

router.get(
  "/",
  protect,
  adminOnly,
  getAllComplaints
);


router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);


router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteComplaint
);


module.exports = router;
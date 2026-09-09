const express = require("express");
const multer = require("multer");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require("../controllers/complaintController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Image storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// User routes
router.post(
  "/",
  protect,
  upload.single("image"),
  createComplaint
);

router.get(
  "/my",
  protect,
  getMyComplaints
);

// Admin routes
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
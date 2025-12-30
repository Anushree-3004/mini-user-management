const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getCurrentUser,
  updateProfile,
  changePassword,
} = require("../controller/userController");

// All user routes require authentication
router.use(authMiddleware);

// Get current user
router.get("/me", getCurrentUser);

// Update name/email
router.put("/me", updateProfile);

// Change password
router.put("/me/password", changePassword);

module.exports = router;

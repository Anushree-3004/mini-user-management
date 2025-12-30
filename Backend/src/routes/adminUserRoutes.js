const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  activateUser,
  deactivateUser,
} = require("../controller/adminUserController");

// Admin-only user management
router.use(authMiddleware);
router.use(adminMiddleware);

// View all users (pagination)
router.get("/", getAllUsers);

// Activate / deactivate
router.patch("/:id/activate", activateUser);
router.patch("/:id/deactivate", deactivateUser);

module.exports = router;

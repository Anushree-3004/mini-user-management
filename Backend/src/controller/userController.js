const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

// -------------------------
// Password strength checker
// -------------------------
function isStrongPassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Za-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

// -------------------------
// GET /api/users/me
// -------------------------
async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return sendError(res, {
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

// -------------------------
// PUT /api/users/me
// -------------------------
async function updateProfile(req, res, next) {
  try {
    const { fullName, email } = req.body;

    if (!fullName && !email) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "fullName or email is required",
      });
    }

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, {
        status: 409,
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email already in use",
      });
    }
    return next(err);
  }
}

// -------------------------
// PUT /api/users/me/password
// -------------------------
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "currentPassword and newPassword are required",
      });
    }

    // 🔐 Password strength validation (REQUIRED)
    if (!isStrongPassword(newPassword)) {
      return sendError(res, {
        status: 400,
        code: "WEAK_PASSWORD",
        message:
          "New password must be at least 8 characters long and include a letter and a number",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, {
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return sendError(res, {
        status: 401,
        code: "INVALID_PASSWORD",
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
  changePassword,
};

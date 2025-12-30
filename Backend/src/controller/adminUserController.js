const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

// GET /api/admin/users?page=1&limit=10
async function getAllUsers(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return res.json({
      users,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/users/:id/activate
async function activateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");

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

// PATCH /api/admin/users/:id/deactivate
async function deactivateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    ).select("-password");

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

module.exports = {
  getAllUsers,
  activateUser,
  deactivateUser,
};

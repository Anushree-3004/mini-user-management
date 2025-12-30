const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

// REGISTER
async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "fullName, email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, {
        status: 409,
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email already exists",
      });
    }
    return next(err);
  }
}

// LOGIN
// LOGIN
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, {
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    // ✅ REQUIRED: account status enforcement
    if (user.status !== "active") {
      return sendError(res, {
        status: 403,
        code: "ACCOUNT_INACTIVE",
        message: "Your account is deactivated. Contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, {
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
};

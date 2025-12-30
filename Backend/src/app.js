const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const { sendError } = require("./utils/apiResponse");

const app = express();

/**
 * Middleware
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/users", adminUserRoutes);

/**
 * 404 handler (must be after all routes)
 */
app.use((req, res) => {
  return sendError(res, {
    status: 404,
    code: "NOT_FOUND",
    message: "Route not found",
  });
});

/**
 * Central error handler
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code =
    err.code || (status === 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED");

  return sendError(res, {
    status,
    code,
    message: err.message || "Internal Server Error",
    details: err.details,
  });
});

module.exports = app;

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUserToken = async (role = "user") => {
  const user = await User.create({
    fullName: "Test",
    email: `${role}@test.com`,
    password: await bcrypt.hash("Password123", 10),
    role,
  });

  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );
};

describe("Admin RBAC", () => {
  it("blocks non-admin from admin route", async () => {
    const token = await createUserToken("user");

    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error.code).toBe("ADMIN_REQUIRED");
  });
});

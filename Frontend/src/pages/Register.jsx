import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * User registration form with password strength validation
 */
const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Password strength checker
  // -------------------------
  const isStrongPassword = (pwd) => {
    if (pwd.length < 8) return false;
    if (!/[A-Za-z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validations
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include a letter and a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/auth/register", {
        fullName: name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <form className="card auth-card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="muted">Register a new user</p>

          {error && <p className="error">{error}</p>}

          <label className="field">
            <span>Full Name</span>
            <input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {password && !isStrongPassword(password) && (
            <p className="error">
              Password must be at least 8 characters and include a letter and a
              number.
            </p>
          )}

          <label className="field">
            <span>Confirm Password</span>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {confirmPassword && confirmPassword !== password && (
            <p className="error">Passwords do not match.</p>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getErrorMessage } from "../api/getErrorMessage";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------
  // Password strength checker
  // -------------------------
  const isStrongPassword = (pwd) => {
    if (pwd.length < 8) return false;
    if (!/[A-Za-z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    return true;
  };

  // -------------------------
  // Fetch current user
  // -------------------------
  const fetchUser = async () => {
    setError("");
    try {
      const res = await apiClient.get("/users/me");
      setUser(res.data);
      setProfileForm({
        fullName: res.data.fullName,
        email: res.data.email,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // -------------------------
  // Update profile
  // -------------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await apiClient.put("/users/me", profileForm);
      setUser(res.data);
      setSuccess("Profile updated successfully");
      setIsEditOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Change password
  // -------------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(passwordForm.newPassword)) {
      setError(
        "New password must be at least 8 characters long and include a letter and a number"
      );
      setLoading(false);
      return;
    }

    try {
      await apiClient.put("/users/me/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccess("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="muted">Loading profile...</p>;
  }

  return (
    <div className="container">
      <h2>My Profile</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Profile Info */}
      <div className="card">
        <h3>Profile Information</h3>
        <p>
          <strong>Full Name:</strong> {user.fullName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <div className="actions">
          <button className="btn" onClick={() => setIsEditOpen(true)}>
            Edit Profile
          </button>
          <button className="btn" onClick={() => setIsPasswordOpen(true)}>
            Change Password
          </button>
        </div>
      </div>

      {/* ---------------- Edit Profile Modal ---------------- */}
      {isEditOpen && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button
                className="modal-close"
                onClick={() => setIsEditOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <label className="field">
                <span>Full Name</span>
                <input
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <div className="actions">
                <button className="btn" type="submit" disabled={loading}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Change Password Modal ---------------- */}
      {isPasswordOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                className="modal-close"
                onClick={() => setIsPasswordOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <label className="field">
                <span>Current Password</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label className="field">
                <span>New Password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <div className="actions">
                <button className="btn" type="submit" disabled={loading}>
                  Update Password
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

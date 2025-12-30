import { useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * Admin Dashboard — User Management
 */
const Admin = () => {
  const { role } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(""); // activate | deactivate
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ------------------------
  // Fetch users (admin only)
  // ------------------------
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.get(
        `/admin/users?page=${pageNumber}&limit=10`
      );

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchUsers(1);
    }
  }, [role]);

  // ------------------------
  // Modal handlers
  // ------------------------
  const openConfirmModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType("");
    setIsModalOpen(false);
  };

  // ------------------------
  // Activate / Deactivate
  // ------------------------
  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    setError("");

    try {
      await apiClient.patch(`/admin/users/${selectedUser._id}/${actionType}`);
      closeModal();
      fetchUsers(page);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // ------------------------
  // Guard
  // ------------------------
  if (role !== "admin") {
    return (
      <div className="container">
        <h2>Admin Dashboard</h2>
        <p className="error">Admin access required.</p>
      </div>
    );
  }

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading users...</p>}

      <div className="card">
        <div className="card-row">
          <h3>User Management</h3>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => fetchUsers(page)}
          >
            Refresh
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.fullName}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={
                      u.status === "active" ? "badge success" : "badge danger"
                    }
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
                </td>
                <td>
                  {u.status === "active" ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openConfirmModal(u, "deactivate")}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openConfirmModal(u, "activate")}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && users.length === 0 && (
          <p className="muted">No users found.</p>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => fetchUsers(page - 1)}
          >
            Prev
          </button>

          <span className="muted">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => fetchUsers(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button
                className="modal-close"
                type="button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <p>
              Are you sure you want to <strong>{actionType}</strong> this user?
            </p>
            <p className="muted">{selectedUser.email}</p>

            <div className="actions">
              <button className="btn" onClick={handleConfirmAction}>
                Yes, Confirm
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

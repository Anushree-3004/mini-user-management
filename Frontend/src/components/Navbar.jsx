import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="nav-brand">User Management</span>

        {role === "admin" && (
          <Link className="nav-link" to="/admin">
            Admin
          </Link>
        )}

        {isAuthenticated && (
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        )}
      </div>

      <div className="nav-right">
        {isAuthenticated && (
          <>
            <span className="nav-role">{role}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

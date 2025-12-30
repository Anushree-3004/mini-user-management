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
      <Link to="/" className="brand">
        User Management
      </Link>

      {!isAuthenticated && (
        <div className="nav-links">
          <Link to="/login" btn btn-secondary>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/profile">My Profile</Link>

          {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

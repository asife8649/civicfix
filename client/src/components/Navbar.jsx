import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏙️</span>
          <span>CivicFix</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          {user && (
            <Link to="/dashboard">
              Dashboard
            </Link>
          )}

          {user && user.role !== "admin" && (
            <>
              <Link to="/create-complaint">
                New Complaint
              </Link>

              <Link to="/my-complaints">
                My Complaints
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin/complaints">
              Manage Complaints
            </Link>
          )}

        </div>

        {/* User Section */}
        <div className="navbar-user">

          {user ? (
            <>
              <div className="user-info">

                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="user-details">
                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.role === "admin"
                      ? "Administrator"
                      : "Citizen"}
                  </span>
                </div>

              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}
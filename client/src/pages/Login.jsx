import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      loginUser(data);

      navigate(
        data.user.role === "admin"
          ? "/admin"
          : "/dashboard"
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>

        <div className="auth-logo">
          🏙️
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your CivicFix account
        </p>

        <div className="auth-form">

          <label>
            Email

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-button"
          >
            Login →
          </button>

        </div>

        {message && (
          <p className="error">
            {message}
          </p>
        )}

        <div className="auth-footer">
          New user?{" "}
          <Link to="/register">
            Create account
          </Link>
        </div>

      </form>
    </main>
  );
}
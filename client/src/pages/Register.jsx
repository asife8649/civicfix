import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>

        <div className="auth-logo">
          🏙️
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join CivicFix and report civic problems
        </p>

        <div className="auth-form">

          <label>
            Full Name

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-button"
          >
            Create Account →
          </button>

        </div>

        {message && (
          <p className="error">
            {message}
          </p>
        )}

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </form>
    </main>
  );
}
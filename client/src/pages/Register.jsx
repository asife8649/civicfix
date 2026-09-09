import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMessage("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h2>Create Account</h2>
        <p className="muted">Join CivicFix and report civic problems.</p>

        <input placeholder="Full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="btn primary full">Register</button>
        {message && <p className="message">{message}</p>}
        <p className="center">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

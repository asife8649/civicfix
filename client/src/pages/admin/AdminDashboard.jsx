import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api, { authConfig } from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api
      .get("/complaints", authConfig())
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <>
      <Navbar />

      <main className="container">

        <p className="eyebrow">ADMIN PANEL</p>

        <h1>Welcome, {user?.name}</h1>

        <p className="muted">
          Manage citizen complaints and monitor civic issues.
        </p>

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <p>Total Complaints</p>
              <h2>{total}</h2>
            </div>
          </div>

          <div className="stat-card pending-stat">
            <div className="stat-icon">⏳</div>
            <div>
              <p>Pending</p>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="stat-card progress-stat">
            <div className="stat-icon">🔄</div>
            <div>
              <p>In Progress</p>
              <h2>{inProgress}</h2>
            </div>
          </div>

          <div className="stat-card resolved-stat">
            <div className="stat-icon">✅</div>
            <div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
            </div>
          </div>

        </div>

        {/* Manage Complaints */}

        <div className="admin-action-card">

          <div>
            <p className="eyebrow">COMPLAINT MANAGEMENT</p>

            <h2>Manage Citizen Complaints</h2>

            <p className="muted">
              View complaints, update their status, check locations
              and remove invalid complaints.
            </p>
          </div>

          <Link
            className="admin-manage-button"
            to="/admin/complaints"
          >
            Manage Complaints →
          </Link>

        </div>

      </main>
    </>
  );
}
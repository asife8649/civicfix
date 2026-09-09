import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        {/* Header */}
        <section className="dashboard-header">

          <div>
            <p className="eyebrow">
              {user?.role === "admin"
                ? "ADMIN DASHBOARD"
                : "CITIZEN DASHBOARD"}
            </p>

            <h1>
              Welcome, {user?.name || "User"} 👋
            </h1>

            <p className="dashboard-subtitle">
              {user?.role === "admin"
                ? "Manage and monitor civic complaints from one place."
                : "Report local problems and track your complaints easily."}
            </p>
          </div>

        </section>


        {/* Admin Dashboard */}
        {user?.role === "admin" ? (

          <section className="dashboard-grid">

            <Link
              to="/admin/complaints"
              className="dashboard-action-card"
            >

              <div className="dashboard-card-icon">
                📋
              </div>

              <div>
                <h3>
                  Manage Complaints
                </h3>

                <p>
                  View, update and manage all
                  citizen complaints.
                </p>
              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>


            <div className="dashboard-info-card">

              <div className="dashboard-card-icon">
                👨‍💼
              </div>

              <div>
                <h3>
                  Administrator
                </h3>

                <p>
                  You have administrator access
                  to CivicFix.
                </p>
              </div>

            </div>

          </section>

        ) : (

          /* Citizen Dashboard */
          <section className="dashboard-grid">

            <Link
              to="/create-complaint"
              className="dashboard-action-card"
            >

              <div className="dashboard-card-icon">
                📝
              </div>

              <div>
                <h3>
                  Report a Problem
                </h3>

                <p>
                  Submit a new civic complaint
                  with image and location.
                </p>
              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>


            <Link
              to="/my-complaints"
              className="dashboard-action-card"
            >

              <div className="dashboard-card-icon">
                📋
              </div>

              <div>
                <h3>
                  My Complaints
                </h3>

                <p>
                  View your submitted complaints
                  and track their status.
                </p>
              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>

          </section>

        )}


        {/* Features */}
        <section className="dashboard-features">

          <div className="dashboard-feature">

            <span>📷</span>

            <div>

              <strong>
                Image Evidence
              </strong>

              <p>
                Attach photos to clearly show
                the reported issue.
              </p>

            </div>

          </div>


          <div className="dashboard-feature">

            <span>📍</span>

            <div>

              <strong>
                Location Capture
              </strong>

              <p>
                Capture the location of the
                civic problem automatically.
              </p>

            </div>

          </div>


          <div className="dashboard-feature">

            <span>🔄</span>

            <div>

              <strong>
                Status Tracking
              </strong>

              <p>
                Follow your complaint from
                Pending to Resolved.
              </p>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="home-page">

        {/* Hero Section */}
        <section className="hero-section">

          <div className="hero-content">

            <p className="eyebrow">
              SMART CIVIC COMPLAINT SYSTEM
            </p>

            <h1>
              Report Problems.
              <br />
              Improve Your Community.
            </h1>

            <p className="hero-description">
              CivicFix helps citizens report local problems
              such as road damage, electricity issues,
              water problems and garbage.
            </p>

            <div className="hero-buttons">

              {/* Citizen Buttons */}
              {user?.role !== "admin" && (
                <>
                  <Link
                    to="/create-complaint"
                    className="primary-btn"
                  >
                    📝 Report a Problem
                  </Link>

                  <Link
                    to="/my-complaints"
                    className="secondary-btn"
                  >
                    View My Complaints
                  </Link>
                </>
              )}

              {/* Admin Button */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/complaints"
                  className="primary-btn"
                >
                  📋 Manage Complaints
                </Link>
              )}

            </div>

          </div>


          {/* Hero Card */}
          <div className="hero-visual">

            <div className="hero-card">

              <div className="hero-card-icon">
                📍
              </div>

              <h3>
                Report Local Issues
              </h3>

              <p>
                Citizens can submit complaints
                with images and current location.
              </p>

              <div className="hero-mini-status">
                <span>●</span>
                Complaint Tracking
              </div>

            </div>

          </div>

        </section>


        {/* Features */}
        <section className="features-section">

          <div className="section-heading">

            <p className="eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Making civic reporting simple
            </h2>

            <p>
              Report an issue in a few simple steps
              and track its progress.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                📝
              </div>

              <h3>
                Submit Complaint
              </h3>

              <p>
                Describe the problem and select
                the appropriate category.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📷
              </div>

              <h3>
                Add Evidence
              </h3>

              <p>
                Upload an image to clearly show
                the problem.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📍
              </div>

              <h3>
                Capture Location
              </h3>

              <p>
                Automatically capture the location
                of the reported issue.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                🔄
              </div>

              <h3>
                Track Progress
              </h3>

              <p>
                Check whether your complaint is
                Pending, In Progress or Resolved.
              </p>

            </div>

          </div>

        </section>


        {/* Bottom CTA */}
        <section className="home-cta">

          <div>

            <h2>
              {user?.role === "admin"
                ? "Manage civic complaints efficiently."
                : "See a problem in your area?"}
            </h2>

            <p>
              {user?.role === "admin"
                ? "Review citizen complaints and update their status."
                : "Report it through CivicFix and help make your community better."}
            </p>

          </div>


          {user?.role === "admin" ? (

            <Link
              to="/admin/complaints"
              className="primary-btn"
            >
              Manage Complaints →
            </Link>

          ) : (

            <Link
              to="/create-complaint"
              className="primary-btn"
            >
              Get Started →
            </Link>

          )}

        </section>

      </main>
    </>
  );
}
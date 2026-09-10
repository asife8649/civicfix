import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="simple-home">

        {/* Hero Section */}
        <section className="simple-hero">

          <div className="hero-badge">
            Clean • Safe • Better Together
          </div>

          <h1>
            Let’s Build a Better{" "}
            <span>Community</span>
          </h1>

          <p className="simple-hero-text">
            Report civic issues, track progress, and make a real impact
            in your area.
            <br />
            Together we can create cleaner, safer, and more livable
            neighborhoods.
          </p>

          <div className="simple-hero-buttons">

            {user?.role === "admin" ? (
              <Link
                to="/admin/complaints"
                className="simple-primary-btn"
              >
                📋 Manage Complaints
              </Link>
            ) : (
              <>
                <Link
                  to="/create-complaint"
                  className="simple-primary-btn"
                >
                  📝 Report an Issue
                </Link>

                
              </>
            )}

          </div>

        </section>


        {/* Features */}
        <section className="simple-features">

          <div className="simple-feature-card">

            <div className="simple-feature-icon report-icon">
              📝
            </div>

            <div>
              <h3>Report</h3>

              <p>
                Quick and easy reporting
              </p>
            </div>

          </div>


          <div className="simple-feature-card">

            <div className="simple-feature-icon track-icon">
              🔄
            </div>

            <div>
              <h3>Track</h3>

              <p>
                Real-time updates
              </p>
            </div>

          </div>


          <div className="simple-feature-card">

            <div className="simple-feature-icon impact-icon">
              ❤️
            </div>

            <div>
              <h3>Impact</h3>

              <p>
                Stronger communities
              </p>
            </div>

          </div>

        </section>

      </main>
    </>
  );
}
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="container">
        <p className="eyebrow">ADMIN PANEL</p>
        <h1>Welcome, {user?.name}</h1>
        <p className="muted">Manage citizen complaints from one place.</p>

        <div className="grid two">
          <Link className="feature-card" to="/admin/complaints">
            <span>▣</span>
            <h3>Manage Complaints</h3>
            <p>View, update and delete complaints.</p>
          </Link>
        </div>
      </main>
    </>
  );
}

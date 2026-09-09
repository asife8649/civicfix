import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ComplaintCard from "../components/ComplaintCard";
import api, { authConfig } from "../services/api";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get("/complaints/my", authConfig())
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container">
        <p className="eyebrow">MY COMPLAINTS</p>
        <h1>Complaint History</h1>
        <div className="list">
          {complaints.length === 0
            ? <div className="empty">You have not submitted any complaints yet.</div>
            : complaints.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
        </div>
      </main>
    </>
  );
}

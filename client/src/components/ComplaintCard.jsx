export default function ComplaintCard({ complaint }) {
  return (
    <div className="card">
      <div className="card-top">
        <h3>{complaint.title}</h3>
        <span className={`status ${complaint.status.toLowerCase().replace(" ", "-")}`}>
          {complaint.status}
        </span>
      </div>
      <p>{complaint.description}</p>
      <p><b>Category:</b> {complaint.category}</p>
      <small>{new Date(complaint.created_at).toLocaleString()}</small>
    </div>
  );
}

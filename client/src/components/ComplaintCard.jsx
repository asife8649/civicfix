export default function ComplaintCard({ complaint }) {
  return (
    <div className="card">
      <div className="card-top">
        <h3>{complaint.title}</h3>

        <span
          className={`status ${complaint.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {complaint.status}
        </span>
      </div>

      <p>{complaint.description}</p>

      <p>
        <b>Category:</b> {complaint.category}
      </p>

      <small>
        {new Date(complaint.created_at).toLocaleString()}
      </small>

      {complaint.image && (
        <div className="complaint-image">
          <img
            src={`https://civicfix-0tmy.onrender.com/uploads/${complaint.image}`}
            alt="Complaint"
          />
        </div>
      )}

      {complaint.latitude && complaint.longitude && (
        <div className="complaint-location">
          <p>
            <b>📍 Location:</b>{" "}
            {complaint.latitude}, {complaint.longitude}
          </p>

          <a
            href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}
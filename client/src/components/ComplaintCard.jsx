export default function ComplaintCard({ complaint }) {
  const statusClass = complaint.status
    .toLowerCase()
    .replace(" ", "-");

  return (
    <div className="complaint-card">

      {/* Header */}
      <div className="complaint-card-header">

        <div>
          <h3>{complaint.title}</h3>

          <span className="complaint-category">
            🛣️ {complaint.category}
          </span>
        </div>

        <span className={`status-badge ${statusClass}`}>
          {complaint.status}
        </span>

      </div>


      {/* Description */}
      <p className="complaint-description">
        {complaint.description}
      </p>


      {/* Date */}
      <div className="complaint-meta">
        <span>
          📅{" "}
          {complaint.created_at
            ? new Date(
                complaint.created_at
              ).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Date not available"}
        </span>
      </div>


      {/* Image */}
      {complaint.image && (
        <div className="complaint-image-wrapper">

          <img
            src={
              complaint.image.startsWith("http")
                ? complaint.image
                : `https://civicfix-0tmy.onrender.com/uploads/${complaint.image}`
            }
            alt="Complaint evidence"
            className="complaint-image"
          />

        </div>
      )}


      {/* Location */}
      {complaint.latitude &&
        complaint.longitude && (

          <div className="complaint-location">

            <div>

              <span className="location-icon">
                📍
              </span>

              <div>

                <strong>
                  Complaint Location
                </strong>

                <p>
                  {complaint.latitude},{" "}
                  {complaint.longitude}
                </p>

              </div>

            </div>


            <a
              href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="map-button"
            >
              View on Map →
            </a>

          </div>
        )}

    </div>
  );
}
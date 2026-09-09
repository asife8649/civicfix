import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api, { authConfig } from "../../services/api";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  // Load complaints
  const loadComplaints = async () => {
    try {
      setMessage("");

      const res = await api.get(
        "/complaints",
        authConfig()
      );

      setComplaints(res.data);
    } catch (error) {
      console.error(
        "Load complaints error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Could not load complaints"
      );
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/complaints/${id}/status`,
        { status },
        authConfig()
      );

      loadComplaints();
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };

  // Delete complaint
  const remove = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this complaint?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/complaints/${id}`,
        authConfig()
      );

      loadComplaints();
    } catch (error) {
      console.error(
        "Delete complaint error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  // Parse location
  const getLocation = (details) => {
    if (!details) {
      return null;
    }

    try {
      return JSON.parse(details);
    } catch (error) {
      console.error(
        "Location parse error:",
        error
      );

      return null;
    }
  };

  // Status class
  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "admin-status resolved";
    }

    if (status === "In Progress") {
      return "admin-status progress";
    }

    return "admin-status pending";
  };

  return (
    <>
      <Navbar />

      <main className="admin-complaints-page">

        {/* Header */}
        <div className="admin-page-header">

          <div>

            <p className="eyebrow">
              ADMIN PANEL
            </p>

            <h1>
              Manage Complaints
            </h1>

            <p>
              Review citizen complaints, check
              locations and update their status.
            </p>

          </div>

          <div className="complaint-count">

            <span>
              Total
            </span>

            <strong>
              {complaints.length}
            </strong>

          </div>

        </div>


        {/* Error */}
        {message && (
          <div className="error">
            {message}
          </div>
        )}


        {/* Empty */}
        {complaints.length === 0 &&
          !message && (

            <div className="complaints-empty">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No complaints found
              </h3>

              <p>
                There are currently no citizen
                complaints to manage.
              </p>

            </div>

          )}


        {/* Desktop / Tablet */}
        {complaints.length > 0 && (

          <div className="admin-complaints-list">

            {complaints.map((c) => {

              const location =
                getLocation(
                  c.location_details
                );

              return (

                <article
                  className="admin-complaint-card"
                  key={c.id}
                >

                  {/* Complaint Header */}
                  <div className="admin-card-header">

                    <div>

                      <span className="admin-complaint-id">
                        Complaint #{c.id}
                      </span>

                      <h2>
                        {c.title}
                      </h2>

                    </div>

                    <span
                      className={getStatusClass(
                        c.status
                      )}
                    >
                      {c.status}
                    </span>

                  </div>


                  {/* Main Content */}
                  <div className="admin-card-body">

                    {/* Complaint Info */}
                    <div className="admin-section">

                      <h3>
                        Complaint Details
                      </h3>

                      <p className="admin-description">
                        {c.description}
                      </p>

                      <div className="admin-meta">

                        <span>
                          🏷️{" "}
                          <strong>
                            Category:
                          </strong>{" "}
                          {c.category}
                        </span>

                        <span>
                          🕒{" "}
                          <strong>
                            Submitted:
                          </strong>{" "}
                          {c.created_at
                            ? new Date(
                                c.created_at
                              ).toLocaleString(
                                "en-IN",
                                {
                                  dateStyle:
                                    "medium",
                                  timeStyle:
                                    "short"
                                }
                              )
                            : "Not available"}
                        </span>

                      </div>

                    </div>


                    {/* Citizen */}
                    <div className="admin-section">

                      <h3>
                        Citizen
                      </h3>

                      <div className="citizen-info">

                        <div className="citizen-avatar">
                          {c.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {c.name}
                          </strong>

                          <small>
                            {c.email}
                          </small>

                        </div>

                      </div>

                    </div>


                    {/* Image */}
                    <div className="admin-section">

                      <h3>
                        Evidence
                      </h3>

                      {c.image ? (

                        <img
                          className="admin-complaint-image"
                          src={`http://localhost:5000/uploads/${c.image}`}
                          alt="Complaint evidence"
                        />

                      ) : (

                        <div className="no-image">
                          No image uploaded
                        </div>

                      )}

                    </div>


                    {/* Location */}
                    <div className="admin-section">

                      <h3>
                        📍 Location
                      </h3>

                      {location ? (

                        <div className="admin-location">

                          {location.village && (
                            <div>
                              <strong>
                                Village:
                              </strong>{" "}
                              {location.village}
                            </div>
                          )}

                          {location.area && (
                            <div>
                              <strong>
                                Area:
                              </strong>{" "}
                              {location.area}
                            </div>
                          )}

                          {location.postOffice && (
                            <div>
                              <strong>
                                Post Office:
                              </strong>{" "}
                              {location.postOffice}
                            </div>
                          )}

                          {location.policeStation && (
                            <div>
                              <strong>
                                Police Station:
                              </strong>{" "}
                              {location.policeStation}
                            </div>
                          )}

                          {location.city && (
                            <div>
                              <strong>
                                City:
                              </strong>{" "}
                              {location.city}
                            </div>
                          )}

                          {location.district && (
                            <div>
                              <strong>
                                District:
                              </strong>{" "}
                              {location.district}
                            </div>
                          )}

                          {location.state && (
                            <div>
                              <strong>
                                State:
                              </strong>{" "}
                              {location.state}
                            </div>
                          )}

                          {location.country && (
                            <div>
                              <strong>
                                Country:
                              </strong>{" "}
                              {location.country}
                            </div>
                          )}

                          {location.pin && (
                            <div>
                              <strong>
                                PIN:
                              </strong>{" "}
                              {location.pin}
                            </div>
                          )}

                        </div>

                      ) : (

                        <div className="no-location">
                          No detailed location available
                        </div>

                      )}

                      {c.latitude &&
                        c.longitude && (

                          <a
                            className="map-button"
                            href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            🗺️ View on Google Maps
                          </a>

                        )}

                    </div>

                  </div>


                  {/* Footer / Actions */}
                  <div className="admin-card-footer">

                    <div className="status-control">

                      <label>
                        Update Status
                      </label>

                      <select
                        value={c.status}
                        onChange={(e) =>
                          updateStatus(
                            c.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>

                    </div>


                    <button
                      className="delete admin-delete-btn"
                      onClick={() =>
                        remove(c.id)
                      }
                    >
                      🗑️ Delete Complaint
                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </main>
    </>
  );
}
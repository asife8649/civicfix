import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api, { authConfig } from "../../services/api";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  // ========================================
  // Load Complaints
  // ========================================

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


  // ========================================
  // Update Status
  // ========================================

  const updateStatus = async (
    id,
    status
  ) => {
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


  // ========================================
  // Delete Complaint
  // ========================================

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


  // ========================================
  // Parse Location
  // ========================================

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


  // ========================================
  // Format MySQL UTC DateTime → IST
  // ========================================

  const formatDateTime = (value) => {

    if (!value) {
      return "Not available";
    }

    try {

      let date;

      /*
       * MySQL DATETIME usually comes as:
       *
       * 2026-09-10 17:59:10
       *
       * We explicitly treat it as UTC.
       */

      if (
        typeof value === "string"
      ) {

        let dateString =
          value.trim();

        if (
          dateString.includes("T")
        ) {

          /*
           * ISO timestamp
           */
          if (
            !dateString.endsWith("Z")
          ) {
            dateString += "Z";
          }

          date =
            new Date(
              dateString
            );

        } else {

          /*
           * MySQL DATETIME
           *
           * Convert:
           * 2026-09-10 17:59:10
           *
           * to:
           * 2026-09-10T17:59:10Z
           */

          date =
            new Date(
              dateString.replace(
                " ",
                "T"
              ) + "Z"
            );
        }

      } else {

        /*
         * If mysql2 returns a Date object
         */
        date =
          new Date(value);

      }


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "Not available";
      }


      /*
       * Always display in India time
       */
      return date.toLocaleString(
        "en-IN",
        {
          timeZone:
            "Asia/Kolkata",

          day: "2-digit",
          month: "short",
          year: "numeric",

          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",

          hour12: true
        }
      );

    } catch (error) {

      console.error(
        "Date formatting error:",
        error
      );

      return "Not available";
    }
  };


  // ========================================
  // Status Class
  // ========================================

  const getStatusClass = (
    status
  ) => {

    if (
      status === "Resolved"
    ) {
      return "admin-status resolved";
    }

    if (
      status === "In Progress"
    ) {
      return "admin-status progress";
    }

    return "admin-status pending";
  };


  // ========================================
  // Filter Complaints
  // ========================================

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (complaint) =>
            complaint.status ===
            filter
        );


  // ========================================
  // Status Counts
  // ========================================

  const pendingCount =
    complaints.filter(
      (c) =>
        c.status === "Pending"
    ).length;


  const progressCount =
    complaints.filter(
      (c) =>
        c.status === "In Progress"
    ).length;


  const resolvedCount =
    complaints.filter(
      (c) =>
        c.status === "Resolved"
    ).length;


  // ========================================
  // UI
  // ========================================

  return (
    <>
      <Navbar />

      <main className="admin-complaints-page">


        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-page-header">

          <div>

            <p className="eyebrow">
              ADMIN PANEL
            </p>

            <h1>
              Manage Complaints
            </h1>

            <p>
              Review citizen complaints,
              check locations and update
              their status.
            </p>

          </div>


          <div className="complaint-count">

            <span>
              Showing
            </span>

            <strong>
              {
                filteredComplaints.length
              }
            </strong>

            <small>
              of {complaints.length} complaints
            </small>

          </div>

        </div>


        {/* ==================================
            STATUS FILTERS
        ================================== */}

        <div className="admin-filter-bar">

          <button
            className={
              filter === "All"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setFilter("All")
            }
          >
            All

            <span>
              {complaints.length}
            </span>

          </button>


          <button
            className={
              filter === "Pending"
                ? "filter-button active pending-filter"
                : "filter-button"
            }
            onClick={() =>
              setFilter("Pending")
            }
          >
            ⏳ Pending

            <span>
              {pendingCount}
            </span>

          </button>


          <button
            className={
              filter === "In Progress"
                ? "filter-button active progress-filter"
                : "filter-button"
            }
            onClick={() =>
              setFilter("In Progress")
            }
          >
            🔄 In Progress

            <span>
              {progressCount}
            </span>

          </button>


          <button
            className={
              filter === "Resolved"
                ? "filter-button active resolved-filter"
                : "filter-button"
            }
            onClick={() =>
              setFilter("Resolved")
            }
          >
            ✅ Resolved

            <span>
              {resolvedCount}
            </span>

          </button>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {message && (

          <div className="error">
            {message}
          </div>

        )}


        {/* ==================================
            EMPTY
        ================================== */}

        {filteredComplaints.length === 0 &&
          !message && (

            <div className="complaints-empty">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No complaints found
              </h3>

              <p>
                {filter === "All"
                  ? "There are currently no citizen complaints to manage."
                  : `There are no ${filter.toLowerCase()} complaints.`}
              </p>

            </div>

          )}


        {/* ==================================
            COMPLAINT LIST
        ================================== */}

        {filteredComplaints.length > 0 && (

          <div className="admin-complaints-list">

            {filteredComplaints.map(
              (c) => {

                const location =
                  getLocation(
                    c.location_details
                  );


                return (

                  <article
                    className="admin-complaint-card"
                    key={c.id}
                  >


                    {/* =========================
                        HEADER
                    ========================= */}

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
                        className={
                          getStatusClass(
                            c.status
                          )
                        }
                      >
                        {c.status}
                      </span>

                    </div>


                    {/* =========================
                        BODY
                    ========================= */}

                    <div className="admin-card-body">


                      {/* =======================
                          COMPLAINT DETAILS
                      ======================= */}

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

                        </div>

                      </div>


                      {/* =======================
                          CITIZEN
                      ======================= */}

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


                      {/* =======================
                          EVIDENCE
                      ======================= */}

                      <div className="admin-section">

                        <h3>
                          Evidence
                        </h3>


                        {c.image ? (

                          <img
                            className="admin-complaint-image"
                            src={
                              c.image.startsWith(
                                "http"
                              )
                                ? c.image
                                : `https://civicfix-0tmy.onrender.com/uploads/${c.image}`
                            }
                            alt="Complaint evidence"
                          />

                        ) : (

                          <div className="no-image">
                            No image uploaded
                          </div>

                        )}

                      </div>


                      {/* =======================
                          LOCATION
                      ======================= */}

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


                        {/* =======================
                            GOOGLE MAP
                        ======================= */}

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


                        {/* =======================
                            CAPTURE + SUBMITTED TIME
                        ======================= */}

                        <div className="complaint-times">

                          {c.photo_captured_at && (

                            <p>

                              📷{" "}

                              <strong>
                                Photo Captured:
                              </strong>{" "}

                              {formatDateTime(
                                c.photo_captured_at
                              )}

                            </p>

                          )}


                          {c.location_captured_at && (

                            <p>

                              📍{" "}

                              <strong>
                                Location Captured:
                              </strong>{" "}

                              {formatDateTime(
                                c.location_captured_at
                              )}

                            </p>

                          )}


                          {c.created_at && (

                            <p>

                              🕒{" "}

                              <strong>
                                Submitted:
                              </strong>{" "}

                              {formatDateTime(
                                c.created_at
                              )}

                            </p>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="admin-card-footer">

                      <div className="status-control">

                        <label>
                          Update Status
                        </label>


                        <select
                          value={
                            c.status
                          }
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
              }
            )}

          </div>

        )}

      </main>
    </>
  );
}
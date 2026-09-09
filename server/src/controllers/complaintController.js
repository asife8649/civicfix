const db = require("../config/db");
const axios = require("axios");

// Reverse geocoding: GPS → detailed address
const getLocationDetails = async (latitude, longitude) => {
  try {
    if (!latitude || !longitude) {
      return null;
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          addressdetails: 1
        },
        headers: {
          "User-Agent": "CivicFix/1.0"
        },
        timeout: 10000
      }
    );

    const address = response.data?.address;

    if (!address) {
      return null;
    }

    // Keep useful location information only
    const location = {
      village: address.village || address.hamlet || null,
      area:
        address.suburb ||
        address.neighbourhood ||
        address.residential ||
        null,
      postOffice: address.post_office || null,
      policeStation:
        address.police ||
        address.police_station ||
        null,
      city:
        address.city ||
        address.town ||
        address.municipality ||
        null,
      district:
        address.state_district ||
        address.district ||
        null,
      state: address.state || null,
      country: address.country || null,
      pin: address.postcode || null
    };

    return JSON.stringify(location);
  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error.message
    );

    return null;
  }
};


// Create complaint
const createComplaint = async (req, res) => {
  const {
    title,
    description,
    category,
    latitude,
    longitude
  } = req.body;

  const userId = req.user.id;

  // Uploaded image filename
  const image = req.file
    ? req.file.filename
    : null;

  // Validate required fields
  if (!title || !description || !category) {
    return res.status(400).json({
      message: "Please fill all required fields"
    });
  }

  // Get detailed location
  const locationDetails =
    await getLocationDetails(
      latitude,
      longitude
    );

  const sql = `
    INSERT INTO complaints
    (
      user_id,
      title,
      description,
      category,
      image,
      latitude,
      longitude,
      location_details
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      title,
      description,
      category,
      image,
      latitude || null,
      longitude || null,
      locationDetails
    ],
    (err, result) => {
      if (err) {
        console.error(
          "Create complaint error:",
          err
        );

        return res.status(500).json({
          message: "Failed to create complaint"
        });
      }

      res.status(201).json({
        message:
          "Complaint created successfully",
        complaintId: result.insertId
      });
    }
  );
};


// Get user's complaints
const getMyComplaints = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM complaints
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(
    sql,
    [userId],
    (err, results) => {
      if (err) {
        console.error(
          "Get my complaints error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch complaints"
        });
      }

      res.json(results);
    }
  );
};


// Get all complaints - Admin
const getAllComplaints = (req, res) => {
  const sql = `
    SELECT
      complaints.*,
      users.name,
      users.email
    FROM complaints
    JOIN users
      ON complaints.user_id = users.id
    ORDER BY complaints.created_at DESC
  `;

  db.query(
    sql,
    (err, results) => {
      if (err) {
        console.error(
          "Get all complaints error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch complaints"
        });
      }

      res.json(results);
    }
  );
};


// Update complaint status - Admin
const updateComplaintStatus = (
  req,
  res
) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Resolved"
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const sql = `
    UPDATE complaints
    SET status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [status, id],
    (err, result) => {
      if (err) {
        console.error(
          "Update status error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to update status"
        });
      }

      res.json({
        message:
          "Complaint status updated successfully"
      });
    }
  );
};


// Delete complaint - Admin
const deleteComplaint = (
  req,
  res
) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM complaints
    WHERE id = ?
  `;

  db.query(
    sql,
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete complaint error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to delete complaint"
        });
      }

      res.json({
        message:
          "Complaint deleted successfully"
      });
    }
  );
};


module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
};
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


// ========================================
// Create Complaint
// ========================================

const createComplaint = async (req, res) => {

  const {
    title,
    description,
    category,
    latitude,
    longitude,
    photo_captured_at,
    location_captured_at
  } = req.body;

  const userId = req.user.id;


  // ========================================
  // Required Photo
  // ========================================

  if (!req.file || !req.file.cloudinaryUrl) {
    return res.status(400).json({
      message:
        "Please take a live photo before submitting the complaint"
    });
  }


  // ========================================
  // Required Location
  // ========================================

  if (!latitude || !longitude) {
    return res.status(400).json({
      message:
        "Please capture your current location before submitting the complaint"
    });
  }


  // ========================================
  // Required Capture Times
  // ========================================

  if (
    !photo_captured_at ||
    !location_captured_at
  ) {
    return res.status(400).json({
      message:
        "Photo and location capture time are required"
    });
  }


  // ========================================
  // Validate Latitude / Longitude
  // ========================================

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon)
  ) {
    return res.status(400).json({
      message:
        "Invalid location coordinates"
    });
  }

  if (lat < -90 || lat > 90) {
    return res.status(400).json({
      message:
        "Invalid latitude"
    });
  }

  if (lon < -180 || lon > 180) {
    return res.status(400).json({
      message:
        "Invalid longitude"
    });
  }


  // ========================================
  // Validate Required Complaint Fields
  // ========================================

  if (
    !title ||
    !description ||
    !category
  ) {
    return res.status(400).json({
      message:
        "Please fill all required fields"
    });
  }


  // ========================================
  // Cloudinary Image URL
  // ========================================

  const image =
    req.file.cloudinaryUrl;


  // ========================================
  // Get Detailed Location
  // ========================================

  const locationDetails =
    await getLocationDetails(
      lat,
      lon
    );


  // ========================================
  // Convert ISO timestamps to MySQL format
  // ========================================

  const convertToMySQLDateTime = (
    isoDate
  ) => {

    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  };


  const photoCapturedAt =
    convertToMySQLDateTime(
      photo_captured_at
    );

  const locationCapturedAt =
    convertToMySQLDateTime(
      location_captured_at
    );


  if (
    !photoCapturedAt ||
    !locationCapturedAt
  ) {
    return res.status(400).json({
      message:
        "Invalid capture timestamp"
    });
  }


  // ========================================
  // Insert Complaint
  // ========================================

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
      location_details,
      photo_captured_at,
      location_captured_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(
    sql,
    [
      userId,
      title,
      description,
      category,
      image,
      lat,
      lon,
      locationDetails,
      photoCapturedAt,
      locationCapturedAt
    ],

    (err, result) => {

      if (err) {

        console.error(
          "Create complaint error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to create complaint"
        });
      }


      res.status(201).json({

        message:
          "Complaint created successfully",

        complaintId:
          result.insertId

      });

    }
  );
};


// ========================================
// Get User's Complaints
// ========================================

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
          message:
            "Failed to fetch complaints"
        });
      }

      res.json(results);

    }
  );
};


// ========================================
// Get All Complaints - Admin
// ========================================

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
          message:
            "Failed to fetch complaints"
        });
      }

      res.json(results);

    }
  );
};


// ========================================
// Update Complaint Status - Admin
// ========================================

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
      message:
        "Invalid status"
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


// ========================================
// Delete Complaint - Admin
// ========================================

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
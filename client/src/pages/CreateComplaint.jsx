import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Roads");
  const [image, setImage] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  const navigate = useNavigate();

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationStatus(
          "Location captured successfully!"
        );
      },
      (error) => {
        console.error(error);

        if (error.code === 1) {
          setLocationStatus(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationStatus(
            "Location unavailable. Please try again."
          );
        } else if (error.code === 3) {
          setLocationStatus(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationStatus(
            "Unable to get location. Please try again."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      if (latitude && longitude) {
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
      }

      const token = localStorage.getItem("token");

      await api.post("/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Complaint submitted successfully!");

      navigate("/my-complaints");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit complaint"
      );
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">

        <h2>Create Complaint</h2>

        <form onSubmit={handleSubmit}>

          <label>Title</label>

          <input
            type="text"
            placeholder="Enter complaint title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <label>Description</label>

          <textarea
            placeholder="Describe the problem"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="Roads">Roads</option>
            <option value="Electricity">
              Electricity
            </option>
            <option value="Water">Water</option>
            <option value="Garbage">Garbage</option>
            <option value="Other">Other</option>
          </select>

          <label>Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          {image && (
            <p>
              Selected image:{" "}
              <strong>{image.name}</strong>
            </p>
          )}

          <label>Complaint Location</label>

          <button
            type="button"
            onClick={getLocation}
          >
            📍 Get Current Location
          </button>

          {locationStatus && (
            <p>{locationStatus}</p>
          )}

          {latitude && longitude && (
            <p>
              📍 Location captured
              <br />
              Latitude: {latitude}
              <br />
              Longitude: {longitude}
            </p>
          )}

          <button type="submit">
            Submit Complaint
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateComplaint;
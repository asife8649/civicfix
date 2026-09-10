import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Roads");

  // ========================================
  // Photo
  // ========================================

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // ========================================
  // Location
  // ========================================

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // ========================================
  // Capture Times
  // ========================================

  const [photoCapturedAt, setPhotoCapturedAt] =
    useState("");

  const [locationCapturedAt, setLocationCapturedAt] =
    useState("");

  const [photoDisplayTime, setPhotoDisplayTime] =
    useState("");

  const [locationDisplayTime, setLocationDisplayTime] =
    useState("");

  // ========================================
  // Submit
  // ========================================

  const [submitting, setSubmitting] =
    useState(false);

  // ========================================
  // Camera Refs
  // ========================================

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();


  // ========================================
  // Open Camera
  // ========================================

  const openCamera = async () => {
    try {
      setPhotoError("");
      setCameraOpen(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        setPhotoError(
          "Camera is not supported by this browser."
        );

        setCameraOpen(false);
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment"
            }
          },
          audio: false
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraOpen(false);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPhotoError(
          "Camera permission denied. Please allow camera access."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setPhotoError(
          "No camera found on this device."
        );
      } else {
        setPhotoError(
          "Unable to open camera. Please try again."
        );
      }
    }
  };


  // ========================================
  // Get Current GPS Location
  // ========================================

  const getCurrentLocation = () => {
    return new Promise(
      (resolve, reject) => {

        if (!navigator.geolocation) {

          const error =
            new Error(
              "Geolocation is not supported by your browser."
            );

          setPhotoError(
            error.message
          );

          reject(error);
          return;
        }


        navigator.geolocation.getCurrentPosition(

          (position) => {

            const lat =
              position.coords.latitude;

            const lon =
              position.coords.longitude;


            /*
             * Browser GPS timestamp
             */
            const capturedTime =
              new Date(
                position.timestamp
              );


            setLatitude(lat);
            setLongitude(lon);


            /*
             * Save timestamp for backend
             */
            setLocationCapturedAt(
              capturedTime.toISOString()
            );


            /*
             * Display India local time
             */
            setLocationDisplayTime(
              capturedTime.toLocaleString(
                "en-IN",
                {
                  timeZone:
                    "Asia/Kolkata",

                  dateStyle:
                    "medium",

                  timeStyle:
                    "medium"
                }
              )
            );


            resolve({
              latitude: lat,
              longitude: lon,
              capturedTime
            });
          },


          (error) => {

            console.error(
              "Location error:",
              error
            );


            let message =
              "Unable to get your current location.";


            if (error.code === 1) {

              message =
                "Location permission denied. Please allow location access.";

            } else if (error.code === 2) {

              message =
                "Location unavailable. Please try again.";

            } else if (error.code === 3) {

              message =
                "Location request timed out. Please try again.";
            }


            setPhotoError(
              message
            );


            reject(
              new Error(message)
            );
          },


          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      }
    );
  };


  // ========================================
  // Capture Live Photo + GPS
  // ========================================

  const capturePhoto = async () => {

    const video =
      videoRef.current;


    if (!video) {
      return;
    }


    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {

      setPhotoError(
        "Camera is not ready yet. Please wait."
      );

      return;
    }


    try {

      setPhotoError("");


      /*
       * Get current GPS immediately
       * before taking the photo.
       */
      await getCurrentLocation();


      // ====================================
      // Capture Camera Frame
      // ====================================

      const canvas =
        document.createElement(
          "canvas"
        );


      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;


      const context =
        canvas.getContext("2d");


      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );


      // ====================================
      // Convert to Image File
      // ====================================

      canvas.toBlob(

        (blob) => {

          if (!blob) {

            setPhotoError(
              "Unable to capture photo. Please try again."
            );

            return;
          }


          /*
           * Photo capture time
           */
          const capturedTime =
            new Date();


          const file =
            new File(
              [blob],

              `civicfix-${capturedTime.getTime()}.jpg`,

              {
                type: "image/jpeg"
              }
            );


          // Save image
          setImage(file);


          // Save timestamp
          setPhotoCapturedAt(
            capturedTime.toISOString()
          );


          // Display India local time
          setPhotoDisplayTime(
            capturedTime.toLocaleString(
              "en-IN",
              {
                timeZone:
                  "Asia/Kolkata",

                dateStyle:
                  "medium",

                timeStyle:
                  "medium"
              }
            )
          );


          // ==================================
          // Create Preview
          // ==================================

          const url =
            URL.createObjectURL(
              file
            );


          setImagePreview(
            (oldUrl) => {

              if (oldUrl) {
                URL.revokeObjectURL(
                  oldUrl
                );
              }

              return url;
            }
          );


          // Close camera
          closeCamera();

        },

        "image/jpeg",

        0.9
      );

    } catch (error) {

      console.error(
        "Live capture error:",
        error
      );

      setPhotoError(
        error.message ||
        "Unable to capture photo and location."
      );
    }
  };


  // ========================================
  // Close Camera
  // ========================================

  const closeCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(
          (track) => {
            track.stop();
          }
        );

      streamRef.current = null;
    }


    setCameraOpen(false);
  };


  // ========================================
  // Retake Photo
  // ========================================

  const retakePhoto = async () => {

    if (imagePreview) {

      URL.revokeObjectURL(
        imagePreview
      );
    }


    setImage(null);
    setImagePreview("");


    setLatitude("");
    setLongitude("");


    setPhotoCapturedAt("");
    setLocationCapturedAt("");


    setPhotoDisplayTime("");
    setLocationDisplayTime("");


    setPhotoError("");


    await openCamera();
  };


  // ========================================
  // Submit Complaint
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Photo required

    if (!image) {

      alert(
        "Please take a live photo before submitting the complaint."
      );

      return;
    }


    // Location required

    if (
      !latitude ||
      !longitude
    ) {

      alert(
        "Current location was not captured with the photo."
      );

      return;
    }


    // Timestamp required

    if (
      !photoCapturedAt ||
      !locationCapturedAt
    ) {

      alert(
        "Photo and location capture time are required."
      );

      return;
    }


    setSubmitting(true);


    try {

      const formData =
        new FormData();


      // ====================================
      // Complaint Details
      // ====================================

      formData.append(
        "title",
        title
      );


      formData.append(
        "description",
        description
      );


      formData.append(
        "category",
        category
      );


      // ====================================
      // Live Photo
      // ====================================

      formData.append(
        "image",
        image
      );


      // ====================================
      // GPS
      // ====================================

      formData.append(
        "latitude",
        latitude
      );


      formData.append(
        "longitude",
        longitude
      );


      // ====================================
      // Capture Times
      // ====================================

      formData.append(
        "photo_captured_at",
        photoCapturedAt
      );


      formData.append(
        "location_captured_at",
        locationCapturedAt
      );


      // ====================================
      // JWT Token
      // ====================================

      const token =
        localStorage.getItem(
          "token"
        );


      // ====================================
      // Submit API
      // ====================================

      await api.post(
        "/complaints",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      alert(
        "Complaint submitted successfully!"
      );


      navigate(
        "/my-complaints"
      );

    } catch (error) {

      console.error(
        "Complaint submission error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to submit complaint"
      );

    } finally {

      setSubmitting(false);
    }
  };


  // ========================================
  // Cleanup
  // ========================================

  useEffect(() => {

    return () => {

      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach(
            (track) => {
              track.stop();
            }
          );
      }


      if (imagePreview) {

        URL.revokeObjectURL(
          imagePreview
        );
      }
    };

  }, [imagePreview]);


  // ========================================
  // UI
  // ========================================

  return (
    <div className="page-container">

      <div className="form-card">

        <h2>
          Create Complaint
        </h2>


        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================
              TITLE
          ================================= */}

          <label>
            Title
          </label>


          <input
            type="text"
            placeholder="Enter complaint title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />


          {/* =================================
              DESCRIPTION
          ================================= */}

          <label>
            Description
          </label>


          <textarea
            placeholder="Describe the problem"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
          />


          {/* =================================
              CATEGORY
          ================================= */}

          <label>
            Category
          </label>


          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            <option value="Roads">
              Roads
            </option>

            <option value="Electricity">
              Electricity
            </option>

            <option value="Water">
              Water
            </option>

            <option value="Garbage">
              Garbage
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          {/* =================================
              LIVE PHOTO
          ================================= */}

          <label>
            Live Complaint Photo
          </label>


          {!image &&
            !cameraOpen && (

              <button
                type="button"
                onClick={
                  openCamera
                }
                className="camera-button"
              >
                📷 Take Live Photo
              </button>

            )}


          {/* =================================
              CAMERA
          ================================= */}

          {cameraOpen && (

            <div className="camera-container">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />


              <div className="camera-actions">

                <button
                  type="button"
                  onClick={
                    capturePhoto
                  }
                  className="capture-button"
                >
                  📸 Capture Photo + Location
                </button>


                <button
                  type="button"
                  onClick={
                    closeCamera
                  }
                  className="cancel-camera-button"
                >
                  Cancel
                </button>

              </div>

            </div>

          )}


          {/* =================================
              ERROR
          ================================= */}

          {photoError && (

            <p className="photo-status">
              {photoError}
            </p>

          )}


          {/* =================================
              PHOTO PREVIEW
          ================================= */}

          {image &&
            imagePreview && (

              <div className="photo-preview-container">

                <img
                  src={imagePreview}
                  alt="Live complaint"
                  className="captured-photo"
                />


                <button
                  type="button"
                  onClick={
                    retakePhoto
                  }
                  className="retake-button"
                >
                  🔄 Retake Photo
                </button>

              </div>

            )}


          {/* =================================
              LOCATION
          ================================= */}

          {latitude &&
            longitude && (

              <div className="location-success">

                <strong>
                  📍 Location Captured With Photo
                </strong>


                <p>
                  Latitude: {latitude}
                </p>


                <p>
                  Longitude: {longitude}
                </p>


                {locationDisplayTime && (

                  <p>
                    🕒 Location Time:{" "}
                    {locationDisplayTime}
                  </p>

                )}


                {photoDisplayTime && (

                  <p>
                    📷 Photo Time:{" "}
                    {photoDisplayTime}
                  </p>

                )}

              </div>

            )}


          {/* =================================
              SUBMIT
          ================================= */}

          <button
            type="submit"
            disabled={
              submitting ||
              !image ||
              !latitude ||
              !longitude
            }
            className="submit-complaint-button"
          >

            {submitting
              ? "Submitting..."
              : "Submit Complaint"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateComplaint;
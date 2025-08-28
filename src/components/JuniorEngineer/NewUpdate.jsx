import React, { useState, useEffect } from "react";
import {
  getRoads,
  getInfraWorks,
  createUpdate,
  getLoginUser,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

export default function NewUpdate() {
  const [roads, setRoads] = useState([]);
  const [InfraWorks, setInfraWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [progressPercent, setProgressPercent] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [imageBase64, setImageBase64] = useState(""); // <-- for storing base64 string
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [FinalLatitude, setFinalLatitude] = useState(null);
  const [FinalLongitude, setFinalLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFinalLatitude(position.coords.latitude);
          setFinalLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadsRes = await getRoads();
        const works = await getInfraWorks();
        const worksRes = works.data.filter((work) => work.isActive);

        const worksArray = Array.isArray(worksRes)
          ? worksRes
          : worksRes.data ?? [];

        setRoads(roadsRes);
        setInfraWorks(worksArray);
        setFilteredWorks(worksArray);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedRoad) {
      setFilteredWorks(InfraWorks);
      return;
    }

    const selectedRoadObj = roads.find(
      (road) => road.id === Number(selectedRoad)
    );
    if (selectedRoadObj) {
      const filtered = InfraWorks.filter(
        (InfraWork) => String(InfraWork.road) === String(selectedRoadObj.id)
      );
      setFilteredWorks(filtered);
    }
  }, [selectedRoad, InfraWorks, roads]);

  const handleRoadChange = (e) => {
    const roadId = e.target.value;
    setSelectedRoad(roadId);
    setSelectedWork("");
  };

  // Convert uploaded image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // stores Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const selectedWorkObj = InfraWorks.find(
      (work) => String(work.id) === String(selectedWork)
    );

    if (selectedWorkObj && Number(selectedWorkObj.progress_percent) === 100) {
      alert("This work is already 100% complete. No more updates allowed.");
      setLoading(false);
      navigate("/home/");
      return;
    }

    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);

      const payload = {
        login_user: loginUser,
        road: selectedRoad,
        work: selectedWork,
        progress_percent: progressPercent,
        status_note: statusNote,
        image: imageBase64,
        latitude: FinalLatitude,
        longitude: FinalLongitude,
      };

      console.log("Payload: ", payload);

      await createUpdate(payload);

      setMessage("Update created successfully!");
      setSelectedRoad("");
      setSelectedWork("");
      setProgressPercent("");
      setStatusNote("");
      setImageBase64("");
      navigate("/home/");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.progress_percent?.[0] || "Failed to create update."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add New Update</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {/* Road Dropdown */}
            <select
              name="road"
              value={selectedRoad}
              onChange={handleRoadChange}
              style={styles.select}
            >
              <option value="" disabled>
                Select Road
              </option>
              {roads.map((road) => (
                <option key={road.id} value={road.id}>
                  {road.unique_code} - {road.road_name}
                </option>
              ))}
            </select>

            {/* Work Dropdown */}
            <select
              name="InfraWork"
              value={selectedWork}
              onChange={(e) => setSelectedWork(e.target.value)}
              style={styles.select}
              required
            >
              <option value="" disabled>
                Select Work
              </option>
              {filteredWorks.length === 0 ? (
                <option value="" disabled>
                  No past works available for this road
                </option>
              ) : (
                filteredWorks.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.description} - {work.phase} - {work.start_date} -{" "}
                    {work.end_date} - {work.progress_percent}%
                  </option>
                ))
              )}
            </select>

            {/* Progress % */}
            <TextField
              type="number"
              name="progressPercent"
              label="Progress %"
              placeholder="Progress %"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Image Upload */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 calc(20% - 10px)",
              minWidth: "150px",
            }}
          >
            <label
              style={{
                marginBottom: "4px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: "0.8rem",
                borderRadius: "20px",
                backgroundColor: "#e0e0e0",
                color: "#000",
                textAlign: "center",
                flex: "1 1 calc(20% - 10px)",
              }}
            />
          </div>

          {/* Short Description */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
              minHeight: "100px",
            }}
          >
            <textarea
              type="text"
              name="statusNote"
              placeholder="Short description (1–2 lines)"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              style={{ ...styles.input, textAlign: "start" }}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "0.8rem 2rem",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                width: "40%",
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("Failed") ? "red" : "green",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "90%",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "20px",
    backgroundColor: "#e0e0e0",
    color: "#000",
    textAlign: "center",
    flex: "1 1 calc(20% - 10px)",
    minWidth: "150px",
  },
  select: {
    color: "#000",
    padding: "0.8rem",
    borderRadius: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    flex: "1 1 calc(20% - 10px)",
    minWidth: "150px",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
};

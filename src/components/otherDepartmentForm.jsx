import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitOtherDepartmentRequest, getRoads } from "../api/api";
import { display, justifyContent } from "@mui/system";

export default function OtherDepartmentForm() {
  const [roads, setRoads] = useState([]);
  const [uniqueCode, setUniqueCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  console.log("HI --------------");

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const response = await getRoads();
        setRoads(response.data);
        setError("");
        console.log("Fetched Roads:", response.data);
      } catch (err) {
        console.error("Failed to fetch roads:", err);
        setError("Failed to fetch roads");
      }
    };

    fetchRoads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const road = roads?.find((r) => r?.unique_code === uniqueCode);
      if (!road) {
        setError("Invalid Road Unique Code");
        return;
      }
      await submitOtherDepartmentRequest({
        road: road,
        departmentName,
        workDescription,
        requestedBy,
        contactInfo,
      });

      setError("");
      alert(
        "Thank you for submitting your request. We will review it and get back to you soon."
      );
      navigate("/login/");
    } catch (err) {
      console.error("Failed to submit request:", err);
      setError("Failed to submit request");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h2 style={{ color: "#000000" }}>
        Request Work on road(Other Department)
      </h2>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            list="road_unique_codes"
            placeholder="Road Unique Code"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
            required
            style={inputStyle}
          />
          <datalist id="road_unique_codes">
            {roads.map((road) => (
              <option
                key={road.id}
                value={road.unique_code}
                label={`${road.unique_code} - ${road.name || road.road_name}`}
              >
                {road.unique_code} - {road.name || road.road_name}
              </option>
            ))}
          </datalist>

          <textarea
            placeholder="Proposed Work Description"
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Requested By (Name and Designation)"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Contact Info (Phone/Email)"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Submit Request
          </button>
          {error && (
            <div
              style={{ color: "red", marginTop: "1rem", textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "1rem",
  margin: "0.5rem",
  borderRadius: "20px",
  border: "1px solid #ccc",
  width: "100%",
  backgroundColor: "#f9f9f9",
  color: "#000",
};

const buttonStyle = {
  width: "100%",
  padding: "1rem",
  border: "none",
  borderRadius: "30px",
  background: "#000",
  color: "#fff",
  cursor: "pointer",
  marginTop: "1rem",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "background 0.3s ease",
};

buttonStyle[":hover"] = {
  background: "#333",
};

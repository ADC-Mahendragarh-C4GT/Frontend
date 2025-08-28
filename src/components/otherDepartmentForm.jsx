import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitOtherDepartmentRequest, getRoads } from "../api/api";
import { display, justifyContent } from "@mui/system";
import TextField from "@mui/material/TextField";

export default function OtherDepartmentForm() {
  const [roads, setRoads] = useState([]);
  const [uniqueCode, setUniqueCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState("");
  const [pdfDescription, setPdfDescription] = useState("");

  const navigate = useNavigate();
  console.log("HI --------------");

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const response = await getRoads();

        setRoads(response);
        setError("");
        console.log("Fetched Roads:", response);
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
        pdfDescription,
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
          <TextField
            list="road_unique_codes"
            type="text"
            label="Department Name"
            placeholder="Your Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
            style={inputStyle}
          />
          <TextField
            label="Road Unique Code"
            placeholder="Road Unique Code"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
            required
            style={inputStyle}
            inputProps={{
              list: "road_unique_codes", 
            }}
          />

          <datalist id="road_unique_codes">
            {roads.map((road) => (
              <option
                key={road.id}
                value={road.unique_code}
                label={`${road.unique_code} - ${road.name || road.road_name}`}
              />
            ))}
          </datalist>

          <TextField
            type="text"
            label="Requested By"
            placeholder="Requested By (Name and Designation)"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            required
            style={inputStyle}
          />
          <TextField
            type="text"
            label="Contact Email"
            placeholder="Contact Email"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Proposed Work Description"
            value={workDescription}
            label="Work Description"
            onChange={(e) => setWorkDescription(e.target.value)}
            required
            style={inputStyle}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 calc(20% - 10px)",
              minWidth: "150px",
              marginTop: "1rem",
            }}
          >
            <label
              style={{
                marginBottom: "4px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Upload Detailed Update/Description (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPdfDescription(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              placeholder="Please upload PDF only"
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

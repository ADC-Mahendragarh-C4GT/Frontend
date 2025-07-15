import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoadDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // load from state or fallback to localStorage
  let work = location.state?.work;
  if (!work) {
    const saved = localStorage.getItem("currentWork");
    if (saved) {
      work = JSON.parse(saved);
    }
  }

  if (!work) return <h2>No work details found. Please go back.</h2>;

  const { road, contractor, start_date, progress_percent, description, cost } = work;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f4f4f4" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: "#eee",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ⬅ Back
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Municipal Corporation Rohtak</h1>
        </div>

        {/* Info Grid */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "2rem" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <p><b>Road Number:</b> {road.unique_code}</p>
            <p><b>Road Name:</b> {road.road_name}</p>
            <p><b>Length:</b> {road.length} m</p>
            <p><b>Width:</b> {road.width} m</p>
            <p><b>Ward Number:</b> {road.ward_no}</p>
            <p><b>Location:</b> {road.location}</p>
          </div>

          <div style={{ flex: "1", minWidth: "250px" }}>
            <p><b>Contractor Firm:</b> {contractor?.contractor_name}</p>
            <p><b>Name:</b> {contractor?.contractor_name}</p>
            <p><b>Mobile:</b> +91 1234567890</p>
            <p><b>Email:</b> example@gmail.com</p>
            <p><b>Address:</b> Mahendragarh, Haryana</p>
          </div>

          <div style={{ flex: "1", textAlign: "center", minWidth: "200px" }}>
            <p><b>Start Date:</b> {start_date}</p>
            <p><b>Cost:</b> ₹{cost ?? "40,000"}</p>
            <div
              style={{
                height: "100px",
                width: "100px",
                borderRadius: "50%",
                background: "#ddd0b0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "1rem auto",
              }}
            >
              {progress_percent}%
            </div>
          </div>
        </div>

        {/* Work Updates Table */}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Update of Work</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>S. No.</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Phase</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>1</td>
                <td style={tdStyle}>2025-07-10</td>
                <td style={tdStyle}>Phase 1</td>
                <td style={tdStyle}>{description}</td>
              </tr>
              <tr>
                <td colSpan={4} style={tdStyleCenter}>See all ➝ (only 5 are listed)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comments Table */}
        <div>
          <h3>Comments</h3>
          <input
            placeholder="Add Comment (Type here)…"
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>S. No.</th>
                <th style={thStyle}>Commentator Name</th>
                <th style={thStyle}>Post</th>
                <th style={thStyle}>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>1</td>
                <td style={tdStyle}>Officer A</td>
                <td style={tdStyle}>Supervisor</td>
                <td style={tdStyle}>Work is progressing smoothly.</td>
              </tr>
              <tr>
                <td colSpan={4} style={tdStyleCenter}>See all ➝ (only 5 are listed)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  background: "#fefefe",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  background: "#eee",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};

const tdStyleCenter = {
  ...tdStyle,
  fontStyle: "italic",
  background: "#fafafa",
};

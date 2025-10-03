import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadExcel, createRoad } from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Header from "../Header";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const NewRoad = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const commonStyle = { m: 1, width: "25ch" };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage2("Please select a file.");
      return;
    }

    try {
      const loginUserId = localStorage.getItem("id");

      const payload = {
        login_user: loginUserId,
      };
      setLoading(true);
      setMessage2("");

      const response = await uploadExcel(file, payload);

      setMessage2(` ${response.data.message}`);
      setTimeout(() => navigate("/home/"), 1000);
    } catch (error) {
      console.error(
        `[${new Date().toLocaleTimeString()}] Upload failed:`,
        error
      );
      setMessage2(" Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    unique_code: "",
    road_name: "",
    ward_number: "",
    location: "",
    length_km: "",
    width_m: "",
    road_type: "",
    material_type: "",
    road_category: "",
    area_name: "",
    district: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitManually = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");

      const payload = {
        ...formData,
        login_user: loginUserId,
      };

      const res = await createRoad(payload);
      setMessage(` ${res.data.road_name} added successfully!`);
      setFormData({
        unique_code: "",
        road_name: "",
        ward_number: "",
        location: "",
        length_km: "",
        width_m: "",
        road_type: "",
        material_type: "",
        road_category: "",
        area_name: "",
        district: "",
        state: "",
      });
    } catch (err) {
      console.error(err);
      setMessage(" Failed to add road.");
    } finally {
      setLoading(false);
      navigate("/home/");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Upload Excel File</h2>
          <div style={styles.cautionBox}>
            <h4 style={{ marginBottom: "0.5rem", color: "#b00020" }}>
              ⚠️ Caution
            </h4>
            <p style={styles.cautionText}>
              Please ensure that the file you upload strictly follows the{" "}
              <strong>example .csv file format</strong>.
              <br />
              Incorrect column names, spelling mistakes, or mismatched
              uppercase/lowercase letters will result in{" "}
              <strong>invalid or misleading road entries</strong> in the system.
              <br />
              <strong>Do not modify the column headers</strong> and make sure
              the data is accurate and complete.
              <br />
              <br />{" "}
              <a
                href="/example.csv"
                download
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Click here to see the example .csv file
              </a>{" "}
              and verify your file matches exactly before uploading.
            </p>
          </div>
          <br />
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
              }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "1.2rem",
                  cursor: "pointer",
                  padding: "0.7rem",
                  borderRadius: 25,
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  textAlign: "center",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem 1.2rem",
                  border: "none",
                  borderRadius: 30,
                  backgroundColor: loading ? "#9e9e9e" : "#4CAF50",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "background 0.3s ease, transform 0.2s ease",
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#45a049";
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#4CAF50";
                }}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>

          {message2 && (
            <p
              style={{
                ...styles.message,
                color:
                  message2.startsWith("Please") ||
                  message2.startsWith(" Upload")
                    ? "red"
                    : "green",
              }}
            >
              {message2}
            </p>
          )}

          <div
            style={{ justifyContent: "center", display: "flex", width: "100%" }}
          >
            <p style={styles.or}>OR</p>
          </div>

          {/* Manual Road Entry */}
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <form onSubmit={handleSubmitManually}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {/* Road Name */}
                <TextField
                  name="road_name"
                  label="ROAD NAME"
                  placeholder="ROAD NAME"
                  value={formData.road_name}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-root": { borderRadius: 1 },
                    "& .MuiInputBase-input": { textAlign: "center" },
                  }}
                  required
                />

                {/* Ward Number */}
                <TextField
                  name="ward_number"
                  label="WARD NUMBER"
                  placeholder="WARD NUMBER"
                  value={formData.ward_number}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* Location */}
                <TextField
                  name="location"
                  label="LOCATION"
                  placeholder="LOCATION"
                  value={formData.location}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* Length (km) – numeric */}
                <TextField
                  type="number"
                  inputProps={{ step: "any", min: "0" }}
                  name="length_km"
                  label="Length (m)"
                  placeholder="Length (m)"
                  value={formData.length_km}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* Width (m) – numeric */}
                <TextField
                  type="number"
                  inputProps={{ step: "any", min: "0" }}
                  name="width_m"
                  label="Width (m)"
                  placeholder="Width (m)"
                  value={formData.width_m}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* Road Type */}
                <TextField
                  select
                  name="road_type"
                  label="ROAD TYPE"
                  value={formData.road_type}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value=""></option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "others"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  required
                </TextField>

                {/* Material Type */}
                <TextField
                  select
                  name="material_type"
                  label="MATERIAL TYPE"
                  value={formData.material_type}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value=""></option>
                  {["CC", "KACCHA", "METALIC", "Paver Block", "Other"].map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                  required
                </TextField>

                {/* Road Category */}
                <TextField
                  select
                  name="road_category"
                  label="ROAD CATEGORY"
                  value={formData.road_category}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value=""></option>
                  {[
                    "City Road",
                    "Major District Road",
                    "National Highway",
                    "State Highway",
                    "Other",
                  ].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  required
                </TextField>

                {/* Area Name */}
                <TextField
                  name="area_name"
                  label="AREA NAME"
                  placeholder="AREA NAME"
                  value={formData.area_name}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* District */}
                <TextField
                  name="district"
                  label="DISTRICT"
                  placeholder="DISTRICT"
                  value={formData.district}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />

                {/* State */}
                <TextField
                  name="state"
                  label="STATE"
                  placeholder="STATE"
                  value={formData.state}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                  required
                />
              </div>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 30,
                    color: "#fff",
                    backgroundColor: loading ? "#9e9e9e" : "#1976d2",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                    transition: "background 0.3s ease, transform 0.2s ease",
                  }}
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>

            {message && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: message.includes("success") ? "green" : "red",
                  fontWeight: 500,
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewRoad;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    width: "100%",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    marginTop: "0rem",
    color: "#333",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
  cautionBox: {
    backgroundColor: "#ffe5e5",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ffcccc",
  },
  cautionText: {
    fontSize: "0.9rem",
    color: "#b00020",
    lineHeight: "1.4",
  },
  or: {
    fontSize: "large",
    color: "#000",
  },
};
const inputStyle = {
  flex: "1 1 calc(25% - 1rem)",
  minWidth: 220,
  backgroundColor: "#fafafa",
  borderRadius: 8,
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
};

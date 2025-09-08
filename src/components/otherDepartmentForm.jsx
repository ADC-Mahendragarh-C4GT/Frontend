import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitOtherDepartmentRequest, getRoads } from "../api/api";
import { Box, CircularProgress } from "@mui/material";

export default function OtherDepartmentForm() {
  const [roads, setRoads] = useState([]);
  const [filteredRoads, setFilteredRoads] = useState([]);
  const [uniqueCode, setUniqueCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState("");
  const [pdfDescription, setPdfDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteringLoader, setFilteringLoader] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  

  // Filters
  const [wardNumberFilter, setWardNumberFilter] = useState("All");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("All");
  const [roadCategoryFilter, setRoadCategoryFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const response = await getRoads();
        setRoads(response);
        setFilteredRoads(response);
        setError("");
      } catch (err) {
        console.error("Failed to fetch roads:", err);
        setError("Failed to fetch roads");
      } finally {
        setLoading(false);
      }
    };
    fetchRoads();
  }, []);

  // distinct lists
  const distinctWardNumbers = Array.from(
    new Set(roads.map((r) => r.ward_number).filter(Boolean))
  ).sort((a, b) => a - b);

  const distinctMaterialTypes = Array.from(
    new Set(roads.map((r) => r.material_type).filter(Boolean))
  ).sort();

  const distinctRoadCategories = Array.from(
    new Set(roads.map((r) => r.road_category).filter(Boolean))
  ).sort();

  // Filtering logic
  useEffect(() => {
    setFilteringLoader(true);
    let filtered = roads;

    if (wardNumberFilter && wardNumberFilter !== "All") {
      filtered = filtered.filter(
        (r) => String(r.ward_number) === String(wardNumberFilter)
      );
    }

    if (materialTypeFilter && materialTypeFilter !== "All") {
      filtered = filtered.filter(
        (r) =>
          r.material_type &&
          r.material_type.toLowerCase() === materialTypeFilter.toLowerCase()
      );
    }

    if (roadCategoryFilter && roadCategoryFilter !== "All") {
      filtered = filtered.filter(
        (r) =>
          r.road_category &&
          r.road_category.toLowerCase() === roadCategoryFilter.toLowerCase()
      );
    }

    setFilteredRoads(filtered);
    setTimeout(() => setFilteringLoader(false), 300);
  }, [wardNumberFilter, materialTypeFilter, roadCategoryFilter, roads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Request Work on Road (Other Department)</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Department Name */}
        <label style={styles.label}>Department Name</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Your Department Name"
          required
          style={styles.input}
        />

        {/* Ward Filter */}
        <label style={styles.label}>Ward Number (Optional)</label>
        <select
          value={wardNumberFilter}
          onChange={(e) => setWardNumberFilter(e.target.value)}
          style={styles.input}
        >
          <option value="All">All Wards</option>
          {distinctWardNumbers.map((ward, idx) => (
            <option key={idx} value={ward}>
              Ward {ward}
            </option>
          ))}
        </select>

        {/* Material Filter */}
        <label style={styles.label}>Material Type (Optional)</label>
        <select
          value={materialTypeFilter}
          onChange={(e) => setMaterialTypeFilter(e.target.value)}
          style={styles.input}
        >
          <option value="All">All Materials</option>
          {distinctMaterialTypes.map((mat, idx) => (
            <option key={idx} value={mat}>
              {mat}
            </option>
          ))}
        </select>

        {/* Road Category Filter */}
        <label style={styles.label}>Road Category (Optional)</label>
        <select
          value={roadCategoryFilter}
          onChange={(e) => setRoadCategoryFilter(e.target.value)}
          style={styles.input}
        >
          <option value="All">All Categories</option>
          {distinctRoadCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Road Unique Code */}
        <label style={styles.label}>Select Road</label>
        <select
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Road</option>
          {filteringLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            filteredRoads.map((road) => (
              <option key={road.id} value={road.unique_code}>
                {road.unique_code} - {road.name || road.road_name}
              </option>
            ))
          )}
        </select>

        {/* Requested By */}
        <label style={styles.label}>Requested By</label>
        <input
          type="text"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
          placeholder="Requested By (Name and Designation)"
          required
          style={styles.input}
        />

        {/* Contact Email */}
        <label style={styles.label}>Contact Email</label>
        <input
          type="email"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="Contact Email"
          required
          style={styles.input}
        />

        {/* Work Description */}
        <label style={styles.label}>Proposed Work Description</label>
        <textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="Proposed Work Description in Short"
          required
          style={styles.textarea}
        />

        {/* PDF Upload */}
        <label style={styles.label}>
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
          style={styles.fileInput}
        />

        {/* Submit */}
        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Submit Request"
          )}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    color: "#000",
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    color: "#000",

    gap: "1rem",
  },
  label: {
    fontWeight: "500",
    marginBottom: "0.3rem",
    color: "#444",
  },
  input: {
    padding: "0.8rem",
    color: "#000",

    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    minHeight: "100px",
    fontSize: "1rem",
    color: "#000",
  },
  fileInput: {
    padding: "0.6rem",
    borderRadius: "8px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ccc",
  },
  button: {
    padding: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "1rem",
  },
};

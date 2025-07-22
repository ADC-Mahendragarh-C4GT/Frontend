import React, { useState } from "react";
import axios from "axios";
import { uploadExcel, createRoad } from "../../api/api";

const NewRoad = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage2("Please select a file.");
      return;
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] Uploading file: ${file.name}`
    );

    try {
      setLoading(true);
      setMessage2("");

      const response = await uploadExcel(file);

      console.log(
        `[${new Date().toLocaleTimeString()}] Upload successful:`,
        response.data
      );

      setMessage2(` ${response.data.message}`);
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
      const res = await createRoad(formData);
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
    }
  };

  return (
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
            <strong>Do not modify the column headers</strong> and make sure the
            data is accurate and complete.
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
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button
              type="submit"
              disabled={loading}
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        {message2 && (
          <p
            style={{
              ...styles.message,
              color: message2.startsWith("") ? "green" : "red",
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

        <div
      
        >
          <form onSubmit={handleSubmitManually}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {Object.keys(formData).map((key) => {
                if (key === "unique_code") {
                  return null; // not render input for unique_code
                }
                if (
                  key === "road_type" ||
                  key === "material_type" ||
                  key === "road_category"
                ) {
                  let options = [];

                  if (key === "road_type") {
                    options = ["IV", "VI", "Others"];
                  }
                  if (key === "material_type") {
                    options = ["CC", "IPB", "Bitumin", "Other"];
                  }
                  if (key === "road_category") {
                    options = ["Road", "ColonyStreet"];
                  }

                  return (
                    <select
                      key={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "20px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9",
                        color: "#000",
                        flex: "1 1 calc(20% - 10px)",
                        minWidth: "150px",
                      }}
                    >
                      <option value="" disabled>
                        {key.replace("_", " ").toUpperCase()}
                      </option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  );
                }

                return (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    placeholder={key.replace("_", " ").toUpperCase()}
                    value={formData[key]}
                    onChange={handleChange}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "20px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f9f9f9",
                      color: "#000",
                      textAlign: "center",
                      flex: "1 1 calc(20% - 10px)",
                      minWidth: "150px",
                    }}
                  />
                );
              })}
            </div>

<br />
<div style={{display:'flex', justifyContent:"center"}}>
            <button
              type="submit"
              style={styles.button}
            >
              Submit
            </button>
            </div>
          </form>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRoad;

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
  fileInput: {
    display: "block",
    width: "100%",
    marginBottom: "1rem",
    cursor: "pointer",
    padding: "0.8rem",
    borderRadius: "20px",
    border: "1px solid #fff",
    backgroundColor: "#f9f9c4",
    color: "#000",
    textAlign: "center",
  },
  button: {
    width: "40%",
    padding: "0.6rem",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    transition: "background 0.3s",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
  cautionBox: {
    marginTop: "1rem",
    backgroundColor: "#ffe5e5",
    width: "99%",
    padding: "0.8rem",
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

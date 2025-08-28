import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContractor, getLoginUser } from "../../api/api";
import TextField from "@mui/material/TextField";

export default function NewContractor() {
  const [formData, setFormData] = useState({
    contractor_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      console.log("---------loginUser------", loginUser);

      const payload = {
        ...formData,
        login_user: loginUser,
      };

      await createContractor(payload);
      setMessage("Contractor registered successfully!");
      setFormData({
        contractor_name: "",
        contact_person: "",
        contact_number: "",
        email: "",
        address: "",
      });
      setTimeout(() => navigate("/home/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to register contractor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register New Contractor</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <TextField
              name="contractor_name"
              label="Contractor Name"
              placeholder="Contractor Name"
              value={formData.contractor_name}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <TextField
              name="contact_person"
              placeholder="Contact Person"
              label="Contact Person"
              value={formData.contact_person}
              onChange={handleChange}
              style={styles.input}
            />
            <TextField
              name="contact_number"
              placeholder="Contact Number"
              label="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              style={styles.input}
            />
            <TextField
              type="email"
              name="email"
              label="Email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            <TextField
              name="address"
              label="Address"
              multiline
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: "80px", textAlign: "start" }}
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
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>

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
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
};

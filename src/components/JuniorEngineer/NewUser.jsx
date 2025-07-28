import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, fetchUserType } from "../../api/api"; 
import { TextField } from "@mui/material";

export default function NewUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    user_type: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userTypes, setUserTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const res = await fetchUserType();
        setUserTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch user types", err);
      }
    };
    fetchUserTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await register(formData);
      setMessage("User registered successfully!");
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password2: "",
        user_type: "",
        phone_number: "",
      });
      setTimeout(() => navigate("/home/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register New User</h2>

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
              name="username"
              placeholder="Username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <TextField
              type="email"
              name="email"
              label="Email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <TextField
              name="first_name"
              label="First Name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              style={styles.input}
            />
            <TextField
              name="last_name"
              label="Last Name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              style={styles.input}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <TextField
              type="password"
              name="password2"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <TextField
              name="phone_number"
              label="Phone Number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              style={styles.input}
            />
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="" disabled>
                Select User Type
              </option>
              {userTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
                color: message.startsWith("") ? "red" : "green",
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

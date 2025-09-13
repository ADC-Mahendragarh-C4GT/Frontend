import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, fetchUserType, getLoginUser } from "../../api/api";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../header";

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
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);

      const payload = {
        ...formData,
        login_user: loginUser,
      };
      const res = await register(payload);
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
      let errorMsg = "Failed to register user.";
      const data = err.response?.data;

      if (Array.isArray(data)) {
        // Case: data = ["Email is already taken"]
        errorMsg = data[0];
      } else if (data && typeof data === "object") {
        const errors = data.errors || {}; // nested errors object

        if (errors.username) {
          errorMsg = errors.username[0] || "Username already taken.";
        } else if (errors.email) {
          errorMsg = errors.email[0] || "Email already taken.";
        } else if (Object.keys(errors).length > 0) {
          // fallback → first field’s first error
          const firstKey = Object.keys(errors)[0];
          errorMsg = errors[firstKey][0];
        } else if (data.message) {
          // generic message
          errorMsg = data.message;
        }
      } else if (typeof data === "string") {
        errorMsg = data;
      }

      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={styles.container}>
        <Box sx={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom : "1rem",
            }}
          >
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Add New User
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <Box sx={styles.formBox}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                sx={styles.field}
                required
              />
              <TextField
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={styles.field}
                required
              />
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                sx={styles.field}
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                sx={styles.field}
              />
              <TextField
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={styles.field}
                required
              />
              <TextField
                type="password"
                label="Confirm Password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                sx={styles.field}
                required
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                sx={styles.field}
              />

              <FormControl sx={styles.field} required>
                <InputLabel>User Type</InputLabel>
                <Select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  label="User Type"
                >
                  {userTypes.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>

            {message && (
              <Typography
                mt={2}
                textAlign="center"
                color={message.startsWith("Failed") ? "error" : "success.main"}
                fontWeight={500}
              >
                {message}
              </Typography>
            )}
          </form>
        </Box>
      </Box>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",

  },
  card: {
    background: "#fff",
    p: 2,
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    mb: 3,
    color: "#333",
  },
  formBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
  },
  field: {
    flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
    minWidth: 150,
  },
};

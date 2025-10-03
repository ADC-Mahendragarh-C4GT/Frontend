import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContractor, getLoginUser } from "../../api/api";
import { Box, Paper, Typography, TextField, Button, Grid } from "@mui/material";
import Header from "../Header";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);

      await createContractor({ ...formData, login_user: loginUser });
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

  // Common TextField props
  const commonTextFieldProps = {
    fullWidth: true,
    variant: "outlined",
    size: "large",
    onChange: handleChange,
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper sx={{ p: 2, width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Register New Contractor
            </Typography>
          </div>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              {...commonTextFieldProps}
              name="contractor_name"
              label="Contractor Name"
              value={formData.contractor_name}
              required
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
              }}
            />

            <TextField
              {...commonTextFieldProps}
              name="contact_person"
              label="Contact Person"
              value={formData.contact_person}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
              }}
            />

            <TextField
              {...commonTextFieldProps}
              name="contact_number"
              label="Contact Number"
              value={formData.contact_number}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
              }}
            />

            <TextField
              {...commonTextFieldProps}
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
              }}
            />

            <TextField
              {...commonTextFieldProps}
              name="address"
              label="Address"
              multiline
              minRows={1}
              value={formData.address}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(66.66% - 16px)" },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                width: "100%",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                sx={{ px: 10, borderRadius: "30px" }}
              >
                {loading ? "Submitting..." : "Register"}
              </Button>
            </Box>

            {message && (
              <Typography
                sx={{ mt: 2, textAlign: "center" }}
                color={message.includes("successfully") ? "green" : "error"}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
}

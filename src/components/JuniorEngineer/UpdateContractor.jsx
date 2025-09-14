import React, { useEffect, useState } from "react";
import {
  getContractors,
  updateContractor,
  getLoginUser,
  deleteContractor,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../header";
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


export default function UpdateContractor() {
  const [contractors, setContractors] = useState([]);
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [formData, setFormData] = useState({
    contractor_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await getContractors();
        res.data = res.data.filter((contractor) => contractor.isActive);
        setContractors(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Failed to fetch contractors", err);
      }
    };

    fetchContractors();
  }, []);

  const handleSelectContractor = (e) => {
    const contractorId = e.target.value;
    setSelectedContractorId(contractorId);
    const contractor = contractors.find(
      (c) => String(c.id) === String(contractorId)
    );
    if (contractor) {
      setFormData({
        contractor_name: contractor.contractor_name || "",
        contact_person: contractor.contact_person || "",
        contact_number: contractor.contact_number || "",
        email: contractor.email || "",
        address: contractor.address || "",
      });
    }
  };

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

      const payload = {
        ...formData,
        login_user: loginUser,
      };
      const res = await updateContractor(selectedContractorId, payload);
      setMessage(`${res.contractor_name} updated successfully!`);
      setTimeout(() => navigate("/home/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update contractor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
        const contractor = contractors.find((r) => r.id === Number(id));
    
        const confirmDelete = window.confirm(
          `Are you sure you want to delete the contractor ?\n\nThis action cannot be undone!`
        );
    
        if (!confirmDelete) {
          return;
        }
    
        setLoading(true);
    
        try {
          const loginUserId = localStorage.getItem("id");
    
          const loginUser = await getLoginUser(loginUserId);
    
          const payload = {
            login_user: loginUser,
            id: id,
          };
    
          await deleteContractor(id, payload);
          setTimeout(() => navigate("/home/"), 1000);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    

  return (
    <>
    <Header />
    <Box sx={styles.container}>
      <Box sx={styles.card}>
        <Box
  sx={{
    mb: 3,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  }}
>
  {/* Title */}
  <Typography
    variant="h5"
    textAlign="center"
    color="#333"
    sx={{ mb: isMobile ? 1.5 : 0 }}
  >
    Update Contractor Details
  </Typography>

  {/* Delete button */}
  {selectedContractorId && (
    <Box
      sx={{
        position: isMobile ? "static" : "absolute",
        right: isMobile ? "0" : "16px",
        top: isMobile ? "auto" : "50%",
        transform: isMobile ? "none" : "translateY(-50%)",
        alignSelf: isMobile ? "flex-end" : "auto",
        mt: isMobile ? 1 : 0,
      }}
    >
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => handleDelete(selectedContractorId)}
      >
        Delete
      </Button>
    </Box>
  )}
</Box>


        <form onSubmit={handleSubmit}>
          <Box sx={styles.formBox}>
            <FormControl sx={styles.field} required>
              <InputLabel>Select Contractor</InputLabel>
              <Select value={selectedContractorId} onChange={handleSelectContractor} label="Select Contractor">
                {contractors.map((contractor) => (
                  <MenuItem key={contractor.id} value={contractor.id}>
                    {contractor.contractor_name} — {contractor.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedContractorId && (
              <>
                <TextField
                  name="contractor_name"
                  label="Contractor Name"
                  value={formData.contractor_name}
                  onChange={handleChange}
                  sx={styles.field}
                  required
                />
                <TextField
                  name="contact_person"
                  label="Contact Person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  sx={styles.field}
                  required
                />
                <TextField
                  name="contact_number"
                  label="Contact Number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  sx={styles.field}
                  required
                />
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={styles.field}
                  type="email"
                />
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  sx={styles.field}
                  multiline
                  minRows={1}
                />
              </>
            )}
          </Box>

          <Box textAlign="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedContractorId || loading}
              sx={{ minWidth: 250 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
            </Button>
          </Box>
        </form>

        {message && (
          <Typography
            mt={2}
            textAlign="center"
            fontWeight="500"
            color={message.startsWith("Failed") ? "error" : "green"}
          >
            {message}
          </Typography>
        )}
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
    width:"100%",
  },
  card: {
    backgroundColor: "#fff",
    p: 2,
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width:"100%",

  },
  formBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,

  },
  field: {
    flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
    minWidth: 150,
  },
};
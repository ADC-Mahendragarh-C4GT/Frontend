import React, { useEffect, useState } from "react";
import {
  getUsers,
  updateUser,
  fetchUserType,
  deleteUser,
  getLoginUser,
} from "../../api/api";
import Header from "../Header";
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
import { useNavigate } from "react-router-dom";

export default function UpdateUser() {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    username: "",
    user_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // fetch users & user types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
        const active = res.data.filter((u) => u.isActive);
        setUsers(active);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }

      try {
        const typeRes = await fetchUserType();
        setUserTypes(typeRes.data);
      } catch (err) {
        console.error("Failed to fetch user types", err);
      }
    };
    fetchData();
  }, []);

  const handleSelectUser = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => String(u.id) === String(userId));
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        username: user.username || "",
        user_type: user.user_type || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);

      const payload = {
        ...formData,
        login_user: loginUser,
        id: selectedUserId,
      };
      const res = await updateUser(selectedUserId, payload);

      setMessage(`User Updated Successfully!`);
      setTimeout(() => navigate("/home/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      setMessage("Please select a user to delete.");
      return;
    }
    const user = users.find((u) => u.id === Number(selectedUserId));
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user?.first_name} ${user?.last_name}"?\nThis action cannot be undone!`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);
      await deleteUser(selectedUserId, {
        login_user: loginUser,
        id: selectedUserId,
      });
      setMessage("User deleted successfully!");
      setTimeout(() => navigate("/home/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <Box sx={styles.container}>
      <Box sx={styles.card}>
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
            Update User Details
          </Typography>
          {selectedUserId && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
              sx={{ ml: "auto" }}
            >
              Delete
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Box sx={styles.formBox}>
            {/* Select User */}
            <FormControl sx={styles.field} fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUserId}
                onChange={handleSelectUser}
                label="Select User"
                required
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.user_type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedUserId && (
              <>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  sx={styles.field}
                  required
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
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
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  sx={styles.field}
                  required
                />
                <FormControl sx={styles.field}>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    label="User Type"
                    required
                  >
                    {userTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedUserId || loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Box>

          {message && (
            <Typography
              mt={2}
              textAlign="center"
              color={message.startsWith("Failed") ? "error" : "success.main"}
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
    width:"100%",
  },
  card: {
    backgroundColor: "#fff",
    p: 2,
    borderRadius: "8px",
        width:"100%",

  },
  headerBox: {
    display: "flex",
    alignItems: "center",
    mb: 3,
  },
  formBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
  },
  field: {
    flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
    minWidth: 200,
  },
};

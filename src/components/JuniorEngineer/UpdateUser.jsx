import React, { useEffect, useState } from "react";
import { getUsers, updateUser, fetchUserType, deleteUser,getLoginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        res.data = res.data.filter((user) => user.isActive);
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const res = await fetchUserType();
        setUserTypes(res.data);
        console.log("----------User Types--------", res.data);
      } catch (err) {
        console.error("Failed to fetch user types", err);
      }
    };

    fetchUsers();
    fetchUserTypes();
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
    setLoading(true);
    setMessage("");
    
    try {
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      console.log("---------loginUser------", loginUser);

      const payload = {
        ...formData,
        login_user: loginUser,
        id:selectedUserId,
      };
      
      const res = await updateUser(selectedUserId, payload);
      setMessage(`${res.first_name} updated successfully!`);
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
      `Are you sure you want to delete the user "${user?.first_name} ${user?.last_name}"?\n\nThis action cannot be undone!`
    );

    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      console.log("---------loginUser------", loginUser);

      const payload = {
        login_user: loginUser,
        id:selectedUserId,
      };
      await deleteUser(selectedUserId, payload);
      setMessage(`User deleted successfully!`);
      setTimeout(() => navigate("/home/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#333",
            }}
          >
            Update User Details
          </h2>

          {selectedUserId && (
            <button
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleDeleteUser}
            >
              Delete
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <select
              required
              value={selectedUserId}
              onChange={handleSelectUser}
              style={styles.select}
            >
              <option value="" disabled>
                Select User
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.user_type}) -{" "}
                  {user.email}
                </option>
              ))}
            </select>

            {selectedUserId && (
              <>
                <TextField
                  name="first_name"
                  placeholder="FIRST NAME"
                  label="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="last_name"
                  placeholder="LAST NAME"
                  label="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="phone_number"
                  placeholder="PHONE NUMBER"
                  label="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="username"
                  placeholder="USERNAME"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                />
                
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  style={styles.select}
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
              </>
            )}
          </div>

          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={!selectedUserId}
              style={styles.button}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color:
                message.startsWith("Failed")
                  ? "red"
                  : "green",
            }}
          >
            {message}
          </p>
        )}
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
    backgroundColor: "#f9f9f9",
    color: "#000",
    textAlign: "center",
    flex: "1 1 calc(20% - 10px)",
    minWidth: "150px",
    alignSelf: "center",
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
};

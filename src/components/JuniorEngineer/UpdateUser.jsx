import React, { useEffect, useState } from "react";
import { getUsers, updateUser, fetchUserType } from "../../api/api";
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
    password: "",
    user_type: "",  // for dropdown
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);  
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    // Fetch user types
    const fetchUserTypes = async () => {
      try {
        const res = await fetchUserType();  
        setUserTypes(res.data);
        console.log('----------User Types--------', res.data);
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
      // Only pick required fields
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        username: user.username || "",
        password: "",
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
      const res = await updateUser(selectedUserId, formData);
      setMessage(`${res.first_name} updated successfully!`);
      setTimeout(() => navigate("/home/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Update User Details</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            <select
              required
              value={selectedUserId}
              onChange={handleSelectUser}
              style={styles.select}
            >
              <option value="" disabled>Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.user_type}) - {user.email}
                </option>
              ))}
            </select>

            {selectedUserId && (
              <>
                <input
                  name="first_name"
                  placeholder="FIRST NAME"
                  value={formData.first_name}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  name="last_name"
                  placeholder="LAST NAME"
                  value={formData.last_name}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  name="phone_number"
                  placeholder="PHONE NUMBER"
                  value={formData.phone_number}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  name="username"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                />
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="" disabled>Select User Type</option>
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
            <button type="submit" disabled={!selectedUserId} style={styles.button}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {message && (
          <p style={{ ...styles.message, color: message.startsWith("Failed") ? "red" : "green" }}>
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
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
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

import React, { useEffect, useState } from "react";
import { getContractors, updateContractor, getLoginUser, deleteContractor } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

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
            Update Contractor Details
          </h2>

          {selectedContractorId && (
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
              onClick={() => handleDelete(selectedContractorId)}
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
              value={selectedContractorId}
              onChange={handleSelectContractor}
              style={styles.select}
            >
              <option value="" disabled>
                Select Contractor
              </option>
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.id}>
                  {contractor.contractor_name} - {contractor.email}
                </option>
              ))}
            </select>

            {selectedContractorId && (
              <>
                <TextField
                  name="contractor_name"
                  placeholder="Contractor Name"
                  value={formData.contractor_name}
                  onChange={handleChange}
                  label="Contractor Name"
                  style={styles.input}
                />
                <TextField
                  name="contact_person"
                  placeholder="Contact Person"
                  value={formData.contact_person}
                  label="Contact Person"
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="contact_number"
                  placeholder="Contact Number"
                  value={formData.contact_number}
                  label="Contact Number"
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  label="Email"
                  onChange={handleChange}
                  style={styles.input}
                />
                <TextField
                  name="address"
                  placeholder="Address"
                  label="Address"
                  multiline
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                />
              </>
            )}
          </div>

          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={!selectedContractorId}
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
              color: message.startsWith("Failed") ? "red" : "green",
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

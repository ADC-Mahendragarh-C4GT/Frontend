import React, { useEffect, useState } from "react";
import { getRoads, getContractors, createInfraWork } from "../../api/api";
import { useNavigate } from "react-router-dom";

const NewWork = () => {
  const [formData, setFormData] = useState({
    road: "",
    phase: "",
    description: "",
    start_date: "",
    end_date: null,
    progress_percent: "",
    cost: "",
    contractor: "",
    completedOrpending: "Pending",
    defect_liability_period: "",
  });

  const navigate = useNavigate();

  const [roads, setRoads] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadRes = await getRoads();
        const contractorRes = await getContractors();
        console.log("-----------contracoter----------", contractorRes.data);
        console.log("-----------roadRes----------", roadRes);
        setRoads(roadRes);
        setContractors(contractorRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const selectedRoad = roads.find((r) => r.id === Number(formData.road));
    const selectedContractor = contractors.find(
      (c) => c.id === Number(formData.contractor)
    );
console.log("Selected Road:----------------", selectedRoad);
    console.log("Selected Contractor:---------------------", selectedContractor);
    const payload = {
      ...formData,
      road: selectedRoad,
      contractor: selectedContractor,
    };
    console.log("Payload:---------------------", payload);
    try {
      const res = await createInfraWork(payload);
      setMessage(`InfraWork for ${res.data.road} added successfully!`);
      setFormData({
        road: "",
        phase: "",
        description: "",
        start_date: "",
        end_date: "",
        progress_percent: "",
        cost: "",
        contractor: "",
        completedOrpending: "",
        defect_liability_period: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add InfraWork.");
    } finally {
      setLoading(false);
      navigate("/home/");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add New InfraWork</h2>

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
              name="road"
              value={formData.road}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="" disabled>
                Select Road
              </option>
              {roads?.map((road) => (
                <option key={road.id} value={road.id}>
                  {road.road_name}
                </option>
              ))}
            </select>

            <input
              name="phase"
              placeholder="PHASE"
              value={formData.phase}
              onChange={handleChange}
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="DESCRIPTION"
              value={formData.description}
              onChange={handleChange}
              style={{
                ...styles.input,
                minHeight: "60px",
                flex: "1 1 90%",
                textAlign: "start",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 calc(20% - 10px)",
                minWidth: "150px",
              }}
            >
              <label
                style={{
                  marginBottom: "4px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <input
              name="progress_percent"
              placeholder="PROGRESS %"
              value={formData.progress_percent}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="cost"
              placeholder="COST"
              value={formData.cost}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="contractor"
              value={formData.contractor}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="" disabled>
                Select Contractor
              </option>
              {contractors.map((con) => (
                <option key={con.id} value={con.id} style={{ color: "#000" }}>
                  {con.contractor_name} - {con.contact_person}
                </option>
              ))}
            </select>

            <select
              name="completedOrpending"
              value={formData.completedOrpending}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="" disabled>
                COMPLETED / PENDING
              </option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <input
              name="defect_liability_period"
              placeholder="DEFECT LIABILITY PERIOD (months)"
              value={formData.defect_liability_period}
              onChange={handleChange}
              style={styles.input}
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
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.startsWith("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewWork;

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
    color: "#000",
    flex: "1 1 calc(20% - 10px)",
    minWidth: "150px",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
};

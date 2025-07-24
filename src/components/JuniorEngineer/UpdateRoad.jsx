import React, { useEffect, useState } from "react";
import { getRoads, updateRoad } from "../../api/api"; // make sure updateRoad is implemented in your api
import { useNavigate } from "react-router-dom";

export default function UpdateRoad() {
  const [roads, setRoads] = useState([]);
  const [selectedRoadId, setSelectedRoadId] = useState("");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const res = await getRoads();
        setRoads(res);
      } catch (err) {
        console.error("Failed to fetch roads", err);
      }
    };

    fetchRoads();
  }, []);

  const handleSelectRoad = (e) => {
    const roadId = e.target.value;
    setSelectedRoadId(roadId);
    const road = roads.find((r) => String(r.id) === String(roadId));
    if (road) {
      setFormData({ ...road });
    } else {
      setFormData({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await updateRoad(selectedRoadId, formData);
      setMessage(`${res.data.road_name} updated successfully!`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update road.");
    } finally {
      setLoading(false);
      setTimeout(() => navigate("/home/"), 1500);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Update Road Details</h2>

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
              name="road"
              value={selectedRoadId}
              onChange={handleSelectRoad}
              style={styles.select}
            >
              <option value="" disabled>
                Select Road
              </option>
              {roads.map((road) => (
                <option key={road.id} value={road.id}>
                  {road.unique_code} - {road.road_name}
                </option>
              ))}
            </select>

            {selectedRoadId &&
              Object.keys(formData).map((key) => {
                if (key === "id" || key === "unique_code") {
                  return null; // unique_code is fixed & id hidden
                }

                if (
                  key === "road_type" ||
                  key === "material_type" ||
                  key === "road_category"
                ) {
                  let options = [];

                  if (key === "road_type") options = ["IV", "VI", "Others"];
                  if (key === "material_type")
                    options = ["CC", "IPB", "Bitumin", "Other"];
                  if (key === "road_category")
                    options = ["Road", "ColonyStreet"];

                  return (
                    <select
                      required
                      key={key}
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="" disabled>
                        {key.replace("_", " ").toUpperCase()}
                      </option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  );
                }

                return (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    placeholder={key.replace("_", " ").toUpperCase()}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    style={styles.input}
                  />
                );
              })}
          </div>

          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" disabled={!selectedRoadId} style={styles.button}>
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

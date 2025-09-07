import React, { useEffect, useState } from "react";
import { getRoads, updateRoad, getLoginUser, deleteRoad } from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function UpdateRoad() {
  const [roads, setRoads] = useState([]);
  const [filteredRoads, setFilteredRoads] = useState([]);
  const [selectedRoadId, setSelectedRoadId] = useState("");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Filters
  const [wardNumberFilter, setWardNumberFilter] = useState("");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("");
  const [roadCategoryFilter, setRoadCategoryFilter] = useState("");

  const location = useLocation();
  const passedId = location.state?.id || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const res = await getRoads();
        setRoads(res);
        setFilteredRoads(res); // default all roads

        if (passedId) {
          const road = res.find((r) => String(r.id) === String(passedId));
          if (road) {
            setSelectedRoadId(passedId);
            setFormData({ ...road });
          }
        }
      } catch (err) {
        console.error("Failed to fetch roads", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchRoads();
  }, []);

  const distinctWardNumbers = Array.from(
    new Set(roads.map((r) => r.ward_number).filter(Boolean))
  ).sort((a, b) => a - b);

  const distinctMaterialTypes = Array.from(
    new Set(roads.map((r) => r.material_type).filter(Boolean))
  ).sort();

  const distinctRoadCategories = Array.from(
    new Set(roads.map((r) => r.road_category).filter(Boolean))
  ).sort();

  // Filtering logic
  useEffect(() => {
    let filtered = roads;

    if (wardNumberFilter && wardNumberFilter !== "All") {
      filtered = filtered.filter(
        (r) => String(r.ward_number) === String(wardNumberFilter)
      );
    }

    if (materialTypeFilter && materialTypeFilter !== "All") {
      filtered = filtered.filter(
        (r) =>
          r.material_type &&
          r.material_type.toLowerCase() === materialTypeFilter.toLowerCase()
      );
    }

    if (roadCategoryFilter && roadCategoryFilter !== "All") {
      filtered = filtered.filter(
        (r) =>
          r.road_category &&
          r.road_category.toLowerCase() === roadCategoryFilter.toLowerCase()
      );
    }

    setFilteredRoads(filtered);
  }, [wardNumberFilter, materialTypeFilter, roadCategoryFilter, roads]);

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
    setPageLoading(true);
    setMessage("");

    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);

      const payload = {
        ...formData,
        login_user: loginUser,
        id: selectedRoadId,
      };

      const res = await updateRoad(selectedRoadId, payload);
      setMessage(`${res.data.road_name} updated successfully!`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update road.");
    } finally {
      setLoading(false);
      setPageLoading(false);
      setTimeout(() => navigate("/home/"), 1000);
    }
  };

  const handleDelete = async (id) => {
    const road = roads.find((r) => r.id === Number(id));

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the road?\n\nThis action cannot be undone!`
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);

      const payload = {
        login_user: loginUser,
        id: id,
      };

      await deleteRoad(id, payload);
      setRoads((prevRoads) => prevRoads.filter((r) => r.id !== id));
      setTimeout(() => navigate("/home/"), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div
          style={{
            color: "#000",
            position: "relative",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#000",
            }}
          >
            Update Road Details
          </h2>

          {selectedRoadId && (
            <button
              style={{
                color: "#000",
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
              onClick={() => handleDelete(selectedRoadId)}
            >
              Delete
            </button>
          )}
        </div>


        {/* Filtering inputs */}
        <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
          <select
            name="ward_number"
            value={wardNumberFilter}
            onChange={(e) => setWardNumberFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Wards (Optional)</option>
            {distinctWardNumbers.map((ward, idx) => (
              <option key={idx} value={ward}>
                Ward {ward}
              </option>
            ))}
          </select>

          <select
            value={materialTypeFilter}
            onChange={(e) => setMaterialTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Material Types (Optional)</option>
            {distinctMaterialTypes.map((mat, idx) => (
              <option key={idx} value={mat}>
                {mat}
              </option>
            ))}
          </select>

          <select
            value={roadCategoryFilter}
            onChange={(e) => setRoadCategoryFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Road Categories (Optional)</option>
            {distinctRoadCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <select
            required
            name="road"
            value={selectedRoadId}
            onChange={handleSelectRoad}
            style={{ ...styles.select, marginBottom: "20px", width: "100%", color: "#000" }}
          >
            <option value="" disabled>
              Select Road
            </option>
            {filteredRoads.map((road) => (
              <option key={road.id} value={road.id}>
                {road.unique_code} - {road.road_name}
              </option>
            ))}
          </select>

          {/* Form fields */}
          {selectedRoadId &&
            Object.keys(formData).map((key) => {
              if (key === "id" || key === "unique_code") return null;

              if (
                key === "road_type" ||
                key === "material_type" ||
                key === "road_category"
              ) {
                let options = [];

                if (key === "road_type") options = ["1", "2","3","4","5","6","7","8","9","10", "Others"];
                if (key === "material_type")
                  options = ["CC", "KACCHA", "METALIC","Paver Block", "Other"];
                if (key === "road_category") options = ["City Road", "Major District Road", "National Highway", "State Highway", "Other"];

                return (
                  <div>
                  <label style={styles.label} key={key}>{key.replace("_", " ").toUpperCase()}</label>
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
                  </div>
                );
              }

              return (
                <TextField
                  key={key}
                  type="text"
                  name={key}
                  label={key.replace("_", " ").toUpperCase()}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              );
            })}

          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={!selectedRoadId}
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
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },
  card: {
    color: "#000",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "90%",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#000",
  },
  input: {
    width: "100%",
    marginBottom: "1rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "1rem",
    boxSizing: "border-box",
    color: "#000",
  },
  select: {
    width: "100%",
    marginBottom: "1rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px 14px",
    fontSize: "1rem",
    boxSizing: "border-box",
    color: "#000",
  },
  button: {
    width: "40%",
    padding: "0.8rem",
    border: "none",
    borderRadius: "8px",
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
        color: "#000",

  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    fontSize: "0.9rem",
    color: "#000",
  },
};

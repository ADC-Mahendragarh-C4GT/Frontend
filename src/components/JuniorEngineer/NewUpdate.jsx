import React, { useState, useEffect } from "react";
import { getRoads, getInfraWorks, createUpdate } from "../../api/api";
import { useNavigate } from "react-router-dom";


export default function NewUpdate() {
  const [roads, setRoads] = useState([]);
  const [InfraWorks, setInfraWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [progressPercent, setProgressPercent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadsRes = await getRoads();
        const worksRes = await getInfraWorks();
        console.log("Fetched Roads:", roadsRes);
        console.log("Fetched Works:", worksRes);

        const worksArray = Array.isArray(worksRes)
          ? worksRes
          : worksRes.data ?? [];

        setRoads(roadsRes);
        setInfraWorks(worksArray);
        setFilteredWorks(worksArray);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedRoad) {
      setFilteredWorks(InfraWorks);
      return;
    }

    setFilteredWorks(InfraWorks);

    const timeout = setTimeout(() => {
      const selectedRoadObj = roads.find(
        (road) => road.id === Number(selectedRoad)
      );
      if (selectedRoadObj) {
        const filtered = InfraWorks.filter(
          (InfraWork) => String(InfraWork.road) === String(selectedRoadObj.id)
        );
        console.log("Filtered Works:", filtered);
        setFilteredWorks(filtered);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [selectedRoad, InfraWorks]);

  const handleRoadChange = (e) => {
    const roadId = e.target.value;
    setSelectedRoad(roadId);
    setSelectedWork("");
  };
  console.log("-----------------filteredWorks-----------------", filteredWorks);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        work: selectedWork,
        progress_percent: progressPercent,
        status_note: statusNote,
      };

      console.log("Payload: ", payload);

      await createUpdate(payload);

      setMessage("Update created successfully!");
      setSelectedRoad("");
      setSelectedWork("");
      setProgressPercent("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create update.");
    } finally {
      setLoading(false);
      navigate("/home/");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add New Update</h2>

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
              value={selectedRoad}
              onChange={handleRoadChange}
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

            <select
              name="InfraWork"
              value={selectedWork}
              onChange={(e) => setSelectedWork(e.target.value)}
              style={styles.select}
              required
            >
              <option value="" disabled>
                Select Work
              </option>
              {filteredWorks.length === 0 ? (
                <option value="" disabled>
                  No works available for this road
                </option>
              ) : (
                filteredWorks.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.description} - {work.phase} - {work.start_date} - {work.end_date} - {work.progress_percent}%
                  </option>
                ))
              )}
            </select>

            <input
              type="number"
              name="progressPercent"
              placeholder="Progress %"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
              minHeight: "100px",
            }}
          >
            <textarea
              type="text"
              name="statusNote"
              placeholder="Status Note"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              style={{ ...styles.input, textAlign: "start" }}
              required
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

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("") ? "red" : "green",
              }}
            >
              {message}
            </p>
          )}
        </form>
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
    flex: "1 1 calc(20% - 10px)",
    minWidth: "150px",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
};

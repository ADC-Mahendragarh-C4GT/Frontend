import React, { useEffect, useState } from "react";
import {
  getRoads,
  getContractors,
  createInfraWork,
  getWorksonRoad,
  getLoginUser,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

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
    image: "",
  });

  const navigate = useNavigate();

  const [roads, setRoads] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [FinalLatitude, setFinalLatitude] = useState(null);
  const [FinalLongitude, setFinalLongitude] = useState(null);
  const [pdfDescription, setPdfDescription] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFinalLatitude(position.coords.latitude);
          setFinalLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadRes = await getRoads();
        const contractors = await getContractors();
        const contractorRes = contractors.data.filter(
          (contractor) => contractor.isActive
        );

        console.log("-----------contracoter----------", contractorRes);
        console.log("-----------roadRes----------", roadRes);
        setRoads(roadRes);
        setContractors(contractorRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "progress_percent") {
      const num = Number(value);

      if (isNaN(num) || num < 0 || num > 100) {
        alert("Progress percent must be between 0 and 100.");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const selectedRoad = roads.find((r) => r.id === Number(formData.road));
    const selectedContractor = contractors.find(
      (c) => c.id === Number(formData.contractor)
    );

    const payload = {
      ...formData,
      road: selectedRoad,
      contractor: selectedContractor,
      latitude: FinalLatitude,
      longitude: FinalLongitude,
      pdfDescription: pdfDescription,
    };

    try {
      const existingWorks = await getWorksonRoad(selectedRoad.id);
      const currentTime = new Date();

      for (const work of existingWorks.data) {
        const isPending = work.completedOrpending === "Pending";

        const workEndDate = new Date(work.end_date);
        const liabilityMonths = Number(work.defect_liability_period) || 0;

        const defectLiabilityEndDate = new Date(workEndDate);
        defectLiabilityEndDate.setMonth(
          defectLiabilityEndDate.getMonth() + liabilityMonths
        );

        const isCompletedButInDefectPeriod =
          work.progress_percent === 100 && currentTime < defectLiabilityEndDate;

        if (isPending || isCompletedButInDefectPeriod) {
          setSavedPayload(payload);
          setShowConfirmation(true);
          setLoading(false);
          return;
        }
      }

      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      console.log("---------loginUser------", loginUser);

      const pay = {
        ...payload,
        login_user: loginUser,
      };

      await submitInfraWork(pay);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add InfraWork.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, pdfDescription: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload only image files (jpg, png, jpeg, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const submitInfraWork = async (payload) => {
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
      navigate("/home/");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add InfraWork.");
    }
  };

  const handleConfirmYes = async () => {
    setShowConfirmation(false);
    setLoading(true);
    await submitInfraWork(savedPayload);
    setLoading(false);
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {showConfirmation && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "25px 30px",
                borderRadius: "10px",
                width: "400px",
                textAlign: "center",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              }}
            >
              <h2 style={{ color: "#333" }}>Existing Work Alert</h2>
              <p style={{ color: "#000" }}>
                There is already a pending work or a recently completed work
                still under defect liability period. Do you want to proceed with
                adding a new InfraWork?
              </p>
              <button
                onClick={handleConfirmYes}
                style={{ marginRight: "10px" }}
              >
                Yes, Add New Work
              </button>
              <button onClick={handleConfirmNo}>No, Cancel</button>
            </div>
          </div>
        )}

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
                  {road.unique_code} - {road.road_name}
                </option>
              ))}
            </select>

            <TextField
              name="phase"
              placeholder="PHASE"
              label="Phase"
              value={formData.phase}
              onChange={handleChange}
              style={styles.input}
              required
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
                required
              />
            </div>

            <TextField
              name="progress_percent"
              placeholder="PROGRESS %"
              type="number"
              value={formData.progress_percent}
              label="Progress Percent"
              onChange={handleChange}
              style={styles.input}
              inputProps={{ min: 0, max: 100 }}
              required
            />

            <TextField
              name="cost"
              placeholder="COST"
              label="Cost"
              type="Number"
              value={formData.cost}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <select
              name="contractor"
              value={formData.contractor}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="" disabled>
                Select Contractor
              </option>
              {contractors?.map((con) => (
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
              required
            >
              <option value="" disabled>
                COMPLETED / PENDING
              </option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <TextField
              name="defect_liability_period"
              placeholder="DEFECT LIABILITY PERIOD (months)"
              label="Defect Liability Period (months)"
              value={formData.defect_liability_period}
              onChange={handleChange}
              style={styles.input}
              type="Number"
              required
            />
            <TextField
              name="description"
              placeholder="DESCRIPTION"
              label="Short description in 1 or 2 line"
              multiline
              value={formData.description}
              onChange={handleChange}
              style={{
                ...styles.input,
                minHeight: "60px",
                flex: "1 1 90%",
                textAlign: "start",
              }}
              required
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
                Upload Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*,application/pdf"
                onChange={handleImageChange}
                style={styles.input}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 calc(20% - 10px)",
                minWidth: "150px",
                marginTop: "1rem",
              }}
            >
              <label
                style={{
                  marginBottom: "4px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Upload Detailed Update/Description (Optional)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                placeholder="Please upload PDF only"
                style={styles.input}
              />
            </div>
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
    backgroundColor: "#e0e0e0",
    color: "#000",
    textAlign: "center",
    flex: "1 1 calc(20% - 10px)",
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

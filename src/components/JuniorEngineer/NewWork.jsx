import React, { useEffect, useState } from "react";
import {
  getRoads,
  getContractors,
  createInfraWork,
  getWorksonRoad,
  getLoginUser,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Header from "../header";

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
    pdfDescription: "",
  });

  const [roads, setRoads] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [wardFilter, setWardFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [finalLatitude, setFinalLatitude] = useState(null);
  const [finalLongitude, setFinalLongitude] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFinalLatitude(position.coords.latitude);
          setFinalLongitude(position.coords.longitude);
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadRes = await getRoads();
        const contractorsRes = await getContractors();
        const activeContractors = contractorsRes.data.filter((c) => c.isActive);

        setRoads(roadRes);
        setContractors(activeContractors);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const distinctWardNumbers = [...new Set(roads.map((r) => r.ward_number))];
  const distinctMaterials = [...new Set(roads.map((r) => r.material_type))];
  const distinctCategories = [...new Set(roads.map((r) => r.road_category))];

  const filteredRoads = roads.filter((road) => {
    const wardMatch = wardFilter === "All" || road.ward_number === wardFilter;
    const materialMatch =
      materialFilter === "All" || road.material_type === materialFilter;
    const categoryMatch =
      categoryFilter === "All" || road.road_category === categoryFilter;
    return wardMatch && materialMatch && categoryMatch;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "progress_percent") {
      const num = Number(value);
      if (isNaN(num) || num < 0 || num > 100) {
        alert("Progress percent must be between 0 and 100.");
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Please upload only image files.");
      return;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      alert("Please upload only PDF files.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "image" : "pdfDescription"]: reader.result,
      }));
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
        completedOrpending: "Pending",
        defect_liability_period: "",
        image: "",
        pdfDescription: "",
      });
      navigate("/home/");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add InfraWork.");
    }
  };

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
      latitude: finalLatitude,
      longitude: finalLongitude,
    };

    try {
      const existingWorks = await getWorksonRoad(selectedRoad.id);
      const currentTime = new Date();

      for (const work of existingWorks.data) {
        const isPending = work.completedOrpending === "Pending";

        let isCompletedButInDefectPeriod = false;
        if (work.progress_percent === 100 && work.end_date) {
          const workEndDate = new Date(work.end_date);
          const liabilityMonths = Number(work.defect_liability_period) || 0;
          const defectLiabilityEndDate = new Date(workEndDate);
          defectLiabilityEndDate.setMonth(
            defectLiabilityEndDate.getMonth() + liabilityMonths
          );
          isCompletedButInDefectPeriod = currentTime < defectLiabilityEndDate;
        }

        if (isPending || isCompletedButInDefectPeriod) {
          setSavedPayload(payload);
          setShowConfirmation(true);
          setLoading(false);
          return;
        }
      }

      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);
      await submitInfraWork({ ...payload, login_user: loginUser });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add InfraWork.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmYes = async () => {
    setShowConfirmation(false);
    setLoading(true);
    await submitInfraWork(savedPayload);
    setLoading(false);
  };

  const handleConfirmNo = () => setShowConfirmation(false);

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

  const commonProps = {
    margin: "normal",
    size: "small",
    sx: {
      flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
    },
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 2, mx: "auto" }}>
        {showConfirmation && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              color : "#000",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 3,
                borderRadius: 2,
                width: 350,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" mb={2}>
                Existing Work Alert
              </Typography>
              <Typography mb={2}>
                There is already a pending work or recently completed work still
                under defect liability period. Do you want to proceed?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirmYes}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmNo}
                >
                  No
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Add New Work on Road
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {/* Ward Filter */}
              <TextField
                {...commonProps}
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                select
                label="Ward (Optional)"
              >
                <MenuItem value="All">All Wards</MenuItem>

                {distinctWardNumbers.map((w) => (
                  <MenuItem key={w} value={w}>
                    Ward {w}
                  </MenuItem>
                ))}
              </TextField>

              {/* Material Filter */}
              <TextField
                {...commonProps}
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                select
                label="Material (Optional)"
              >
                <MenuItem value="All">All Categories</MenuItem>

                {distinctMaterials.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m} Material
                  </MenuItem>
                ))}
              </TextField>

              {/* Category Filter */}
              <TextField
                {...commonProps}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                select
                label="Category (Optional)"
              >
                <MenuItem value="All">All Categories</MenuItem>

                {distinctCategories.map((c) => (
                  <MenuItem key={c} value={c} style={{ color: "#000" }}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              {/* Road */}
              <TextField
                {...commonProps}
                select
                label="Select Road"
                name="road"
                value={formData.road}
                onChange={handleChange}
                required
              >
                {filteredRoads.length == 0 ? (
                  <MenuItem key="" value="">
                    No Road Found
                  </MenuItem>
                ) : (
                  filteredRoads.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.unique_code} - {r.road_name}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                {...commonProps}
                name="phase"
                label="Phase"
                value={formData.phase}
                onChange={handleChange}
                required
              />

              <TextField
                {...commonProps}
                type="date"
                name="start_date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={handleChange}
                required
              />

              <TextField
                {...commonProps}
                type="number"
                name="progress_percent"
                label="Progress %"
                value={formData.progress_percent}
                onChange={handleChange}
                inputProps={{ min: 0, max: 100 }}
                required
              />

              <TextField
                {...commonProps}
                type="number"
                name="cost"
                label="Cost"
                value={formData.cost}
                onChange={handleChange}
                required
              />

              <TextField
                {...commonProps}
                select
                label="Contractor"
                name="contractor"
                value={formData.contractor}
                onChange={handleChange}
                required
              >
                {contractors.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.contractor_name} - {c.contact_person}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                {...commonProps}
                select
                label="Status"
                name="completedOrpending"
                value={formData.completedOrpending}
                onChange={handleChange}
                required
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>

              <TextField
                {...commonProps}
                type="number"
                name="defect_liability_period"
                label="Defect Liability Period (months)"
                value={formData.defect_liability_period}
                onChange={handleChange}
                required
              />

              <TextField
                {...commonProps}
                label="Description"
                name="description"
                multiline
                minRows={2}
                value={formData.description}
                onChange={handleChange}
                required
              />

              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
              >
                Upload Image (Optional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                />
              </Button>

              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
              >
                Upload PDF (Optional)
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "pdf")}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>
        </div>

        {message && (
          <Typography
            align="center"
            color={message.includes("successfully") ? "green" : "red"}
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default NewWork;

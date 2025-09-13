import React, { useState, useEffect } from "react";
import {
  getRoads,
  getInfraWorks,
  createUpdate,
  getLoginUser,
} from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import Header from "../header";

export default function NewUpdate() {
  const [roads, setRoads] = useState([]);
  const [infraWorks, setInfraWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [progressPercent, setProgressPercent] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfDescription, setPdfDescription] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const location = useLocation();
  const { roadId, workId } = location.state || {};
  const navigate = useNavigate();

  // filters
  const [wardFilter, setWardFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadsRes = await getRoads();
        const worksRes = (await getInfraWorks()).data.filter((w) => w.isActive);
        setRoads(roadsRes);
        setInfraWorks(worksRes);
        setFilteredWorks(worksRes);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  // preselect road/work after data arrives
  useEffect(() => {
    if (!pageLoading && roadId) {
      setSelectedRoad(String(roadId));
    }
  }, [pageLoading, roadId]);

  useEffect(() => {
    if (!pageLoading && workId) {
      setSelectedWork(String(workId));
    }
  }, [pageLoading, workId]);

  // filter works when road changes
  useEffect(() => {
    if (!selectedRoad) {
      setFilteredWorks(infraWorks);
    } else {
      const filtered = infraWorks.filter(
        (w) => String(w.road) === String(selectedRoad)
      );
      setFilteredWorks(filtered);
    }
  }, [selectedRoad, infraWorks]);

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

  const handleRoadChange = (e) => {
    setSelectedRoad(e.target.value);
    setSelectedWork("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedWorkObj = infraWorks.find(
      (work) => String(work.id) === String(selectedWork)
    );

    if (selectedWorkObj && Number(selectedWorkObj.progress_percent) === 100) {
      alert("This work is already 100% complete. No more updates allowed.");
      setLoading(false);
      navigate("/home/");
      return;
    }
    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);
      await createUpdate({
        login_user: loginUser,
        road: selectedRoad,
        work: selectedWork,
        progress_percent: progressPercent,
        status_note: statusNote,
        image: imageBase64,
        pdfDescription,
      });
      setMessage("Update created successfully!");
      navigate("/home/");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create update.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={styles.container}>
        <Box sx={styles.card}>
          <h2 style={styles.heading}>Add New Update</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={styles.formBox}>
              <FormControl sx={styles.field}>
                <InputLabel>Ward (Optional)</InputLabel>
                <Select
                  value={wardFilter}
                  onChange={(e) => setWardFilter(e.target.value)}
                >
                  <MenuItem value="All">All Wards</MenuItem>
                  {distinctWardNumbers.map((w) => (
                    <MenuItem key={w} value={w}>{`Ward ${w}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={styles.field}>
                <InputLabel>Material (Optional)</InputLabel>
                <Select
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                >
                  <MenuItem value="All">All Material Types</MenuItem>
                  {distinctMaterials.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl sx={styles.field}>
                <InputLabel>Category (Optional)</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {distinctCategories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl sx={styles.field} required>
                <InputLabel>Road</InputLabel>
                <Select value={selectedRoad} onChange={handleRoadChange}>
                  {filteredRoads.length === 0 ? (
                    <MenuItem value="">No Roads Found</MenuItem>
                  ) : (
                    filteredRoads.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.unique_code} - {r.road_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>


              <FormControl sx={styles.field} required>
                <InputLabel>Work</InputLabel>
                <Select
                  value={selectedWork}
                  onChange={(e) => setSelectedWork(e.target.value)}
                >
                  {filteredWorks.length === 0 ? (
                    <MenuItem value="">No Work Found</MenuItem>
                  ) : (
                    filteredWorks.map((w) => (
                      <MenuItem key={w.id} value={w.id}>
                        {w.description} – {w.phase}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>


              <TextField
                label="Progress %"
                type="number"
                value={progressPercent}
                onChange={(e) => setProgressPercent(e.target.value)}
                sx={styles.field}
                required
              />


              <TextField
                label="Short Description"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 2 }}
              />


              <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>

              <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                Upload PDF (Optional)
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPdfDescription(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </Button>
            </Box>

            {message && (
              <Box
                mt={2}
                textAlign="center"
                color={message.startsWith("Failed") ? "red" : "green"}
              >
                {message}
              </Box>
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
  },
  card: {
    background: "#fff",
    p: 2,
    borderRadius: "8px",
  },
  heading: { textAlign: "center", color: "#333" },
  formBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
  },
  field: {
    flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" },
    minWidth: 150,
  },
};

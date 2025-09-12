import React, { useEffect, useState } from "react";
import { getRoads, updateRoad, getLoginUser, deleteRoad } from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import Header from "../header";

export default function UpdateRoad() {
  const [roads, setRoads] = useState([]);
  const [filteredRoads, setFilteredRoads] = useState([]);
  const [selectedRoadId, setSelectedRoadId] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const [wardNumberFilter, setWardNumberFilter] = useState("");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("");
  const [roadCategoryFilter, setRoadCategoryFilter] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const passedId = location.state?.id || "";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const res = await getRoads();
        setRoads(res);
        setFilteredRoads(res);

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
  }, [passedId]);

  const wardOptions = Array.from(
    new Set(roads.map((r) => r.ward_number).filter(Boolean))
  ).sort((a, b) => a - b);

  const materialOptions = Array.from(
    new Set(roads.map((r) => r.material_type).filter(Boolean))
  ).sort();

  const categoryOptions = Array.from(
    new Set(roads.map((r) => r.road_category).filter(Boolean))
  ).sort();

  useEffect(() => {
    let result = roads;

    if (wardNumberFilter && wardNumberFilter !== "All") {
      result = result.filter(
        (r) => String(r.ward_number) === String(wardNumberFilter)
      );
    }
    if (materialTypeFilter && materialTypeFilter !== "All") {
      result = result.filter(
        (r) =>
          r.material_type &&
          r.material_type.toLowerCase() === materialTypeFilter.toLowerCase()
      );
    }
    if (roadCategoryFilter && roadCategoryFilter !== "All") {
      result = result.filter(
        (r) =>
          r.road_category &&
          r.road_category.toLowerCase() === roadCategoryFilter.toLowerCase()
      );
    }
    setFilteredRoads(result);
  }, [wardNumberFilter, materialTypeFilter, roadCategoryFilter, roads]);

  const handleSelectRoad = (e) => {
    const id = e.target.value;
    setSelectedRoadId(id);
    const road = roads.find((r) => String(r.id) === String(id));
    setFormData(road || {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoadId) return;
    setLoading(true);
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
      setTimeout(() => navigate("/home/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update road.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const road = roads.find((r) => r.id === Number(id));
    const confirm = window.confirm(
      `Are you sure you want to delete "${road?.road_name}"?\nThis action cannot be undone!`
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const loginUserId = localStorage.getItem("id");
      const loginUser = await getLoginUser(loginUserId);
      await deleteRoad(id, { login_user: loginUser, id });
      setRoads((prev) => prev.filter((r) => r.id !== id));
      setTimeout(() => navigate("/home/"), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const inputStyle = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    flexWrap: "wrap",
    gap: isMobile ? 1 : 2,
    justifyContent: isMobile ? "flex-start" : "space-between",
    width: "100%",
    mb: 3,
  };

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: 3,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Update Road Details
            </Typography>
          </div>

          {/*  Delete */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,

              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
            }}
          >
            {selectedRoadId && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(selectedRoadId)}
              >
                Delete
              </Button>
            )}
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <TextField
              select
              label="Select Ward (Optional)"
              value={wardNumberFilter}
              onChange={(e) => setWardNumberFilter(e.target.value)}
              sx={{ minWidth: "30%" }}
              size="small"
            >
              <MenuItem value="All">All Wards</MenuItem>
              {wardOptions.map((w) => (
                <MenuItem key={w} value={w}>
                  Ward {w}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select Road Material Type (Optional)"
              value={materialTypeFilter}
              onChange={(e) => setMaterialTypeFilter(e.target.value)}
              sx={{ minWidth: "30%" }}
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              {materialOptions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select Road Category (Optional)"
              value={roadCategoryFilter}
              onChange={(e) => setRoadCategoryFilter(e.target.value)}
              sx={{ minWidth: "30%" }}
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Select Road"
              value={selectedRoadId}
              onChange={handleSelectRoad}
              size="small"
              sx={{ mb: 3 }}
              required
            >
              <MenuItem value="" disabled>
                Select Road
              </MenuItem>
              {filteredRoads.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.unique_code} - {r.road_name}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row", // always row, flexWrap will handle wrapping
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              {selectedRoadId &&
                Object.keys(formData).map((key) => {
                  if (
                    key === "id" ||
                    key === "unique_code" ||
                    key === "isActive"
                  )
                    return null;

                  const commonProps = {
                    key,
                    name: key,
                    value: formData[key] || "",
                    onChange: handleChange,
                    size: "small",
                    sx: {
                      width: !isMobile ? "calc(33.33% - 16px)" : "100%",
                      // desktop: 3 inputs per row (33.33%), mobile: full width
                    },
                  };

                  if (key === "ward_number") {
                    const options = wardOptions;
                    return (
                      <TextField {...commonProps} select label="Ward">
                        {options.map((o) => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  // Dropdowns
                  if (key === "road_type") {
                    const options = [
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                      "10",
                      "Others",
                    ];
                    return (
                      <TextField {...commonProps} select label="Road Type">
                        {options.map((o) => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  if (key === "material_type") {
                    const options = materialOptions;
                    return (
                      <TextField {...commonProps} select label="Material Type">
                        {options.map((o) => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  if (key === "road_category") {
                    const options = categoryOptions;
                    return (
                      <TextField {...commonProps} select label="Road Category">
                        {options.map((o) => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  // Numbers
                  if (key === "length_km" || key === "width_m") {
                    return (
                      <TextField
                        {...commonProps}
                        type="number"
                        label={key.replace("_", " ").toUpperCase()}
                        inputProps={{ step: "any", min: 0 }}
                      />
                    );
                  }

                  // Text fields
                  return (
                    <TextField
                      {...commonProps}
                      label={key.replace("_", " ").toUpperCase()}
                    />
                  );
                })}
            </Box>

            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!selectedRoadId || loading}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 5,
                  fontWeight: 600,
                  width: "100%",
                }}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </Box>

            {message && (
              <Typography
                align="center"
                mt={2}
                color={message.startsWith("Failed") ? "error" : "green"}
              >
                {message}
              </Typography>
            )}
          </form>
        </Box>
      </Box>
    </>
  );
}

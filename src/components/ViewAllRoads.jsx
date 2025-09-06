import React, { useEffect, useState } from "react";
import { getRoads, deleteRoad, getLoginUser } from "../api/api";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ViewAllRoads() {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalCount = roads.length;
  const [roadQuery, setRoadQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [stateFilter, setStateFilter] = useState("");
  const [stateAnchorEl, setStateAnchorEl] = useState(null);
  const [areaFilter, setAreaFilter] = useState("");
  const [areaAnchorEl, setAreaAnchorEl] = useState(null);
  const [roadCategoryFilter, setRoadCategoryFilter] = useState("");
  const [roadCategoryAnchorEl, setRoadCategoryAnchorEl] = useState(null);
  const [materialTypeFilter, setMaterialTypeFilter] = useState("");
  const [materialTypeAnchorEl, setMaterialTypeAnchorEl] = useState(null);
  const [roadTypeFilter, setRoadTypeFilter] = useState("");
  const [roadTypeAnchorEl, setRoadTypeAnchorEl] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [wardFilter, setWardFilter] = useState("");
  const [wardAnchorEl, setWardAnchorEl] = useState(null);
  const [widthFilter, setWidthFilter] = useState("");
  const [widthAnchorEl, setWidthAnchorEl] = useState(null);
  const [lengthFilter, setLengthFilter] = useState("");
  const [lengthAnchorEl, setLengthAnchorEl] = useState(null);

  const lengthOptions = [
    { value: "All", label: "All" },
    { value: "0-100", label: "0 - 100 m" },
    { value: "100-500", label: "100 - 500 m" },
    { value: "500-1000", label: "500 - 1000 m" },
    { value: "1000-5000", label: "1000 - 5000 m" },
    { value: "5000+", label: "Greater than 5000 m" },
  ];

  const widthOptions = [
    { value: "All", label: "All" },
    { value: "0-10", label: "0 - 10 m" },
    { value: "10-50", label: "10 - 50 m" },
    { value: "50-100", label: "50 - 100 m" },
    { value: "100+", label: "Greater than 100 m" },
  ];

  const wardOptions = [
  { value: "All Wards", label: "All Wards" },
  ...Array.from(new Set(roads.map((r) => r.ward_number)))
    .sort((a, b) => a - b) 
    .map((w) => ({
      value: w,
      label: w,
    })),
];

  const locationOptions = [
    { value: "All Locations", label: "All Locations" },
    ...Array.from(new Set(roads.map((r) => r.location))).map((loc) => ({
      value: loc,
      label: loc,
    })),
  ];

  const roadTypeOptions = [
  { value: "All Road Types", label: "All Road Types" },
  ...Array.from(new Set(roads.map((r) => r.road_type)))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .map((t) => ({
      value: t,
      label: t,
    })),
];


  const roadCategoryOptions = [
    { value: "All Categories", label: "All Categories" },
    ...Array.from(new Set(roads.map((r) => r.road_category))).map((c) => ({
      value: c,
      label: c,
    })),
  ];

  const areaOptions = [
    { value: "All Area", label: "All Area" },
    ...Array.from(new Set(roads.map((r) => r.area_name))).map((a) => ({
      value: a,
      label: a,
    })),
  ];
  const materialTypeOptions = [
    { value: "All Materials", label: "All Materials" },
    ...Array.from(new Set(roads.map((r) => r.material_type))).map((m) => ({
      value: m,
      label: m,
    })),
  ];

  const filteredUpdates = roads?.filter((update) => {
    const roadName = update?.road_name?.toLowerCase() ?? "";
    const roadCode = update?.unique_code?.toLowerCase() ?? "";

    const roadQ = roadQuery.toLowerCase();

    const matchesRoad =
      !roadQ || roadName.includes(roadQ) || roadCode.includes(roadQ);
    if (roadQuery === "") return true;
    return matchesRoad;
  });

  const navigate = useNavigate();

  const userType = localStorage.getItem("user_type");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate("/UpdateRoad", { state: { id } });
  };

  const handleDelete = async (id) => {
    const road = roads.find((r) => r.id === Number(id));

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the road "${road?.name}"?\n\nThis action cannot be undone!`
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

      await deleteRoad(id, payload);
      setRoads((prevRoads) => prevRoads.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const response = await getRoads();
        setRoads(response);
      } catch (err) {
        setError("Failed to fetch roads");
      } finally {
        setLoading(false);
      }
    };

    fetchRoads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredFinalUpdates = filteredUpdates.filter((update) => {
    let districtMatch = true;
    let stateMatch = true;
    let areaMatch = true;
    let categoryMatch = true;
    let materialMatch = true;
    let roadTypeMatch = true;
    let locationMatch = true;
    let wardMatch = true;

    if (districtFilter && districtFilter !== "All State") {
      districtMatch = update.district === districtFilter;
    }

    if (stateFilter && stateFilter !== "All State") {
      stateMatch = update.state === stateFilter;
    }
    if (areaFilter && areaFilter !== "All Area") {
      areaMatch = update.area_name === areaFilter;
    }

    if (roadCategoryFilter && roadCategoryFilter !== "All Categories") {
      categoryMatch = update.road_category === roadCategoryFilter;
    }

    if (materialTypeFilter && materialTypeFilter !== "All Materials") {
      materialMatch = update.material_type === materialTypeFilter;
    }

    if (roadTypeFilter && roadTypeFilter !== "All Road Types") {
      roadTypeMatch = update.road_type === roadTypeFilter;
    }

    if (locationFilter && locationFilter !== "All Locations") {
      locationMatch = update.location === locationFilter;
    }

    if (wardFilter && wardFilter !== "All Wards") {
      wardMatch = update.ward_number === wardFilter;
    }

    if (widthFilter && widthFilter !== "All") {
      const width = update?.width_m ?? 0;

      if (widthFilter === "0-10" && !(width >= 0 && width <= 10)) {
        return false;
      }
      if (widthFilter === "10-50" && !(width > 10 && width <= 50)) {
        return false;
      }
      if (widthFilter === "50-100" && !(width > 50 && width <= 100)) {
        return false;
      }
      if (widthFilter === "100+" && !(width > 100)) {
        return false;
      }
    }

    if (lengthFilter && lengthFilter !== "All") {
      const length = update?.length_km ?? 0;

      if (lengthFilter === "0-100" && !(length >= 0 && length <= 100)) {
        return false;
      }
      if (lengthFilter === "100-500" && !(length > 100 && length <= 500)) {
        return false;
      }
      if (lengthFilter === "500-1000" && !(length > 500 && length <= 1000)) {
        return false;
      }
      if (lengthFilter === "1000-5000" && !(length > 1000 && length <= 5000)) {
        return false;
      }
      if (lengthFilter === "5000+" && !(length > 5000)) {
        return false;
      }
    }

    return (
      districtMatch &&
      stateMatch &&
      areaMatch &&
      categoryMatch &&
      materialMatch &&
      roadTypeMatch &&
      locationMatch &&
      wardMatch
    );
  });

  const districtOptions = [
    { value: "All State", label: "All State" },
    ...Array.from(new Set(roads.map((r) => r.district))).map((d) => ({
      value: d,
      label: d,
    })),
  ];

  const stateOptions = [
    { value: "All State", label: "All State" },
    ...Array.from(new Set(roads.map((r) => r.state))).map((s) => ({
      value: s,
      label: s,
    })),
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    setDistrictFilter(option.value);
    setAnchorEl(null);
  };

  const handleDownload = () => {
    if (!filteredFinalUpdates || filteredFinalUpdates.length === 0) {
      alert("No road data available to download");
      return;
    }

    // Prepare data for Excel
    const data = filteredFinalUpdates.map((road, idx) => ({
      "S. No.": idx + 1,
      "Road Number": road.unique_code,
      "Road Name": road.road_name,
      "Ward Number": road.ward_number,
      Location: road.location,
      "Length (m)": road.length_km,
      "Width (m)": road.width_m,
      "Road Type": road.road_type,
      "Material Type": road.material_type,
      "Road Category": road.road_category,
      Area: road.area_name,
      District: road.district,
      State: road.state,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Road Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(dataBlob, "RoadData.xlsx");
  };

  const paginatedUpdates =
    rowsPerPage > 0
      ? filteredFinalUpdates.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : filteredFinalUpdates;

  return (
    <div>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h1 style={{ color: "#333" }}>All Roads</h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "1rem 0",
          width: "100%",
        }}
      >
        {/* Empty spacer to push search to center */}
        <div style={{ width: "25%" }}></div>

        {/* Centered Search Input */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <TextField
            type="text"
            placeholder="Search by Road Name or Number"
            value={roadQuery}
            style={{
              borderRadius: "20px",
              width: "60%",
              backgroundColor: "#cccc",
              color: "#000",
            }}
            onChange={(e) => setRoadQuery(e.target.value)}
          />
        </div>

        {/* Rightmost Download Button */}
        <div
          style={{ width: "25%", display: "flex", justifyContent: "flex-end" }}
        >
          <button
            onClick={handleDownload}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "0.8rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "25px",
            }}
          >
            Download Road Data
          </button>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S. No.</TableCell>
                <TableCell align="center">Road Number</TableCell>
                <TableCell align="center">Road Name</TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Ward Number
                  <IconButton
                    size="small"
                    onClick={(e) => setWardAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={wardAnchorEl}
                    open={Boolean(wardAnchorEl)}
                    onClose={() => setWardAnchorEl(null)}
                  >
                    {wardOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setWardFilter(option.value);
                          setWardAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Location
                  <IconButton
                    size="small"
                    onClick={(e) => setLocationAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={locationAnchorEl}
                    open={Boolean(locationAnchorEl)}
                    onClose={() => setLocationAnchorEl(null)}
                  >
                    {locationOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setLocationFilter(option.value);
                          setLocationAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  {lengthFilter ? `Length (m): ${lengthFilter}` : "Length (m)"}
                  <IconButton
                    size="small"
                    onClick={(e) => setLengthAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={lengthAnchorEl}
                    open={Boolean(lengthAnchorEl)}
                    onClose={() => setLengthAnchorEl(null)}
                  >
                    {lengthOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setLengthFilter(option.value);
                          setLengthAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  {widthFilter ? `Width (m): ${widthFilter}` : "Width (m)"}
                  <IconButton
                    size="small"
                    onClick={(e) => setWidthAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={widthAnchorEl}
                    open={Boolean(widthAnchorEl)}
                    onClose={() => setWidthAnchorEl(null)}
                  >
                    {widthOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setWidthFilter(option.value);
                          setWidthAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Road Type
                  <IconButton
                    size="small"
                    onClick={(e) => setRoadTypeAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={roadTypeAnchorEl}
                    open={Boolean(roadTypeAnchorEl)}
                    onClose={() => setRoadTypeAnchorEl(null)}
                  >
                    {roadTypeOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setRoadTypeFilter(option.value);
                          setRoadTypeAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Material Type
                  <IconButton
                    size="small"
                    onClick={(e) => setMaterialTypeAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={materialTypeAnchorEl}
                    open={Boolean(materialTypeAnchorEl)}
                    onClose={() => setMaterialTypeAnchorEl(null)}
                  >
                    {materialTypeOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setMaterialTypeFilter(option.value);
                          setMaterialTypeAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Road Category
                  <IconButton
                    size="small"
                    onClick={(e) => setRoadCategoryAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={roadCategoryAnchorEl}
                    open={Boolean(roadCategoryAnchorEl)}
                    onClose={() => setRoadCategoryAnchorEl(null)}
                  >
                    {roadCategoryOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setRoadCategoryFilter(option.value);
                          setRoadCategoryAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  Area
                  <IconButton
                    size="small"
                    onClick={(e) => setAreaAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={areaAnchorEl}
                    open={Boolean(areaAnchorEl)}
                    onClose={() => setAreaAnchorEl(null)}
                  >
                    {areaOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setAreaFilter(option.value);
                          setAreaAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  District
                  <IconButton size="small" onClick={handleMenuClick}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {districtOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                <TableCell
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  align="center"
                >
                  State
                  <IconButton
                    size="small"
                    onClick={(e) => setStateAnchorEl(e.currentTarget)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={stateAnchorEl}
                    open={Boolean(stateAnchorEl)}
                    onClose={() => setStateAnchorEl(null)}
                  >
                    {stateOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setStateFilter(option.value);
                          setStateAnchorEl(null);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

                {userType === "JE" && (
                  <TableCell align="center">Update Details</TableCell>
                )}
                {userType === "JE" && (
                  <TableCell align="center">Delete</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUpdates?.length > 0 ? (
                paginatedUpdates.map((update, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={update.id}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{update.unique_code}</TableCell>
                    <TableCell align="center">{update.road_name}</TableCell>
                    <TableCell align="center">{update.ward_number}</TableCell>
                    <TableCell align="center">{update.location}</TableCell>
                    <TableCell align="center">{update.length_km}</TableCell>
                    <TableCell align="center">{update.width_m}</TableCell>
                    <TableCell align="center">{update.road_type}</TableCell>
                    <TableCell align="center">{update.material_type}</TableCell>
                    <TableCell align="center">{update.road_category}</TableCell>
                    <TableCell align="center">{update.area_name}</TableCell>
                    <TableCell align="center">{update.district}</TableCell>
                    <TableCell align="center">{update.state}</TableCell>
                    {userType === "JE" && (
                      <TableCell align="center">
                        <button onClick={() => handleEdit(update.id)}>
                          Edit
                        </button>
                      </TableCell>
                    )}
                    {userType === "JE" && (
                      <TableCell align="center">
                        <button
                          style={{ backgroundColor: "#e74c3c", color: "white" }}
                          onClick={() => handleDelete(update.id)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={7}>
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100, 500]}
          component="div"
          count={filteredFinalUpdates.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

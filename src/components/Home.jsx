import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from "./header";
import {
  getUpdates,
  getPendingRequests,
  getAllRoads,
  getContractors,
  logoutUser,
  fetchAuditReport,
} from "../api/api";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "react-datepicker/dist/react-datepicker.css";
import "../auditLog.css";
import { Refresh } from "@mui/icons-material";
import Button from "@mui/material/Button";

export default function Home() {
  const [roadQuery, setRoadQuery] = useState("");
  const [contractorQuery, setContractorQuery] = useState("");
  const [workQuery, setWorkQuery] = useState("");
  const [updates, setUpdates] = useState([]);
  const [page, setPage] = useState(0); // MUI is 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workCompletedRange, setWorkCompletedRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const userType = localStorage.getItem("user_type");
  const ranges = [
    { label: "All", value: "All" },
    { label: "0 - 30%", min: 0, max: 30 },
    { label: "31 - 60%", min: 31, max: 60 },
    { label: "61 - 90%", min: 61, max: 90 },
    { label: "91 - 100%", min: 91, max: 100 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ];

  const handleStatusMenuClick = (event) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusAnchorEl(null);
  };

  const handleStatusSelect = (option) => {
    setLoading(true);
    setStatusFilter(option.value);
    setStatusAnchorEl(null);
    setTimeout(() => setLoading(false), 300);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRangeSelect = (range) => {
    setLoading(true);
    setWorkCompletedRange(range);
    setAnchorEl(null);
    setTimeout(() => setLoading(false), 300);
  };

  const startDateOptions = [
    { value: "1m", label: "Starting within a month" },
    { value: "3m", label: "Starting within 3 months" },
    { value: "1y", label: "Starting within a year" },
    { value: "year", label: "Select a specific year" },
    { value: "all", label: "All" },
  ];
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [startDateAnchorEl, setStartDateAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearDialogOpen, setYearDialogOpen] = useState(false);

  const handleStartDateMenuClick = (event) => {
    setStartDateAnchorEl(event.currentTarget);
  };

  const handleStartDateMenuClose = () => {
    setStartDateAnchorEl(null);
  };

  const handleStartDateSelect = (option) => {
    setLoading(true);
    if (option.value === "year") {
      setYearDialogOpen(true);
    } else {
      setStartDateFilter(option.label);
    }
    setStartDateAnchorEl(null);
    setTimeout(() => setLoading(false), 300);
  };

  useEffect(() => {
    if (userType === "XEN") {
      getPendingRequests()
        .then((data) => {
          const pendingCount = data.filter(
            (req) => req.status === "Pending"
          ).length;
          setPendingCount(pendingCount);
        })
        .catch((err) => {
          console.error("Error fetching pending requests:", err);
        });
    }
  }, [userType]);

  useEffect(() => {
    if (userType === "JE") {
    }
  }, [userType]);
  useEffect(() => {
    if (userType === "CMC") {
    }
  }, [userType]);
  useEffect(() => {
    if (userType != "JE" && userType != "XEN" && userType != "CMC") {
    }
  }, [userType]);

  const loadUpdates = async (pageNumber = 1, pageSize = 10) => {
    setLoading(true);
    const finalSize = pageSize === -1 ? totalCount || 100000 : pageSize;

    try {
      const response = await getUpdates(pageNumber, finalSize);

      const roadObj = await getAllRoads();

      const contractorResponse = await getContractors();
      const contractorObj = contractorResponse.data;

      const enrichedData = response.data.map((update) => {
        const roadDetails = roadObj.find((road) => road.id === update.road);
        const contractorDetails = contractorObj.find(
          (c) => c.id === update.contractor
        );

        return {
          ...update,
          road: roadDetails || null,
          contractor: contractorDetails || null,
        };
      });

      const sortedData = enrichedData.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return 0;
      });

      setUpdates(sortedData);
      setTotalCount(response.data.length);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLoading(true);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (
      statusFilter?.toLowerCase() === "all" ||
      workCompletedRange?.value === "All"
    ) {
      loadUpdates(page + 1, rowsPerPage);
    }
  }, [statusFilter, workCompletedRange, page, rowsPerPage]);

  const filteredUpdates = updates?.filter((update) => {
    const roadName = update?.road?.road_name?.toLowerCase() ?? "";
    const roadCode = update?.road?.unique_code?.toLowerCase() ?? "";
    const contractorName =
      update?.contractor?.contractor_name?.toLowerCase() ?? "";
    const work = update?.description?.toLowerCase() ?? "";

    const roadQ = roadQuery.toLowerCase();
    const contractorQ = contractorQuery.toLowerCase();
    const workQ = workQuery.toLowerCase();

    const matchesRoad =
      !roadQ || roadName.includes(roadQ) || roadCode.includes(roadQ);

    const matchesContractor =
      !contractorQ || contractorName.includes(contractorQ);

    const matchesWork = !workQ || work.includes(workQ);

    return matchesRoad && matchesContractor && matchesWork;
  });

  const navigate = useNavigate();
  const timestamp = new Date().toLocaleString();

  const handleRowClick = (work) => {
    localStorage.setItem("currentWork", JSON.stringify(work)); // fallback

    navigate(`/road/${work.road.unique_code}`, { state: { work } });
  };

  const handleClick = (label) => {
    if (label === "Add New Road") {
      navigate("/NewRoad");
    } else if (label === "Add New Work") {
      navigate("/NewWork");
    } else if (label === "Add New Update") {
      navigate("/NewUpdate");
    } else if (label === "Add New User") {
      navigate("/NewUser");
    } else if (label === "Update Road Details") {
      navigate("/UpdateRoad");
    } else if (label === "Add New Contractor") {
      navigate("/NewContractor");
    } else if (label === "Update User Details") {
      navigate("/UpdateUser");
    } else if (label === "Update Contractor Details") {
      navigate("/UpdateContractor");
    } else {
      alert(`${label} clicked`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAudit = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      return;
    }
    try {
      setLoadingReport(true);
      const response = await fetchAuditReport(startDate, endDate);
      const logs = response.data;

      const rows = logs.map((item) => {
        return {
          ID: item.id,
          Action: item.action,
          Timestamp: new Date(item.timestamp).toLocaleString(),
          Performed_By:
            item.performed_by?.first_name +
              " " +
              item.performed_by?.last_name +
              " (" +
              item.performed_by?.user_type +
              ")" || "system",
          Old_Details:
            typeof item.old_details === "string"
              ? item.old_details
              : JSON.stringify(item.old_details),
          New_Details:
            typeof item.new_details === "string"
              ? item.new_details
              : JSON.stringify(item.new_details),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Report");

      XLSX.writeFile(workbook, "audit_report.xlsx");
    } catch (error) {
      console.error("Error fetching audit report:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const finalFilteredUpdates = filteredUpdates?.filter((update) => {
    if (statusFilter && statusFilter !== "All") {
      if (update.completedOrpending !== statusFilter) return false;
    }

    if (workCompletedRange) {
      const { min, max } = workCompletedRange;
      const percent = update?.progress_percent ?? 0;
      if (percent < min || (max !== undefined && percent > max)) {
        return false;
      }
    }

    if (startDateFilter && startDateFilter !== "All") {
      const today = new Date();
      const updateDate = new Date(update.start_date);

      let startRange;
      if (startDateFilter === "Starting within a month") {
        startRange = new Date(today);
        startRange.setDate(today.getDate() - 30);
        if (updateDate < startRange || updateDate > today) return false;
      } else if (startDateFilter === "Starting within 3 months") {
        startRange = new Date(today);
        startRange.setMonth(today.getMonth() - 3);
        if (updateDate < startRange || updateDate > today) return false;
      } else if (startDateFilter === "Starting within a year") {
        startRange = new Date(today);
        startRange.setFullYear(today.getFullYear() - 1);
        if (updateDate < startRange || updateDate > today) return false;
      } else if (startDateFilter === "Select a specific year" && selectedYear) {
        const updateDate = new Date(update.start_date);
        if (updateDate.getFullYear() !== selectedYear.getFullYear()) {
          return false;
        }
      } else if (selectedYear) {
        const updateDate = new Date(update.start_date);
        if (updateDate.getFullYear() !== selectedYear.getFullYear()) {
          return false;
        }
      }
    }

    return true;
  });

  const paginatedUpdates =
    rowsPerPage > 0
      ? finalFilteredUpdates.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : finalFilteredUpdates;

  return (
    <>
      <Header />

      {userType === "CMC" && (
        <div
          style={{
            backgroundColor: "#f5f7fa",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ marginBottom: "1rem", fontWeight: "600", color: "#333" }}
          >
            Download Audit Report
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactDatePicker
              required
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              className="custom-date-picker"
            />

            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              className="custom-date-picker"
              required
            />

            <button
              onClick={() => handleAudit(startDate, endDate)}
              disabled={loadingReport || !startDate || !endDate}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {loadingReport ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>
      )}

      {userType === "XEN" && (
        <div
          style={{
            margin: "1rem auto",
            padding: "1rem",
            maxWidth: "1000px",
            background: "#f0f0f0",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#000" }}>
            There are currently <strong>{pendingCount}</strong> pending work
            requests from other departments.{" "}
            <a
              href="/pendingRequests"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              Click here
            </a>{" "}
            to review them.
          </p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
          margin: "1rem 0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Road Name or Number"
          value={roadQuery}
          style={{
            padding: "0.8rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: isMobile ? "85%" : "20%",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
          onChange={(e) => setRoadQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Select by Work Name"
          value={workQuery}
          style={{
            padding: "0.8rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: isMobile ? "85%" : "20%",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
          onChange={(e) => setWorkQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Contractor Name"
          value={contractorQuery}
          style={{
            padding: "0.8rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: isMobile ? "85%" : "20%",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
          onChange={(e) => setContractorQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell align="center">S. No.</TableCell>
                  <TableCell align="center">Road Number</TableCell>
                  <TableCell align="center">Road Name</TableCell>
                  <TableCell align="center">Work</TableCell>
                  <TableCell align="center">Contractor</TableCell>
                  <TableCell align="center">
                    {startDateFilter ? startDateFilter : "Start Date"}
                    <IconButton size="small" onClick={handleStartDateMenuClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                    <Menu
                      anchorEl={startDateAnchorEl}
                      open={Boolean(startDateAnchorEl)}
                      onClose={handleStartDateMenuClose}
                    >
                      {startDateOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          onClick={() => handleStartDateSelect(option)}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>

                  <TableCell align="center">
                    {statusFilter ? statusFilter : "Status"}
                    <IconButton size="small" onClick={handleStatusMenuClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                    <Menu
                      anchorEl={statusAnchorEl}
                      open={Boolean(statusAnchorEl)}
                      onClose={handleStatusMenuClose}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          onClick={() => handleStatusSelect(option)}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>

                  <TableCell align="center">
                    {workCompletedRange
                      ? workCompletedRange.label
                      : "Work Completed (%)"}
                    <IconButton size="small" onClick={handleMenuClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {ranges.map((range) => (
                        <MenuItem
                          key={range.label}
                          onClick={() => handleRangeSelect(range)}
                        >
                          {range.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
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
                      onClick={() => handleRowClick(update)}
                    >
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {update.road?.unique_code}
                      </TableCell>
                      <TableCell align="center">
                        {update.road?.road_name}
                      </TableCell>
                      <TableCell align="center">{update.description}</TableCell>
                      <TableCell align="center">
                        {update.contractor?.contractor_name}
                      </TableCell>
                      <TableCell align="center">{update.start_date}</TableCell>
                      <TableCell align="center">
                        {update.completedOrpending}
                      </TableCell>
                      <TableCell align="center">
                        {update.progress_percent}%
                      </TableCell>
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={finalFilteredUpdates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Dialog open={yearDialogOpen} onClose={() => setYearDialogOpen(false)}>
        <DialogTitle>Select Year</DialogTitle>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={["year"]}
            openTo="year"
            value={selectedYear}
            onChange={(newValue) => setSelectedYear(newValue)}
            slotProps={{
              textField: { variant: "outlined", fullWidth: true },
            }}
          />
        </LocalizationProvider>

        <DialogActions>
          <Button
            onClick={() => {
              if (selectedYear) {
                setStartDateFilter("Select a specific year");
              }
              setYearDialogOpen(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {finalFilteredUpdates.map((u) => (
        <div key={u.id}>{u.name}</div>
      ))}
    </>
  );
}

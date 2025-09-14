import React, { useEffect, useState } from "react";
import {
  getPendingRequests,
  getOtherRequests,
  getRoads,
  updateRequestStatus,
  getLoginUser,
} from "../../api/api";
import Header from "../header";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

export default function PendingRequest() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [road, setRoad] = useState([]);
  const [otherRoad, setOtherRoad] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = () => {
    Promise.all([getPendingRequests(), getOtherRequests(), getRoads()])
      .then(([pending, other, roads]) => {
        const mapRequests = (data) =>
          data
            .map((req) => {
              const roadObj = roads.find((r) => r.id === req.road);
              return { ...req, road: roadObj || req.road };
            })
            .sort((a, b) => {
              if (a.status === "Pending" && b.status !== "Pending") return -1;
              if (a.status !== "Pending" && b.status === "Pending") return 1;
              return new Date(b.submitted_at) - new Date(a.submitted_at);
            });

        setPendingRequests(mapRequests(pending));
        setOtherRequests(mapRequests(other));
        setRoad(roads);
        setOtherRoad(roads);
      })
      .catch((err) => console.error("Failed to fetch data", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionChange = (id, value) =>
    setSelectedActions((prev) => ({ ...prev, [id]: value }));

  const handleUpdateStatus = async (id) => {
    const status = selectedActions[id];
    if (!status) return alert("Please select a status first.");

    const userFirstName = localStorage.getItem("userFirstName");
    const userLastName = localStorage.getItem("userLastName");
    const user_type = localStorage.getItem("user_type");
    const response_by = `${userFirstName} ${userLastName} (${user_type})`;
    const response_date = new Date().toISOString().split("T")[0];
    const loginUserId = localStorage.getItem("id");
    const login_user = await getLoginUser(loginUserId);

    updateRequestStatus(id, { status, response_by, response_date, login_user })
      .then(() => fetchData())
      .catch((err) => console.error("Failed to update status", err));
  };

  const renderPdfButton = (url) =>
    url ? (
      <Button
        variant="contained"
        size="small"
        sx={{ textTransform: "none" }}
        onClick={() => window.open(url, "_blank")}
      >
        View PDF
      </Button>
    ) : (
      "No Description"
    );

  return (
    <>
      <Header />
      <Box sx={{ p: 1, fontFamily: "Arial, sans-serif" }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={600}
          mb={2}
          color="#000"
        >
          Other Department Work Requests (Pending) :-
        </Typography>

        <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "S.No",
                    "Date",
                    "Department Name",
                    "Road",
                    "Work Description",
                    "Requested By",
                    "Contact Info",
                    "Detail Description (PDF)",
                    "Action",
                    "Update",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                      
                      sx={{ fontWeight: 600 }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{ fontStyle: "italic" }}
                    >
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((req, idx) => (
                    <TableRow key={req.id} hover>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center">
                        {req.submitted_at.split("T")[0]}
                      </TableCell>
                      <TableCell align="center">
                        {req.department_name}
                      </TableCell>
                      <TableCell align="center">
                        {road.find((r) => r.id === req.road.id)
                          ? `${req.road.unique_code} - ${req.road.road_name}`
                          : "No details"}
                      </TableCell>
                      <TableCell align="center">
                        {req.work_description}{" "}
                      </TableCell>
                      <TableCell align="center">{req.requested_by}</TableCell>
                      <TableCell align="center">{req.contact_info}</TableCell>
                      <TableCell align="center">
                        {renderPdfButton(req.pdfDescription)}
                      </TableCell>
                      <TableCell align="center">
                        <Select
                          size="small"
                          value={selectedActions[req.id] || ""}
                          onChange={(e) =>
                            handleActionChange(req.id, e.target.value)
                          }
                          displayEmpty
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="Approved">Approve</MenuItem>
                          <MenuItem value="Rejected">Reject</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            textTransform: "none",
                          }}
                          onClick={() => handleUpdateStatus(req.id)}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={600}
          mb={2}
          color="#000"
        >
          Past Requests :-
        </Typography>

        <Paper sx={{ width: "100%", overflow: "hidden"}}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "S.No",
                    "Date",
                    "Department Name",
                    "Road Unique Code",
                    "Work Description",
                    "Requested By",
                    "Contact Info",
                    "Status",
                    "Response By",
                    "Response Date",
                    "PDF Description",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={{ fontWeight: 600 }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {otherRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      align="center"
                      sx={{ fontStyle: "italic" }}
                    >
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  otherRequests.map((req, idx) => (
                    <TableRow key={req.id} hover>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center">
                        {req.submitted_at.split("T")[0]}
                      </TableCell>
                      <TableCell align="center">
                        {req.department_name}
                      </TableCell>
                      <TableCell align="center">
                        {otherRoad.find((r) => r.id === req.road.id)
                          ? `${req.road.unique_code} - ${req.road.road_name}`
                          : "No details"}
                      </TableCell>
                      <TableCell align="center">
                        {req.work_description}
                      </TableCell>
                      <TableCell align="center">{req.requested_by}</TableCell>
                      <TableCell align="center">{req.contact_info}</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: req.status === "Pending" ? 700 : 400,
                        }}
                      >
                        {req.status}
                      </TableCell>
                      <TableCell align="center">{req.response_by}</TableCell>
                      <TableCell align="center">
                        {req.response_date?.split("T")[0] || ""}
                      </TableCell>
                      <TableCell align="center">
                        {renderPdfButton(req.pdfDescription)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}

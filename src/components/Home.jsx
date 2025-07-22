import React, { useEffect, useState } from "react";
import Header from "./header";
import { getUpdates, getPendingRequests } from "../api/api";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function Home() {
  const [roadQuery, setRoadQuery] = useState("");
  const [contractorQuery, setContractorQuery] = useState("");
  const [updates, setUpdates] = useState([]);
  const [page, setPage] = useState(0); // MUI is 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    if (userType === "XEN") {
      console.log("Fetching pending requests count for XEN...");
      getPendingRequests()
        .then((data) => {
          console.log("Fetched requests:", data);
          const pendingCount = data.filter(
            (req) => req.status === "Pending"
          ).length;
          console.log("Pending requests count:", pendingCount);
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

  const loadUpdates = async (pageNumber = 1, pageSize = 10) => {
    const finalSize = pageSize === -1 ? totalCount || 100000 : pageSize;
    console.log(
      `[${new Date().toLocaleTimeString()}] Fetching page=${pageNumber}, pageSize=${finalSize}`
    );

    try {
      const response = await getUpdates(pageNumber, finalSize);
      const sortedData = response.data.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
      });

      setUpdates(sortedData);
      setTotalCount(response.data.length);
    } catch (error) {}
  };

  useEffect(() => {
    console.log(
      `useEffect triggered → page=${page + 1}, rowsPerPage=${rowsPerPage}`
    );
    loadUpdates(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredUpdates = updates?.filter((update) => {
    const roadName = update?.road?.road_name?.toLowerCase() ?? "";
    const roadCode = update?.road?.unique_code?.toLowerCase() ?? "";
    const contractorName =
      update?.contractor?.contractor_name?.toLowerCase() ?? "";

    const roadQ = roadQuery.toLowerCase();
    const contractorQ = contractorQuery.toLowerCase();

    const matchesRoad =
      !roadQ || roadName.includes(roadQ) || roadCode.includes(roadQ);

    const matchesContractor =
      !contractorQ || contractorName.includes(contractorQ);

    return matchesRoad && matchesContractor;
  });

  const navigate = useNavigate();
  const timestamp = new Date().toLocaleString();
  console.log(`Clicked at ${timestamp}`);

  const handleRowClick = (work) => {
    localStorage.setItem("currentWork", JSON.stringify(work)); // fallback
    console.log(
      `[${timestamp}] Row clicked → road=${work.road.unique_code}, contractor=${work.contractor.contractor_name}`
    );
    navigate(`/road/${work.road.unique_code}`, { state: { work } });
  };

  const handleClick = (label) => {
    if (label === "Add New Road") {
      navigate("/NewRoad");
    } 
    else if(label === "Add New Work") {
      navigate("/NewWork");
    }
    else if(label === "Add New Update") {
      navigate("/NewUpdate");
    }
    else if(label === "Add New User") {
      navigate("/NewUser");
    }
    else if(label === "Add New Work") {
      navigate("/NewWork");
    }
    
    else {
      alert(`${label} clicked`);
    }
  };
  return (
    <>
      <Header />
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
      {userType === "JE" && (
        <div
          style={{
            margin: "1rem auto",
            paddingleft: "0.5rem",
            maxWidth: "1500px",
            background: "#f9f9f9",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {[
              "Add New Road",
              "Add New Work",
              "Add New Update",
              "Add New User",
              "Update Road Details",
              "Add New Contractor",
              "Update User Details",
              "Update Contractor Details",
            ].map((label) => (
              <button
                key={label}
                style={{
                  padding: "0.3rem 0.5rem",
                  borderRadius: "20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "140px",
                  flex: "1 1 150px",
                  fontSize: "0.9rem",
                  transition: "background 0.3s",
                }}
                onClick={() => handleClick(label)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#45a049")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
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
            width: "20%",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
          onChange={(e) => setRoadQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Contractor Name"
          value={contractorQuery}
          style={{
            padding: "0.8rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: "20%",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
          onChange={(e) => setContractorQuery(e.target.value)}
        />
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S. No.</TableCell>
                <TableCell align="center">Road Number</TableCell>
                <TableCell align="center">Road Name</TableCell>
                <TableCell align="center">Work</TableCell>
                <TableCell align="center">Contractor</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">Status</TableCell>

                <TableCell align="center">Work Completed (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUpdates?.length > 0 ? (
                filteredUpdates.map((update, index) => (
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
                      {update.road.unique_code}
                    </TableCell>
                    <TableCell align="center">
                      {update.road.road_name}
                    </TableCell>
                    <TableCell align="center">{update.description}</TableCell>
                    <TableCell align="center">
                      {update.contractor.contractor_name}
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
          rowsPerPageOptions={[10, 25, 100, { label: "All", value: -1 }]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

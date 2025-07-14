import React, { useEffect, useState } from "react";
import Header from "./header";
import { getUpdates } from "../api/api";

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
  const [filteredUpdates, setFilteredUpdates] = useState([]);

  useEffect(() => {
    loadUpdates();
  }, []);

  useEffect(() => {
    const roadQ = roadQuery.toLowerCase();
    const contractorQ = contractorQuery.toLowerCase();

    const filtered = updates.filter((update) => {
      const roadName = update?.work?.road?.road_name ?? "";
      const roadCode = update?.work?.road?.unique_code ?? "";
      const contractorName = update?.work?.contractor?.contractor_name ?? "";

      const matchesRoad =
        !roadQ ||
        roadName.toLowerCase().includes(roadQ) ||
        roadCode.toLowerCase().includes(roadQ);

      const matchesContractor =
        !contractorQ || contractorName.toLowerCase().includes(contractorQ);

      return matchesRoad && matchesContractor;
    });

    setFilteredUpdates(filtered);
  }, [roadQuery, contractorQuery, updates]);

  const loadUpdates = async () => {
    try {
      const response = await getUpdates();
      console.log("Updates data:", response.data);
      console.log("data length:", response.data.length);
      setUpdates(response.data);
      setFilteredUpdates(response.data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const columns = [
    { id: "sno.", label: "S.No.", minWidth: 20 },
    { id: "roadNumber", label: "Road Unique Number", minWidth: 100 },
    { id: "roadName", label: "Road Name", minWidth: 100 },
    { id: "work", label: "Work", minWidth: 100 },
    {
      id: "contractor",
      label: "Contractor",
      minWidth: 100,
      align: "right",
    },
    {
      id: "startDate",
      label: "Start Date",
      minWidth: 100,
      align: "right",
    },
    {
      id: "WorkCompleted",
      label: "Work Completed",
      minWidth: 100,
      align: "right",
    },
  ];

  const rows =
    filteredUpdates.length > 0
      ? filteredUpdates.map((update, index) => ({
          sno: index + 1,
          roadNumber: update.work.road.unique_code,
          roadName: update.work.road.road_name,
          work: update.work.description,
          contractor: update.work.contractor.contractor_name,
          startDate: update.work.start_date,
          WorkCompleted: `${update.progress_percent}%`,
        }))
      : [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Header />

      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0"}}>
        <input
          type="text"
          placeholder="Search by Road Name or Number"
          value={roadQuery}
          onChange={(e) => setRoadQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Contractor Name"
          value={contractorQuery}
          onChange={(e) => setContractorQuery(e.target.value)}
        />
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S. No.</TableCell>
                <TableCell align="center">Road Number</TableCell>
                <TableCell align="center">Road Name</TableCell>
                <TableCell align="center">Work</TableCell>
                <TableCell align="center">Contractor</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">Work Completed (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUpdates.length > 0 ? (
                filteredUpdates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((update, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={update.id}
                    >
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {update.work.road.unique_code}
                      </TableCell>
                      <TableCell align="center">
                        {update.work.road.road_name}
                      </TableCell>
                      <TableCell align="center">
                        {update.work.description}
                      </TableCell>
                      <TableCell align="center">
                        {update.work.contractor.contractor_name}
                      </TableCell>
                      <TableCell align="center">
                        {update.work.start_date}
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
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={filteredUpdates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

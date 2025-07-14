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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadUpdates();
  }, []);


  useEffect(() => {
    loadUpdates(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  
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

  
  const loadUpdates = async (pageNumber = 1, pageSize = 100) => {
  try {
    const finalSize = pageSize === -1 ? totalCount : pageSize;
    const response = await getUpdates(pageNumber, finalSize);
    setUpdates(response.data.results);
    setFilteredUpdates(response.data.results);
    setTotalCount(response.data.count);
  } catch (error) {
    console.error("Error fetching updates:", error);
  }
};

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

      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0", itemsAlign: "center", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search by Road Name or Number"
          value={roadQuery}
          style={{padding: "0.8rem", borderRadius: "20px", border: "1px solid #ccc", width: "20%", backgroundColor: "#f9f9f9", color: "#000"}}
          onChange={(e) => setRoadQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Contractor Name"
          value={contractorQuery}
          style={{padding: "0.8rem", borderRadius: "20px", border: "1px solid #ccc", width: "20%", backgroundColor: "#f9f9f9", color: "#000"}}
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
          rowsPerPageOptions={[10, 25, 100, 200, { label: "All", value: -1 }]}
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

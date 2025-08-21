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

export default function ViewAllRoads() {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalCount = roads.length;
  const [roadQuery, setRoadQuery] = useState("");

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
  console.log("userTpye --------------", userType);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    console.log("Edit road with ID:", id);
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
      console.log("---------loginUser------", loginUser);

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
        console.log("------- Roads Fetched -------", response);
        setRoads(response);
        console.log("First road :------------------", response[0]);
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

  return (
    <div>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h1 style={{ color: "#333" }}>All Roads</h1>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1rem 0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          type="text"
          placeholder="Search by Road Name or Number"
          value={roadQuery}
          style={{
            borderRadius: "20px",
            width: "20%",
            backgroundColor: "#cccc",
            color: "#000",
          }}
          onChange={(e) => setRoadQuery(e.target.value)}
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
                <TableCell align="center">Ward Number</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Length (km)</TableCell>
                <TableCell align="center">Width (m)</TableCell>
                <TableCell align="center">Road type</TableCell>

                <TableCell align="center">Material type</TableCell>
                <TableCell align="center">Road category</TableCell>
                <TableCell align="center">Area name</TableCell>
                <TableCell align="center">District</TableCell>
                <TableCell align="center">State</TableCell>
                {userType === "JE" && (
                  <TableCell align="center">Update Details</TableCell>
                )}
                <TableCell align="center">Delete</TableCell>
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
          rowsPerPageOptions={[10, 25, 100, { label: "All", value: -1 }]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

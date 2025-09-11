import React, { use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {
  getUpdatesByWork,
  getCommentsByWork,
  addComment,
  getLoginUser,
  getUsers,
  deleteComment,
} from "../api/api";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function RoadDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allUpdates, setAllUpdates] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const [allUsers, setAllUsers] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // load from state or fallback to localStorage
  let work = location.state?.work;
  if (!work) {
    const saved = localStorage.getItem("currentWork");
    if (saved) {
      work = JSON.parse(saved);
    }
  }

  if (!work) return <h2>No work details found. Please go back.</h2>;

  const {
    road,
    contractor,
    start_date,
    description,
    cost,
    completedOrpending,
    defect_liability_period,
  } = work;

  const AllUpdates = async (id) => {
    try {
      const response = await getUpdatesByWork(id);
      setAllUpdates(response.data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const AllComments = async (id) => {
    try {
      const response = await getCommentsByWork(id);
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (work?.id) {
      AllUpdates(work.id);
    }
  }, [work]);

  useEffect(() => {
    if (work?.id) {
      AllComments(work.id);
    }
  }, [work]);
  const progressPercent = allUpdates[0]?.progress_percent ?? 0;

  let bgColor = "#f8e5b0";
  if (progressPercent === 0) {
    bgColor = "#f8b0b0";
  } else if (progressPercent === 100) {
    bgColor = "#b0f8b0";
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found. Please log in.");
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const latestUpdate = allUpdates[0];
    if (!latestUpdate) {
      alert("No update available to associate this comment with.");
      return;
    }

    try {
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      setCurrentUser(loginUser);

      const payload = {
        login_user: loginUser,
        infra_work: work.id,
        update: latestUpdate.id,
        commenter: loginUserId,
        comment_text: commentText,
      };

      await addComment(payload);

      setCommentText("");

      // Refresh comments
      AllComments(work.id);
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete comment ?\n\nThis action cannot be undone!`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const loginUserId = localStorage.getItem("id");

      const loginUser = await getLoginUser(loginUserId);
      setCurrentUser(loginUser);

      // Call delete API
      await deleteComment(commentId, { login_user: loginUser });

      // Refresh comments after delete
      AllComments(work.id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginUserId = localStorage.getItem("id");
    if (loginUserId) {
      getLoginUser(loginUserId).then(setCurrentUser);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await getUsers();
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.7)",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          textAlign: "center",
          padding: "10px 0",
          color: "#333",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 700,
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "1px",
            position: "relative",
            display: "inline-block",
          }}
        >
          Work Detail
        </h1>
      </div>

      <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "0.5rem",
            paddingTop: "0rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Info Grid */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              color: "#333",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <p>
                <b>Road Number:</b> {road.unique_code}
              </p>
              <p>
                <b>Road Name:</b> {road.road_name}
              </p>
              <p>
                <b>Material Used:</b> {road.material_type}
              </p>
              <p>
                <b>Road Type:</b> {road.road_type}
              </p>
              <p>
                <b>Road Category:</b> {road.road_category}
              </p>
              <p>
                <b>Length:</b> {road.length_km} KM
              </p>
              <p>
                <b>Width:</b> {road.width_m} M
              </p>
              <p>
                <b>Ward Number:</b> {road.ward_number}
              </p>
              <p>
                <b>Location:</b> {road.location}
              </p>
            </div>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <p>
                <b>Contractor Firm:</b> {contractor?.contractor_name}
              </p>
              <p>
                <b>Name:</b> {contractor?.contact_person}
              </p>
              <p>
                <b>Mobile:</b> {contractor?.contact_number}
              </p>
              <p>
                <b>Email:</b> {contractor?.email}
              </p>
              <p>
                <b>Address:</b> {contractor?.address}
              </p>
              <p>
                <div style={{display:"flex", flexDirection:"row"}}>
          <b>Defect Liability Period : </b> <div style={{fontWeight: "bold", fontSize : "1.1rem", marginLeft:"0.5rem"}}> {defect_liability_period} months</div>
          </div>
              </p>
            </div>

            <div style={{ flex: "1", textAlign: "center", minWidth: "200px" }}>
              <p>
                <b>Start Date:</b> {start_date}
              </p>
              <p>
                <b>Status :</b> {completedOrpending}
              </p>
              <p>
                <b>Cost:</b> ₹{cost ?? "40,000"}
              </p>

              <div
                style={{
                  height: "130px",
                  width: "130px",
                  borderRadius: "50%",
                  background: bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "1rem auto",
                }}
              >
                {/* {progress_percent}% */}
                {allUpdates[0]?.progress_percent}%
              </div>
            </div>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #000" }} />
          {/* Work Updates Table */}
          <div style={{ marginBottom: "2rem" }}>
            <h3>Update of Work</h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  ...tableStyle,
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>S. No.</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Progress Percentage</th>
                    <th style={thStyle}>Short Description</th>
                    <th style={thStyle}>Image</th>
                    <th style={thStyle}>Description(PDF)</th>
                  </tr>
                </thead>
                <tbody>
                  {allUpdates.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={tdStyleCenter}>
                        No updates available on this road.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {(showAllUpdates
                        ? allUpdates
                        : allUpdates.slice(0, 2)
                      ).map((update, index) => (
                        <tr key={update.id}>
                          <td style={tdStyle}>{index + 1}</td>
                          <td style={tdStyle}>{update.update_date}</td>
                          <td style={tdStyle}>{update.progress_percent}%</td>
                          <td style={tdStyle}>{update.status_note}</td>
                          <td style={tdStyle}>
                            {update.image ? (
                              <button
                                style={{
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(update.image_url, "_blank")
                                }
                              >
                                Preview
                              </button>
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td style={tdStyle}>
                            {update.pdf_url ? (
                              <button
                                style={{
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(update.pdf_url, "_blank")
                                }
                              >
                                View PDF
                              </button>
                            ) : (
                              "No Description available"
                            )}
                          </td>
                        </tr>
                      ))}

                      {allUpdates.length > 2 && !showAllUpdates && (
                        <tr>
                          <td colSpan={6} style={tdStyleCenter}>
                            <span
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                              }}
                              onClick={() => setShowAllUpdates(true)}
                            >
                              See all ⬇
                            </span>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comments Table */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {!isMobile ? <h3 style={{ margin: 0 }}>Comments</h3> : null}
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your comment..."
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleAddComment}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "120px",
                }}
              >
                Add Comment
              </button>
            </div>

            <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
              <TableContainer sx={{ maxHeight: "100%" }}>
                <Table stickyHeader aria-label="comments table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell align="center">S. No.</TableCell>
                      <TableCell align="center">Commentator</TableCell>
                      <TableCell align="center">Comment</TableCell>
                      <TableCell align="center">Progress Percentage</TableCell>
                      <TableCell align="center">
                        Work Update Description
                      </TableCell>
                      <TableCell align="center">Date when Commented</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {allComments?.length === 0 ? (
                      <TableRow>
                        <TableCell align="center" colSpan={7}>
                          No comments available on this road.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {(showAllComments
                          ? allComments
                          : allComments.slice(0, 5)
                        ).map((comment, index) => {
                          const update = allUpdates.find(
                            (u) => u.id === comment.update
                          );
                          const commenter = allUsers.find(
                            (u) => u.id === comment.commenter
                          );

                          return (
                            <TableRow
                              key={comment.id}
                              hover
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell align="center">{index + 1}</TableCell>

                              {comment.isActive ? (
                                <>
                                  <TableCell align="center">
                                    {commenter?.first_name}{" "}
                                    {commenter?.last_name} (
                                    {commenter?.user_type})
                                  </TableCell>
                                  <TableCell align="center">
                                    {comment.comment_text}
                                  </TableCell>
                                  <TableCell align="center">
                                    {update?.progress_percent ?? "N/A"}%
                                  </TableCell>
                                  <TableCell align="center">
                                    {update?.status_note ?? "N/A"}
                                  </TableCell>
                                  <TableCell align="center">
                                    {comment.comment_date ?? "N/A"}
                                  </TableCell>
                                  <TableCell align="center">
                                    {commenter?.id === currentUser?.id && (
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                      >
                                        Delete
                                      </span>
                                    )}
                                  </TableCell>
                                </>
                              ) : (
                                <TableCell align="center" colSpan={6}>
                                  This comment was deleted by commenter or
                                  administrator.
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}

                        {!showAllComments && allComments.length > 5 && (
                          <TableRow>
                            <TableCell align="center" colSpan={7}>
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                                onClick={() => setShowAllComments(true)}
                              >
                                See all ⬇
                              </span>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </div>
    </>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  background: "#fefefe",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  background: "#eee",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};

const tdStyleCenter = {
  ...tdStyle,
  fontStyle: "italic",
  background: "#fafafa",
};

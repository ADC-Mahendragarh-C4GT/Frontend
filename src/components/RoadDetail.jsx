import React, { use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import {
  getUpdatesByWork,
  getCommentsByWork,
  addComment,
  getLoginUser,
  getUsers,
  deleteComment,
} from "../api/api";
import { useState, useEffect } from "react";

export default function RoadDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allUpdates, setAllUpdates] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  console.log("work details:", work);

  const AllUpdates = async (id) => {
    try {
      const response = await getUpdatesByWork(id);
      console.log("Updates for work:", response.data);
      setAllUpdates(response.data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const AllComments = async (id) => {
    try {
      const response = await getCommentsByWork(id);
      console.log("Comments for work:", response.data);
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
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
  console.log("allUpdates:", allUpdates);
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
      console.log("---------loginUser------", loginUser);
      setCurrentUser(loginUser);

      const payload = {
        login_user: loginUser,
        infra_work: work.id,
        update: latestUpdate.id,
        commenter: loginUserId,
        comment_text: commentText,
      };

      await addComment(payload);

      console.log("Comment added");
      setCommentText("");

      // Refresh comments
      AllComments(work.id);
    } catch (err) {
      console.error("Failed to add comment:", err);
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
    console.log("---------loginUser------", loginUser);
    setCurrentUser(loginUser);

    // Call delete API
    await deleteComment(commentId, { login_user: loginUser });

    console.log("Comment deleted");

    // Refresh comments after delete
    AllComments(work.id);
  } catch (err) {
    console.error("Failed to delete comment:", err);
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
      console.log("All users:", response.data);
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "2rem",
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
              marginBottom: "2rem",
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
                <b>Defect Liability Period:</b> {defect_liability_period} months
              </p>
            </div>

            <div style={{ flex: "1", textAlign: "center", minWidth: "200px" }}>
              <p>
                <b>Start Date:</b> {start_date}
              </p>
              <p>
                <b>Complete or Pending:</b> {completedOrpending}
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

          {/* Work Updates Table */}
          <div style={{ marginBottom: "2rem" }}>
            <h3>Update of Work</h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  ...tableStyle,
                  width: "100%",
                  borderCollapse: "collapse",
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
              <h3 style={{ margin: 0 }}>Comments</h3>
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

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>S. No.</th>
                  <th style={thStyle}>Commentator</th>
                  <th style={thStyle}>Comment</th>
                  <th style={thStyle}>Progress Percentage</th>
                  <th style={thStyle}>Work Update Description</th>
                  <th style={thStyle}>Date when Commented</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allComments?.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={tdStyleCenter}>
                      No comments available on this road.
                    </td>
                  </tr>
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
                        <tr key={comment.id}>
                          <td style={tdStyle}>{index + 1}</td>

                          {comment.isActive ? (
                            <>
                              <td style={tdStyle}>
                                {commenter?.first_name} {commenter?.last_name} (
                                {commenter?.user_type})
                              </td>
                              <td style={tdStyle}>{comment.comment_text}</td>
                              <td style={tdStyle}>
                                {update?.progress_percent ?? "N/A"}%
                              </td>
                              <td style={tdStyle}>
                                {update?.status_note ?? "N/A"}
                              </td>
                              <td style={tdStyle}>
                                {comment.comment_date ?? "N/A"}
                              </td>
                              <td style={tdStyle}>
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
                              </td>
                            </>
                          ) : (
                            <td colSpan={6} style={tdStyleCenter}>
                              This comment was deleted by commenter or
                              administrator.
                            </td>
                          )}
                        </tr>
                      );
                    })}

                    {allComments.length > 5 && !showAllComments && (
                      <tr>
                        <td colSpan={7} style={tdStyleCenter}>
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
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
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

import React, { useEffect, useState } from "react";
import {
  getPendingRequests,
  getOtherRequests,
  getRoads,
  updateRequestStatus,
} from "../../api/api";
import Header from "../header";

export default function PendingRequest() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [road, setRoad] = useState([]);
  const [otherRoad, setOtherRoad] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});

  const fetchData = () => {
    Promise.all([getPendingRequests(), getOtherRequests(), getRoads()])
      .then(([pending, other, roads]) => {
        const pendingWithRoads = pending
          .map((req) => {
            const roadObj = roads.find((r) => r.id === req.road);
            return { ...req, road: roadObj || req.road };
          })
          .sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
            return new Date(b.submitted_at) - new Date(a.submitted_at);
          });

        const otherWithRoads = other
          .map((req) => {
            const roadObj = roads.find((r) => r.id === req.road);
            return { ...req, road: roadObj || req.road };
          })
          .sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
            return new Date(b.submitted_at) - new Date(a.submitted_at);
          });

        setPendingRequests(pendingWithRoads);
        setOtherRequests(otherWithRoads);
        setRoad(roads);
        setOtherRoad(roads);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("Fetching other department requests...");
  //   getOtherRequests()
  //     .then((res) => {
  //       console.log("Fetched requests:", res);

  //       const sorted = [...res].sort((a, b) => {
  //         // Step 1: Pending first
  //         if (a.status === "Pending" && b.status !== "Pending") return -1;
  //         if (a.status !== "Pending" && b.status === "Pending") return 1;

  //         // Step 2: Newest submitted_at first
  //         const dateA = new Date(a.submitted_at);
  //         const dateB = new Date(b.submitted_at);

  //         return dateB - dateA; // newest first
  //       });

  //       setOtherRequests(sorted);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch requests", err);
  //     });
  // }, []);

  const handleActionChange = (id, value) => {
    setSelectedActions((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = (id) => {
    const status = selectedActions[id];
    const userFirstName = localStorage.getItem("userFirstName");
    const userLastName = localStorage.getItem("userLastName");
    const user_type = localStorage.getItem("user_type");
    const response_by =
      userFirstName + " " + userLastName + " " + "(" + user_type + ")";
    const response_date = new Date().toISOString().split("T")[0];
    if (!status) {
      alert("Please select a status first.");
      return;
    }

    updateRequestStatus(id, { status, response_by, response_date })
      .then(() => {
        console.log("-------Status-----------------", status);
        fetchData(); // refresh both tables from backend
      })
      .catch((err) => {
        console.error("Failed to update status", err);
      });
  };

  console.log("-----------", otherRequests);

  return (
    <>
      <Header />
      <div
        style={{
          padding: "1rem",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        <h2>Other Department Work Requests(Pending) :-</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>S. No.</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Department Name</th>
              <th style={thStyle}>Road </th>
              <th style={thStyle}>Work Description</th>
              <th style={thStyle}>Requested By</th>
              <th style={thStyle}>Contact Info</th>
              <th style={thStyle}>Detail Description (PDF)</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Update</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length === 0 ? (
              <tr>
                <td colSpan={10} style={tdStyleCenter}>
                  No requests found.
                </td>
              </tr>
            ) : (
              pendingRequests.map((req, index) => (
                <tr key={req.id}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{req.submitted_at.split("T")[0]}</td>
                  <td style={tdStyle}>{req.department_name}</td>
                  <td style={tdStyle}>
                    {(() => {
                      const matchedRoad = road.find(
                        (r) => r.id === req.road.id
                      );
                      return matchedRoad
                        ? `${matchedRoad.unique_code} - ${matchedRoad.road_name}`
                        : "No details found";
                    })()}
                  </td>
                  <td style={tdStyle}>{req.work_description}</td>
                  <td style={tdStyle}>{req.requested_by}</td>
                  <td style={tdStyle}>{req.contact_info}</td>
                  <td style={tdStyle}>
                    {req.pdfDescription ? (
                      <button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(req.pdfDescription, "_blank")}
                      >
                        View PDF
                      </button>
                    ) : (
                      "No Description available"
                    )}
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={selectedActions[req.id] || ""}
                      onChange={(e) =>
                        handleActionChange(req.id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Approved">Approve</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleUpdateStatus(req.id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br />
        <h2>Past Requests :-</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>S. No.</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Department Name</th>
              <th style={thStyle}>Road Unique Code</th>
              <th style={thStyle}>Work Description</th>
              <th style={thStyle}>Requested By</th>
              <th style={thStyle}>Contact Info</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Response by</th>
              <th style={thStyle}>Response Date</th>
            </tr>
          </thead>
          <tbody>
            {otherRequests.length === 0 ? (
              <tr>
                <td colSpan={10} style={tdStyleCenter}>
                  No requests found.
                </td>
              </tr>
            ) : (
              otherRequests.map((req, index) => (
                <tr key={req.id}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{req.submitted_at.split("T")[0]}</td>
                  <td style={tdStyle}>{req.department_name}</td>
                  <td style={tdStyle}>
                    {(() => {
                      const matchedRoad = otherRoad.find(
                        (r) => r.id === req.road.id
                      );
                      return matchedRoad
                        ? `${matchedRoad.unique_code} - ${matchedRoad.road_name}`
                        : "No details found";
                    })()}
                  </td>
                  <td style={tdStyle}>{req.work_description}</td>
                  <td style={tdStyle}>{req.requested_by}</td>
                  <td style={tdStyle}>{req.contact_info}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: req.status === "Pending" ? "bold" : "normal",
                    }}
                  >
                    {req.status}
                  </td>
                  <td style={tdStyle}>{req.response_by}</td>
                  <td style={tdStyle}>
                    {req.response_date?.split("T")[0] || ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Styles
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

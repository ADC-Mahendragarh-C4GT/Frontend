import React, { useEffect, useState } from "react";
import Header from "./header";
import { getUpdates } from "../api/api";

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

    const filtered = updates.filter(update => {
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
      setUpdates(response.data);
      setFilteredUpdates(response.data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  return (
    <>
      <Header />

      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
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

      <div
        className="table-responsive w-full"
        style={{ color: "black", fontFamily: "Arial" }}
      >
        <table className="table-fixed border-collapse w-full">
          <thead>
            <tr className="bg-blue-200 text-white">
              <th className="text-center border-2 border-black p-2">S. No.</th>
              <th className="text-center border-2 border-black p-2">Road Number</th>
              <th className="text-center border-2 border-black p-2">Road Name</th>
              <th className="text-center border-2 border-black p-2">Work</th>
              <th className="text-center border-2 border-black p-2">Contractor</th>
              <th className="text-center border-2 border-black p-2">Start Date</th>
              <th className="text-center border-2 border-black p-2">
                Work Completed(%)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUpdates.length > 0 ? (
              filteredUpdates.map((update, index) => (
                <tr key={update.id}>
                  <td className="text-center border-2 border-black p-2">{index + 1}</td>
                  <td className="text-center border-2 border-black p-2">
                    {update.work.road.unique_code}
                  </td>
                  <td className="text-center border-2 border-black p-2">
                    {update.work.road.road_name}
                  </td>
                  <td className="text-center border-2 border-black p-2">
                    {update.work.description}
                  </td>
                  <td className="text-center border-2 border-black p-2">
                    {update.work.contractor.contractor_name}
                  </td>
                  <td className="text-center border-2 border-black p-2">
                    {update.work.start_date}
                  </td>
                  <td className="text-center border-2 border-black p-2 ">
                    {update.progress_percent}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border-2 border-black p-2"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

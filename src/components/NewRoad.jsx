import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitOtherDepartmentRequest, getRoads } from "../api/api";
import { display, justifyContent } from "@mui/system";

export default function NewRoad() {

  return (
    <h2 style={{ color: "#000000" }}>Request Work on road(Other Department)</h2>
  );
}

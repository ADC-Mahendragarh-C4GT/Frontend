import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// @ts-ignore
import Login from './components/Login';
// @ts-ignore
import Home from "./components/Home";
// @ts-ignore
import RoadDetail from "./components/RoadDetail";
// @ts-ignore
import OtherDepartmentForm from './components/OtherDepartmentForm';
// @ts-ignore
import PendingRequest from './components/Executive Engineer/PendingRequest';
// @ts-ignore
import NewRoad from './components/JuniorEngineer/NewRoad';
// @ts-ignore
import NewWork from './components/JuniorEngineer/NewWork';
// @ts-ignore
import NewUpdate from './components/JuniorEngineer/NewUpdate';
// @ts-ignore
import NewUser from './components/JuniorEngineer/NewUser';
// @ts-ignore
import NewContractor from './components/JuniorEngineer/NewContractor';
// @ts-ignore
import UpdateRoad from './components/JuniorEngineer/UpdateRoad';
// @ts-ignore
import UpdateUser from './components/JuniorEngineer/UpdateUser';
// @ts-ignore
import UpdateContractor from './components/JuniorEngineer/UpdateContractor';
// @ts-ignore
import ViewAllRoads from './components/ViewAllRoads';
// @ts-ignore
import ResetPassword from './components/ResetPassword';
// @ts-ignore
import ForgetPassword from './components/ForgetPassword';
import axios from 'axios';

const token = localStorage.getItem("access_token");
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/road/:id" element={<RoadDetail />} />
        <Route path="/OtherDepartmentForm" element={<OtherDepartmentForm />} />
        <Route path="/pendingRequests" element={<PendingRequest/>} />
        <Route path="/NewRoad" element={<NewRoad/>} />
        <Route path="/NewWork" element={<NewWork/>} />
        <Route path="/NewUpdate" element={<NewUpdate/>} />
        <Route path="/NewUser" element={<NewUser/>} />
        <Route path="/NewContractor" element={<NewContractor/>} />
        <Route path="/UpdateRoad" element={<UpdateRoad/>} />
        <Route path="/UpdateUser" element={<UpdateUser/>} />
        <Route path="/UpdateContractor" element={<UpdateContractor/>} />
        <Route path="/view-all-roads" element={<ViewAllRoads/>} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path = "/ForgetPassword" element = {<ForgetPassword/>}/>
      </Routes>
    </Router>
  );
}

export default App;

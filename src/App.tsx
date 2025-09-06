import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Home from "./components/home";
import RoadDetail from "./components/RoadDetail";
import OtherDepartmentForm from './components/OtherDepartmentForm';
import PendingRequest from './components/Executive Engineer/pendingRequest';
import NewRoad from './components/JuniorEngineer/NewRoad';
import NewWork from './components/JuniorEngineer/NewWork';
import NewUpdate from './components/JuniorEngineer/NewUpdate';
import NewUser from './components/JuniorEngineer/NewUser';
import NewContractor from './components/JuniorEngineer/NewContractor';
import UpdateRoad from './components/JuniorEngineer/UpdateRoad';
import UpdateUser from './components/JuniorEngineer/UpdateUser';
import UpdateContractor from './components/JuniorEngineer/UpdateContractor';
import ViewAllRoads from './components/ViewAllRoads';
import ResetPassword from './components/ResetPassword';
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

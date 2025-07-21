import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Home from "./components/home";
import RoadDetail from "./components/RoadDetail";
import OtherDepartmentForm from './components/OtherDepartmentForm';
import PendingRequest from './components/pendingRequest';


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
      </Routes>
    </Router>
  );
}

export default App;

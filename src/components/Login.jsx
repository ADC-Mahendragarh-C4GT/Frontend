import React, { useState, useEffect } from "react";
import { login, fetchUserType } from "../api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUserType()
      .then((res) => {
        setUserTypes(res.data);
        if (!res.data.length) setUserType("");
      })
      .catch(() => setError("Failed to load user types"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password, userType);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_type", response.data.user_type);
      localStorage.setItem("userFirstName", response.data.userFirstName);
      localStorage.setItem("userLastName", response.data.userLastName);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("email", response.data.email);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

      setError("");
      setTimeout(() => window.location.reload(), 1000);
      navigate("/home");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isMobile ? (
    // Mobile View (Modern, gradient style)
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Roboto', sans-serif",
        overflow: "hidden",
        background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/images/HaryanaGov.png') center/contain no-repeat",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
      }}
    >
      <Box
        sx={{
          width: "90%",
          p: 3,
          borderRadius: 3,
          background: "rgba(255,255,255,0.6)",
          textAlign: "center",
        }}
      >
        
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, color: "#2c3e50" }}>
          Welcome To
        </h2>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: 2,
            background: "linear-gradient(90deg, #ff512f, #dd2476)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin:0,
          }}
        >
          Suvidha Manch
        </h1>
        <p style={{ fontSize: 18, marginBottom: 25, color: "#555" }}>Please enter your credentials</p>

        <form onSubmit={handleSubmit}>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
            style={{ width: "100%", padding: 14, fontSize: 18, marginBottom: 20, borderRadius: 8, border: "1px solid #ccc" }}
          >
            <option value="" disabled>
              ⬇ Select Your Post ⬇
            </option>
            {userTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: "100%", padding: 14, marginBottom: 20, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: "100%", padding: 14, marginBottom: 20, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
          <div style={{ textAlign: "right", marginBottom: 15 }}>
            <a href="/ForgetPassword" style={{ fontSize: 16, color: "#007bff" }}>Forgot Password?</a>
          </div>
          <button type="submit"
            style={{ width: "100%", padding: 14, background: "linear-gradient(90deg, #007bff, #00aaff)", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontSize: 18, fontWeight: 600 }}>
            Log In
          </button>
          <p style={{ textAlign: "center", margin: "1em 0 0.5em 0", fontWeight: "bold", fontSize: 18, color: "#555" }}>OR</p>
          <p style={{ textAlign: "center", fontSize: 16, color: "#555" }}>
            If you are from another department and want to request work, then <a href="/OtherDepartmentForm" style={{ color: "#007bff" }}>click here</a>
          </p>
          {error && <p style={{ color: "red", marginTop: 10, fontSize: 16 }}>{error}</p>}
        </form>
      </Box>
    </Box>
  ) : (
    // Desktop View (Minimal, side-by-side card)
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        margin: 0,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", maxWidth: 800, width: "100%", boxShadow: "0 0 10px rgba(248, 246, 246, 0.1)" }}>
        <div style={{ flex: 1, textAlign: "center", padding: 40 }}>
          <img src="/images/HaryanaGov.png" alt="Govt of Haryana" style={{ maxWidth: "100%" }} />
          <h2 style={{ color: "#272727", fontSize: "30px" }}>Municipal Corporation Rohtak</h2>
        </div>
        <div style={{ flex: 1, padding: 40, color: "#272727", fontFamily: "Aileron" }}>
          <h2 style={{ fontSize: "26px", margin: "0.2em 0" }}>Welcome To</h2>
          <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: 2,
            background: "linear-gradient(90deg, #ff512f, #dd2476)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin:0,
          }}
        >Suvidha Manch</h1>
          <p style={{ margin: "0.2em 0", fontSize: "16px" }}>Please enter your details</p>

          <form onSubmit={handleSubmit}>
            <div style={{ width: "60%", padding: 10, border: "none", margin: "0 auto" }}>
              <select value={userType} onChange={(e) => setUserType(e.target.value)} style={{ width: "100%", padding: 10 }} required>
                <option value="" disabled>⬇ Select Your Post ⬇</option>
                {userTypes.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
              </select>
            </div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: "100%", padding: 10, marginBottom: 20, borderBottom: "2.5px solid #272727", borderTop: "none", borderLeft: "none", borderRight: "none", background: "white", fontSize: "16px", color: "#000" }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: "100%", padding: 10, marginBottom: 20, borderBottom: "2.5px solid #272727", borderTop: "none", borderLeft: "none", borderRight: "none", background: "white", fontSize: "16px", color: "#000" }} />
            <div style={{ textAlign: "right", marginBottom: 10 }}>
              <a href="/ForgetPassword"><small>Forgot Password?</small></a>
            </div>
            <button type="submit" style={{ width: "100%", padding: 10, background: "#000", color: "#fff", border: "none", cursor: "pointer", borderRadius: 20 }}>Log In</button>
            <br />
            <p style={{ margin: "0.5em 0", fontSize: "16px", fontWeight: "bold" }}>OR</p>
            <p style={{ margin: "0.4em 0", fontSize: "16px" }}>If you are from other department and want to request for work, then <a href="/OtherDepartmentForm">click here</a></p>
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

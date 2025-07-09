import React, { useState, useEffect } from "react";
import { login, fetchUserTypes } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserTypes()
      .then((res) => {
        setUserTypes(res.data);
        if (res.data.length) {
          setUserType(res.data[0].value); // default to first
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user types");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password, userType);
      console.log(response.data);
      setError(""); 
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <div style={{ display: "flex", maxWidth: 800, width: "100%", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <div style={{ flex: 1, textAlign: "center", padding: 20 }}>
          <img src="/haryana-logo.png" alt="Govt of Haryana" style={{ maxWidth: "100%" }} />
          <h2>Municipal Corporation Rohtak</h2>
        </div>

        <div style={{ flex: 1, padding: 40 }}>
          <h2>Welcome again!</h2>
          <p>Please enter your details</p>

          <form onSubmit={handleSubmit}>
            <div>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={{ width: "100%", padding: 10, marginBottom: 20 }}
              >
                {userTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email/username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 10, marginBottom: 20, borderBottom: "1px solid #ccc", border: "none", borderBottomStyle: "solid" }}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 10, marginBottom: 10, borderBottom: "1px solid #ccc", border: "none", borderBottomStyle: "solid" }}
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <small>Forgot Password?</small>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 10,
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: 20,
              }}
            >
              Log In
            </button>

            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

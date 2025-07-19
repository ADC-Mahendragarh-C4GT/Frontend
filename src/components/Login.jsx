import React, { useState, useEffect } from "react";
import { login, fetchUserTypes } from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTypes()
      .then((res) => {
        setUserTypes(res.data);
        if (res.data.length) {
          setUserType("");
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
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      setError("");

      // Redirect to homepage
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
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
      <div
        style={{
          display: "flex",
          maxWidth: 800,
          width: "100%",
          boxShadow: "0 0 10px rgba(248, 246, 246, 0.1)",
        }}
      >
        <div style={{ flex: 1, textAlign: "center", padding: 40 }}>
          <img
            src="/images/HaryanaGov.png"
            alt="Govt of Haryana"
            style={{ maxWidth: "100%" }}
          />
          <h2 style={{ color: "#272727", fontSize: "30px" }}>
            Municipal Corporation Rohtak
          </h2>
        </div>

        <div
          style={{
            flex: 1,
            padding: 40,
            color: "#272727",
            fontFamily: "Aileron",
          }}
        >
          <h2 style={{ fontSize: "26px", margin: "0.2em 0" }}>
            Welcome again!
          </h2>
          <p style={{ margin: "0.2em 0", fontSize: "16px" }}>
            Please enter your details
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                width: "60%",
                padding: 10,
                border: "none",
                margin: "0 auto",
              }}
            >
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={{ width: "100%", padding: 10 }}
                required
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
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginBottom: 20,
                  borderBottom: "2.5px solid #272727",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottomStyle: "solid",
                  background: "white",
                  fontSize: "16px",
                  color: "#000",
                }}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginBottom: 20,
                  borderBottom: "2.5px solid #272727",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottomStyle: "solid",
                  background: "white",
                  fontSize: "16px",
                  color: "#000",
                }}
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: 10 }}>
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
            <br />
            <p
              style={{
                margin: "0.5em 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              OR
            </p>
            <p style={{ margin: "0.4em 0", fontSize: "16px" }}>
              If you are from other department and want to request for work, then <a href="/other-department-form">click here</a>
            </p>
            
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { ForgetPassword } from "../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await ForgetPassword(email);
      let data = {};
      console.log("--------------res--------------------", res);
      try {
        data = await res.data;
      } catch {
        setMsg("Unexpected server response. Please try again later.");
        setLoading(false);
        return;
      }

      if (res.status === 200) {
        setMsg("Password reset link sent! Check your email.");
      } else {
        setMsg(data.error || "Failed to send reset link. Try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setMsg("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Forgot Password?</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {msg && <p style={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}

/* 🔹 Styles */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "1.2rem",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.8rem",
    marginBottom: "1.2rem",
    border: "1px solid #ccc",
    borderRadius: "0.6rem",
    fontSize: "1rem",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "0.8rem",
    background: "#007bff",
    color: "#fff",
    border: "1px solid #ccc",
    borderRadius: "0.6rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
  btnDisabled: {
    width: "100%",
    padding: "0.9rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "0.6rem",
    fontSize: "1rem",
    cursor: "not-allowed",
  },
  message: {
    marginTop: "1rem",
    fontSize: "0.95rem",
    color: "#444",
  },
};

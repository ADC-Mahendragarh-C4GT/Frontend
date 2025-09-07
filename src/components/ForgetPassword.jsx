import { useState } from "react";
import { ForgetPassword } from "../api/api";

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
      console.log("--------------res--------------------",res);
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
    background: "linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)",
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
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1.2rem",
    border: "1px solid #ccc",
    borderRadius: "0.6rem",
    fontSize: "1rem",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "0.9rem",
    background: "#ff4d6d",
    color: "#fff",
    border: "none",
    borderRadius: "0.6rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  btnDisabled: {
    width: "100%",
    padding: "0.9rem",
    background: "#aaa",
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

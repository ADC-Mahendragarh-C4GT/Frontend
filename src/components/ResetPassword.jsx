import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResetPassword } from "../api/api";

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if(password !== password2) {
        setMsg("Passwords do not match.");
        setLoading(false);
        setPassword("");
        setPassword2("");
        return;
      }
      const res = await ResetPassword(uid, token, password);
      let data = {};
      try {
        data = await res.data;
      } catch {
        setMsg("Unexpected server response. Please try again later.");
        setLoading(false);
        return;
      }

      if (res.status === 200) {
        setMsg(data.message || "Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        if (data.error?.toLowerCase().includes("expired")) {
          setMsg("Reset link has expired. Please request a new one.");
        } else if (data.error?.toLowerCase().includes("invalid")) {
          setMsg("Invalid reset link. Please request again.");
        } else {
          setMsg(data.error || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setMsg("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔒 Reset Your Password</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password2"
            placeholder="Confirm new password"
            style={styles.input}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button type="submit" style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {msg && <p style={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}

/* 🔹 Styles defined at bottom */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
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
    background: "#2575fc",
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

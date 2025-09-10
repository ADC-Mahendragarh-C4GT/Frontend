import { useEffect, useState } from "react";
import { logoutUser } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 w-full shadow"
      style={{
        display: "flex",
        margin: "0",
        padding: "0 15px",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)",
        height: "70px",
        borderBottom: "2px solid #dcdcdc",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="/home">
          <img
            src="/images/HaryanaGov.png"
            alt="Haryana Emblem"
            style={{
              display: "inline",
              height: "55px",
              width: "55px",
              marginRight: "12px",
            }}
          />
        </a>
        {!isMobile && (
          <div>
            <h1
              style={{
                margin: "0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Municipal Corporation Rohtak
            </h1>
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: "#555",
              }}
            >
              Government of Haryana
            </p>
          </div>
        )}
      </div>
      <a href="/home">
      <div
        style={{
          alignSelf: "center",
          alignItems: "center",
          fontSize: isMobile ? "20px" : "36px",
          fontWeight: "700",
          color: "#2c3e50",
          fontFamily: "Georgia, serif",
          letterSpacing: "2px",
          background: "linear-gradient(90deg, #ff512f, #dd2476)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Suvidha Manch
      </div>
      </a>

      {isMobile ? (
        <div style={{ position: "relative" }}>hi</div>
      ) : (
        <nav style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "14px",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Home
          </button>
          <button
          onClick={() => navigate("/view-all-roads")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "14px",
              color: "#333",
              cursor: "pointer",
            }}
          >
            All Roads
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "14px",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Departments
          </button>
          <button
            onClick={handleLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
            style={{
              backgroundColor: "red",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              color: "#fff",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}

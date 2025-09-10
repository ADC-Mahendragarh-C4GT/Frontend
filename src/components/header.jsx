import React from "react";
import { useEffect, useState } from "react";

import { logoutUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledMenu = styled((props) => (
  <Menu
    elevation={4}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    marginTop: theme.spacing(1.5),
    minWidth: 200,
    color: theme.palette.mode === "light" ? "#374151" : theme.palette.grey[300],
    boxShadow: "0px 4px 20px rgba(0,0,0,0.1), 0px 2px 10px rgba(0,0,0,0.06)",
    "& .MuiMenu-list": {
      padding: "6px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: "0.95rem",
      borderRadius: 8,
      margin: "2px 6px",
      padding: "10px 14px",
      transition: "all 0.2s ease-in-out",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        marginRight: theme.spacing(1.5),
        color: theme.palette.text.secondary,
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        transform: "scale(1.02)",
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    },
  },
}));

export default function Header() {
  const user = localStorage.getItem("user_type");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

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
          <>
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
              HOME
            </button>
            <button
              onClick={() => navigate("/view-all-roads")}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "14px",
                color: "#333",
                cursor: "pointer",
                fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
              }}
            >
              ALL ROADS
            </button>

            {(user === "JE" || user === "XEN" || user === "CMC") && (
              <>
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "14px",
                    color: "#333",
                    cursor: "pointer",
                    fontFamily:
                      "system-ui, Avenir, Helvetica, Arial, sans-serif",
                  }}
                >
                  ACTIONS
                </Button>

                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {user === "JE" && (
                    <>
                      <MenuItem onClick={() => handleNavigate("/profile")}>
                        <PersonIcon />
                        Profile
                      </MenuItem>

                      <MenuItem onClick={() => handleNavigate("/settings")}>
                        <SettingsIcon />
                        Settings
                      </MenuItem>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem onClick={() => handleNavigate("/edit")}>
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate("/duplicate")}>
                        <FileCopyIcon />
                        Duplicate
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate("/archive")}>
                        <ArchiveIcon />
                        Archive
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate("/more")}>
                        <MoreHorizIcon />
                        More
                      </MenuItem>
                    </>
                  )}
                  {user === "XEN" && (
                    <MenuItem onClick={() => handleNavigate("/profile")}>
                      <PersonIcon />
                      Profile
                    </MenuItem>
                  )}
                  {user === "CMC" && (
                    <MenuItem onClick={() => handleNavigate("/profile")}>
                      <PersonIcon />
                      Profile
                    </MenuItem>
                  )}
                </StyledMenu>
              </>
            )}

            <button
              onClick={handleLogout}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
              style={{
                fontFamily: "Inter, sans-serif",
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
          </>
        </nav>
      )}
    </header>
  );
}

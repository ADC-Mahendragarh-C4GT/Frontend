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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from '@mui/icons-material/Home';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';

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
  const [roadAnchorEl, setRoadAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [roadOpen, setRoadOpen] = useState(false);
  const [showRoadOptions, setShowRoadOptions] = useState(false);
  const [showContractorOptions, setShowContractorOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);

  const toggleWorkOptions = () => {
    setShowWorkOptions((prev) => !prev);
  };

  const toggleRoadOptions = () => {
    setShowRoadOptions((prev) => !prev);
  };
  const toggleContractorOptions = () => {
    setShowContractorOptions((prev) => !prev);
  };
  const toggleUserOptions = () => {
    setShowUserOptions((prev) => !prev);
  };

  const toggleRoadMenu = () => {
    setRoadOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleRoadClick = (event) => {
    setRoadAnchorEl(event.currentTarget);
  };

  const handleRoadClose = () => {
    setRoadAnchorEl(null);
  };

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
        <>
          <div>
            <Button
              id="mobile-menu-button"
              aria-controls={open ? "mobile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                minWidth: "auto",
                p: 1,
                color: "#333",
              }}
            >
              {open ? (
                <CloseIcon fontSize="large" />
              ) : (
                <MenuIcon fontSize="large" />
              )}
            </Button>

            <StyledMenu
              id="mobile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
          
            >
              <MenuItem onClick={() => handleNavigate("/home")}>
                  <HomeIcon />
                  Home
                </MenuItem>

              <MenuItem onClick={() => handleNavigate("/view-all-roads")}>
                  <AddRoadIcon />
                  View All Roads
                </MenuItem>

              {user === "JE" && (
                <>
                  <div>
                    <MenuItem onClick={toggleRoadOptions}>
                      <AddRoadIcon fontSize="small" />
                      Roads
                      {showRoadOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showRoadOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewRoad")}>
                          ➕ Create Road
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/UpdateRoad")}>
                          📝 Update Existing Road Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleWorkOptions}>
                      <ArchiveIcon fontSize="small" />
                      Works
                      {showWorkOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showWorkOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewWork")}>
                          ➕ Create New Work
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/NewUpdate")}>
                          📝 Add an Update of Existing Work
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleUserOptions}>
                      <PersonIcon fontSize="small" />
                      Users
                      {showUserOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showUserOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewUser")}>
                          ➕ Create New User
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/UpdateUser")}>
                          📝 Update Existing User Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleContractorOptions}>
                      <InterpreterModeIcon fontSize="small" />
                      Contractors
                      {showContractorOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showContractorOptions && (
                      <>
                        <MenuItem
                          onClick={() => handleNavigate("/NewContractor")}
                        >
                          ➕ Create New Contractor
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleNavigate("/UpdateContractor")}
                        >
                          📝 Update Existing Contractor Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}
                  </div>
                </>
              )}

              {user === "XEN" && (
                <MenuItem onClick={() => handleNavigate("/pendingRequests")}>
                  <PersonIcon />
                  Pending Request of Other Departments
                </MenuItem>
              )}

              {user === "CMC" && (
                <MenuItem onClick={() => handleNavigate("/home")}>
                  <PersonIcon />
                  Download Reports for Audit
                </MenuItem>
              )}

              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </StyledMenu>
          </div>
        </>
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
                  fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
                }}
              >
                ACTIONS
              </Button>

              <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {user === "JE" && (
                  <>
                    <MenuItem onClick={toggleRoadOptions}>
                      <AddRoadIcon fontSize="small" />
                      Roads
                      {showRoadOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showRoadOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewRoad")}>
                          ➕ Create Road
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/UpdateRoad")}>
                          📝 Update Existing Road Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleWorkOptions}>
                      <ArchiveIcon fontSize="small" />
                      Works
                      {showWorkOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showWorkOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewWork")}>
                          ➕ Create New Work
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/NewUpdate")}>
                          📝 Add an Update of Existing Work
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleUserOptions}>
                      <PersonIcon fontSize="small" />
                      Users
                      {showUserOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showUserOptions && (
                      <>
                        <MenuItem onClick={() => handleNavigate("/NewUser")}>
                          ➕ Create New User
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/UpdateUser")}>
                          📝 Update Existing User Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    <MenuItem onClick={toggleContractorOptions}>
                      <InterpreterModeIcon fontSize="small" />
                      Contractors
                      {showContractorOptions ? (
                        <KeyboardArrowDownIcon sx={{ marginLeft: "auto" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ marginLeft: "auto" }} />
                      )}
                    </MenuItem>

                    {showContractorOptions && (
                      <>
                        <MenuItem
                          onClick={() => handleNavigate("/NewContractor")}
                        >
                          ➕ Create New Contractor
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleNavigate("/UpdateContractor")}
                        >
                          📝 Update Existing Contractor Details
                        </MenuItem>
                        <Divider />
                      </>
                    )}
                  </>
                )}

                {user === "XEN" && (
                  <MenuItem onClick={() => handleNavigate("/pendingRequests")}>
                    <PersonIcon />
                    Pending Request of Other Departments
                  </MenuItem>
                )}

                {user === "CMC" && (
                  <MenuItem onClick={() => handleNavigate("/home")}>
                    <PersonIcon />
                    Download Reports for Audit
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
        </nav>
      )}
    </header>
  );
}

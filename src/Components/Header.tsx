import { useState } from "react";
import ecell from "../assets/Group 1.png";
import log from "../assets/logout.svg";

const Header = ({ isNormalUser }: { isNormalUser: boolean }) => {
  const [open, setOpen] = useState(false);

  const toggleDropDown = () => {
    setOpen((prev) => !prev);
  };

  // Logout functionality
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 0.5rem",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        position: "absolute",
        width: "100vw",
        top: "0",
        zIndex: 1000,
      }}
    >
      {/* Left Content */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img src={ecell} alt="Logo" style={{ width: "3.1rem", height: "auto" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3
            style={{
              margin: "0",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#000",
              textShadow: "0 0 7px #9dffc8",
            }}
          >
            InstiBus Tracker
          </h3>
          <p
            style={{
              margin: "0",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#888888",
            }}
          >
            IIT Madras
          </p>
        </div>
      </div>

      {/* Notification Bell and Logout Icon with Dropdown */}
      {!isNormalUser && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Logout Icon */}
          <div style={{ position: "relative" }}>
            {/* Dropdown Menu */}
            <div
              style={{
                position: "absolute",
                top: "2.1rem",
                left: "-5rem",
                backgroundColor: "#f2f2f2",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                borderRadius: "15px",
                zIndex: 10,
                padding: "1rem 0.5rem",
                display: open ? "block" : "none", // Show/hide dropdown based on `open`
                width: "6rem",
                textAlign: "center",
              }}
            >
              {/* Triangle Arrow */}
              <div
                style={{
                  position: "absolute",
                  top: "-0.5rem",
                  right: "8%",
                  transform: "translateX(-50%)",
                  width: "0",
                  height: "0",
                  borderLeft: "0.5rem solid transparent",
                  borderRight: "0.5rem solid transparent",
                  borderBottom: "0.5rem solid #f5f5f5", // Match dropdown background color
                  zIndex: 11,
                }}
              ></div>

              {/* Logout Text */}
              <div
                style={{
                  cursor: "pointer",
                  color: "#333",
                  fontSize: "1rem",
                }}
                onClick={logout}
              >
                Logout
              </div>
            </div>

            {/* Logout Icon */}
            <img
              src={log}
              alt="Logout Icon"
              style={{
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer", // Pointer cursor for interactivity
              }}
              onClick={toggleDropDown} // Toggle dropdown on click
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

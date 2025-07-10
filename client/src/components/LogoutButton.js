import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
      Logout
    </button>
  );
}

export default LogoutButton;

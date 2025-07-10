import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Navbar.css";

function Navbar({ role }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🗂️ Task Manager</div>
      <div className="navbar-links">
        {role === "admin" && (
          <>
            <Link to="/admin-dashboard">Dashboard</Link>
            <Link to="/upload">Upload</Link>
          </>
        )}
        {role === "agent" && (
          <Link to="/agent-dashboard">Dashboard</Link>
        )}
        <LogoutButton />
      </div>
    </nav>
  );
}

export default Navbar;

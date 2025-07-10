import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Task Assignment System | v1.0</p>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}

export default Footer;

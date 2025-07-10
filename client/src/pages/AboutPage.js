import React from "react";
import "../styles/Page.css";

function AboutPage() {
  return (
    <div className="page-container about-bg">
      <h2>About</h2>
      <p>
        This Task Assignment System is built using the MERN stack (MongoDB, Express.js,
        React, Node.js) and allows administrators to upload user data via CSV, assign tasks
        to agents, and monitor task statuses through a streamlined dashboard. The platform
        features role-based authentication, dynamic dashboards, status logs, analytics
        charts, and a modern responsive design.
      </p>
    </div>
  );
}

export default AboutPage;

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
    
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthorized(false);
      } else {
        setAuthorized(allowedRoles.includes(user.role));
      }
    } catch (error) {
      console.error("JWT decode error:", error);
      setAuthorized(false);
    }

    setLoading(false);
  }, [allowedRoles]);

  if (loading) return <div className="dashboard-container"><h2>⏳ Checking access...</h2></div>;

  return authorized ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

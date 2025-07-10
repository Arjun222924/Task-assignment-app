import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🚀 Submitting login:", { email, password, role });

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
        role, 
      });

      const { token, user } = res.data;

    
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

  
if (user.role === "admin") {
  navigate("/admin-dashboard");  
} else if (user.role === "agent") {
  navigate("/agent-dashboard");  
} else {
  setError("Unknown role. Cannot redirect.");
}

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or role. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title"> Role-Based Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="select-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
          <button className="submit-button" type="submit">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

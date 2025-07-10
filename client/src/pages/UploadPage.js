import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/UploadPage.css";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("❌ Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ File uploaded successfully");
      setUploadedUsers(response.data.users || []);
      setHistory((prev) => [
        ...prev,
        { fileName: file.name, time: new Date().toLocaleString() },
      ]);

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("❌ Upload failed");
    }
  };

  useEffect(() => {
    const fetchUploadedUsers = async () => {
      try {
        const res = await axios.get("/api/records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching uploaded users:", err);
      }
    };

    fetchUploadedUsers();
  }, [token]);

  return (
    <motion.div
      className="upload-page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <div className="logout-btn-wrapper">
      
      </div>

      <div className="upload-main-section">
        <div className="upload-left-section">
          <ThemeToggle />
          <h2 className="upload-page-title">📤 Upload CSV File</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="input-file"
            />
            <button type="submit" className="btn primary">
              Upload
            </button>
          </form>
          {message && (
            <p className={`upload-message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </div>

        <div className="upload-right-section">
          <div className="section">
            <h3>📋 Uploaded Users</h3>
            {uploadedUsers.length === 0 ? (
              <p>No uploaded users yet.</p>
            ) : (
              <ul className="task-list">
                {uploadedUsers.map((user) => (
                  <li key={user._id} className="task-item">
                    👤 {user.name} | 📧 {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section">
            <h3>📁 Upload History</h3>
            {history.length === 0 ? (
              <p>No upload history.</p>
            ) : (
              <ul className="task-list">
                {history.map((item, index) => (
                  <li key={index} className="task-item">
                    {item.fileName} — {item.time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="upload-footer-contact">
        <Footer />
      </div>
    </motion.div>
  );
}

export default UploadPage;

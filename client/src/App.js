import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UploadPage from "./pages/UploadPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/agent-dashboard"
            element={
              <PrivateRoute allowedRoles={["agent"]}>
                <AgentDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UploadPage />
              </PrivateRoute>
            }
          />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

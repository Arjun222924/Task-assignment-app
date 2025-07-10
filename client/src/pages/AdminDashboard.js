import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [csvUsers, setCsvUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCsvUser, setSelectedCsvUser] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [message, setMessage] = useState("");
  const [agentError, setAgentError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCsvUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCsvUsers(res.data);
    } catch (err) {
      console.error("Error fetching CSV users:", err);
    }
  }, [token]);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await axios.get("/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data);
      setAgentError("");
    } catch (err) {
      console.error("Error fetching agents:", err);
      setAgentError("❌ Failed to load agents");
    }
  }, [token]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchCsvUsers();
    fetchAgents();
    fetchTasks();
  }, [fetchCsvUsers, fetchAgents, fetchTasks]);

  const handleAssignTask = async () => {
    if (!selectedCsvUser || !selectedAgent) {
      return setMessage("⚠️ Please select both a CSV user and an agent.");
    }

    try {
      await axios.post(
        "/api/tasks/assign",
        { csvUserId: selectedCsvUser, agentId: selectedAgent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Task assigned successfully!");
      setSelectedCsvUser("");
      setSelectedAgent("");
      fetchTasks();
    } catch (err) {
      console.error("Error assigning task:", err);
      setMessage("❌ Failed to assign task.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setMessage("🗑️ Task deleted");
    } catch (err) {
      console.error("Error deleting task:", err);
      setMessage("❌ Failed to delete task.");
    }
  };

  const handleReassign = async (taskId, newAgentId) => {
    try {
      await axios.patch(
        `/api/tasks/${taskId}/reassign`,
        { agentId: newAgentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
      setMessage("🔁 Task reassigned");
    } catch (err) {
      console.error("Error reassigning task:", err);
      setMessage("❌ Failed to reassign task.");
    }
  };

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

  return (
    <motion.div
      className="admin-dashboard-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="dashboard-title">👨‍💼 Welcome, {user?.name} (Admin)</h2>

      <div className="top-actions">
        <LogoutButton />
        <ThemeToggle />
        <Link to="/upload">
          <button className="btn primary"> Upload CSV</button>
        </Link>
      </div>

      <div className="analytics">
        <div className="stat">👥 CSV Users: {csvUsers.length}</div>
        <div className="stat">🧑‍💻 Agents: {agents.length}</div>
        <div className="stat">📋 Tasks: {tasks.length}</div>
      </div>

      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No task data available for chart.</p>
      )}

      <h3> ASSIGN NEW TASK</h3>

      <div>
        <label>CSV User:</label>
        <select
          value={selectedCsvUser}
          onChange={(e) => setSelectedCsvUser(e.target.value)}
        >
          <option value="">-- Select --</option>
          {csvUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Agent:</label>
        {agentError && <p className="error">{agentError}</p>}
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="">-- Select --</option>
          {agents.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} ({a.email})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssignTask} className="btn success">
        ✅ Assign Task
      </button>

      {message && (
        <p className={message.includes("✅") ? "success" : "error"}>{message}</p>
      )}

      <h3> Assigned Tasks</h3>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <motion.li
            key={task._id}
            className="task-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <strong>{task.csvUser?.name}</strong> ({task.csvUser?.email})<br />
            Assigned to: <strong>{task.assignedTo?.name}</strong> ({task.assignedTo?.email})<br />
            Status: <strong>{task.status}</strong><br />

            <button onClick={() => handleDelete(task._id)} className="btn danger">
              🗑️
            </button>

            <select
              defaultValue=""
              onChange={(e) => handleReassign(task._id, e.target.value)}
            >
              <option value="" disabled>🔁 Reassign</option>
              {agents
                .filter((a) => a._id !== task.assignedTo?._id)
                .map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
            </select>

            <details>
              <summary> Status History</summary>
              <ul>
                {task.statusHistory?.map((entry, i) => (
                  <li key={i}>
                    {entry.status} — {new Date(entry.updatedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </details>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default AdminDashboard;

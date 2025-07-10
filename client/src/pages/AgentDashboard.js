import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/AgentDashboard.css";

const COLORS = ["#FFBB28", "#00C49F", "#0088FE"];

function AgentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get("/api/tasks/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error("❌ Error fetching agent tasks:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!token || !user || user.role !== "agent") {
    return <p className="agent-error">⛔ Unauthorized. Please log in as agent.</p>;
  }

  const updateTaskStatus = async (taskId, status) => {
    try {
      
      const formattedStatus = status === "in-progress" ? "in progress" : status;
      
      const response = await axios.patch(
        `/api/tasks/${taskId}/status`,
        { status: formattedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log(`Status update sent: ${formattedStatus} for task ${taskId}`);
      console.log("Server response:", response.data);
      
      
      await fetchTasks();
      setMessage(`✅ Task status updated to ${formattedStatus}`);
      
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      console.error("Error details:", err.response?.data || err.message);
      setMessage("❌ Failed to update task status: " + (err.response?.data?.message || err.message));
      
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const getStatusData = () => {
    const count = { pending: 0, "in progress": 0, completed: 0 };
    tasks.forEach((task) => {
      const status = task.status?.toLowerCase();
      if (status === "in-progress") {
        count["in progress"]++;
      } else if (count[status] !== undefined) {
        count[status]++;
      } else {
        
        count.pending++;
      }
    });

    return Object.entries(count).map(([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
    }));
  };

  return (
    <motion.div
      className="agent-dashboard-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="agent-content">
        <h2 className="agent-dashboard-title">🧑‍💻 Welcome, {user?.name} (Agent)</h2>

        <div className="agent-top-actions">
          <LogoutButton />
          <ThemeToggle />
        </div>

        <div className="agent-analytics">
          <div className="agent-stat">📋 My Tasks: {tasks.length}</div>
          <div className="agent-stat">
            ✅ Completed: {tasks.filter(t => t.status === "completed").length}
          </div>
          <div className="agent-stat">
            🔄 In Progress: {tasks.filter(t => t.status === "in-progress" || t.status === "in progress").length}
          </div>
        </div>

        <div className="agent-chart-section">
          <h3 className="agent-section-title">📊 Task Status Overview</h3>
          <div className="agent-chart-container">
            {getStatusData().length > 0 && tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="agent-error">No data to display in chart.</p>
            )}
          </div>
        </div>

        {message && (
          <p className={message.includes("✅") ? "agent-success" : "agent-error"}>{message}</p>
        )}

        <h3 className="agent-section-title">📋 My Assigned Tasks</h3>
        {tasks.length === 0 ? (
          <div className="agent-no-tasks">
            <p>No tasks assigned yet.</p>
          </div>
        ) : (
          <ul className="agent-task-list">
            {tasks.map((task, index) => (
              <motion.li
                key={task._id}
                className="agent-task-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <strong>{task.csvUser?.name || "Unknown"}</strong> ({task.csvUser?.email || "No email"})<br />
                Status: <strong>{task.status}</strong><br />

                <div className="agent-task-actions">
                  <button
                    onClick={() => updateTaskStatus(task._id, "in progress")}
                    className="agent-btn warning"
                    disabled={task.status === "in-progress" || task.status === "in progress"}
                  >
                    🔄 In Progress
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task._id, "completed")}
                    className="agent-btn success"
                    disabled={task.status === "completed"}
                  >
                    ✅ Complete
                  </button>
                </div>

                <details>
                  <summary>📜 Status History</summary>
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
        )}
      </div>
    </motion.div>
  );
}

export default AgentDashboard;

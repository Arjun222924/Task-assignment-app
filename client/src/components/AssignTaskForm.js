import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignTaskForm({ onTaskAssigned }) {
  const [agents, setAgents] = useState([]);
  const [csvUsers, setCsvUsers] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedCsvUser, setSelectedCsvUser] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [agentRes, csvRes] = await Promise.all([
          axios.get("/api/agents", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/records", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setAgents(agentRes.data);
        setCsvUsers(csvRes.data);
      } catch (error) {
        console.error("Error fetching agents or users:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/api/tasks",
        {
          assignedTo: selectedAgent,
          csvUser: selectedCsvUser,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Task assigned successfully");
      setSelectedAgent("");
      setSelectedCsvUser("");
      setStatus("pending");

      if (onTaskAssigned) onTaskAssigned(); 
    } catch (err) {
      console.error(" Error assigning task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Assign Task</h3>

      <label>Select CSV User:</label>
      <select
        value={selectedCsvUser}
        onChange={(e) => setSelectedCsvUser(e.target.value)}
        required
      >
        <option value="">-- Choose User --</option>
        {csvUsers.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <br />

      <label>Select Agent:</label>
      <select
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
        required
      >
        <option value="">-- Choose Agent --</option>
        {agents.map((agent) => (
          <option key={agent._id} value={agent._id}>
            {agent.name} ({agent.email})
          </option>
        ))}
      </select>
      <br />

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
      </select>
      <br />

      <button type="submit">Assign Task</button>
    </form>
  );
}

export default AssignTaskForm;

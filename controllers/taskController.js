const Task = require("../models/Task");
const CsvRecord = require("../models/CsvRecord");
const User = require("../models/User");

exports.assignTask = async (req, res) => {
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { csvUserId, agentId } = req.body;

  try {
    const csvUser = await CsvRecord.findById(csvUserId);
    const agent = await User.findById(agentId);

    if (!csvUser || !agent) {
      return res.status(404).json({ message: "CSV user or agent not found" });
    }

    const task = new Task({
      csvUser: csvUser._id,
      agent: agent._id,
    });

    await task.save();

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.error("❌ Task assignment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

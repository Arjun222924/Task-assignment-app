const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const CsvRecord = require("../models/CsvRecord");
const User = require("../models/User");
router.post("/assign", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  const { csvUserId, agentId } = req.body;

  try {
    const csvUser = await CsvRecord.findById(csvUserId);
    const agent = await User.findById(agentId);

    if (!csvUser || !agent || agent.role !== "agent") {
      return res.status(404).json({ message: "CSV user or agent not found" });
    }

    const newTask = new Task({
      csvUser: csvUserId,
      assignedTo: agentId,
      statusHistory: [{ status: "pending", updatedAt: new Date() }],
    });

    await newTask.save();
    res.status(201).json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error("❌ Error assigning task:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const tasks = await Task.find()
      .populate("csvUser")
      .populate("assignedTo");

    res.json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/agent", authMiddleware, async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ message: "Access denied. Agents only." });
  }

  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate("csvUser")
      .populate("assignedTo");

    res.json(tasks);
  } catch (error) {
    console.error("❌ Error fetching agent tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ message: "Access denied. Agents only." });
  }

  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const validStatuses = ["pending", "in progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const formattedStatus = status.toLowerCase();
    task.status = formattedStatus;
    task.statusHistory.push({ status: formattedStatus, updatedAt: new Date() });
    const updatedTask = await task.save();
    console.log(`Task ${id} updated to status: ${formattedStatus}`);
    res.json({ 
      message: "Task status updated successfully", 
      task: updatedTask 
    });
  } catch (error) {
    console.error("❌ Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/reassign", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  const { agentId } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Invalid agent" });
    }

    task.assignedTo = agentId;
    await task.save();

    res.json({ message: "Task reassigned successfully", task });
  } catch (error) {
    console.error("❌ Error reassigning task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

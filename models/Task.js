const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  csvUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CsvRecord",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);

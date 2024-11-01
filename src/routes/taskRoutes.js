const express = require("express");
const Task = require("../models/Task");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create Task
router.post("/createTask", authenticateUser, async (req, res) => {
  const { title, description, column, dueDate, reminder } = req.body;
  if (!title || !["todo", "inprogress", "completed"].includes(column)) {
    return res
      .status(400)
      .json({ error: "Title and valid column are required" });
  }

  try {
    const task = new Task({
      title,
      description,
      column,
      dueDate,
      reminder,
      createdBy: req.user.id,
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    console.log(req.params);
    const tasks = await Task.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;

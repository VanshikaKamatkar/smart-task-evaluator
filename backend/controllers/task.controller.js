import { evaluateWithGroq } from "../ai/evaluator.js";
import Task from "../models/Task.js";


export const createTask = async (req, res) => {
  try {
    const { taskDescription, code } = req.body;

    if (!taskDescription || !code) {
      return res.status(400).json({ message: "taskDescription and code are required." });
    }

    const newTask = await Task.create({
      userId: req.user._id,
      taskDescription: taskDescription.trim(),
      code,
      // aiScore, aiStrengths, aiImprovements, aiFullFeedback default to initial values
    });

    return res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ message: "Server error while creating task" });
  }
};


export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const skip = (page - 1) * limit;

    const [total, tasks] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (err) {
    console.error("getTasks error:", err);
    return res.status(500).json({ message: "Server error while fetching tasks" });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).select("-__v");

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error("getTaskById error:", err);
    // handle invalid ObjectId
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid task id" });
    }
    return res.status(500).json({ message: "Server error while fetching the task" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const { taskDescription, code } = req.body;

    if (taskDescription) updates.taskDescription = taskDescription.trim();
    if (code) updates.code = code;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Task.findByIdAndUpdate(id, { $set: updates }, { new: true }).select(
      "-__v"
    );

    return res.status(200).json({ message: "Task updated", task: updated });
  } catch (err) {
    console.error("updateTask error:", err);
    if (err.kind === "ObjectId") return res.status(400).json({ message: "Invalid task id" });
    return res.status(500).json({ message: "Server error while updating task" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    if (err.kind === "ObjectId") return res.status(400).json({ message: "Invalid task id" });
    return res.status(500).json({ message: "Server error while deleting task" });
  }
};

export const markTaskPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (task.isPaid) {
      return res.status(400).json({ message: "Task is already unlocked (paid)" });
    }

    task.isPaid = true;
    await task.save();

    return res.status(200).json({
      message: "Payment successful. Full report unlocked.",
      taskId: task._id,
      isPaid: true,
    });
  } catch (err) {
    console.error("markTaskPaid error:", err);
    return res.status(500).json({ message: "Failed to unlock report" });
  }
};


export const evaluateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Already evaluated & paid
    if (task.aiScore !== null) {
      return res.status(400).json({
        message: "Task already evaluated. You can re-run evaluation after reset."
      });
    }

    // Call Groq evaluator
    const evaluation = await evaluateWithGroq(
      task.taskDescription,
      task.code
    );

    // Save results in DB
    task.aiScore = evaluation.score;
    task.aiStrengths = evaluation.strengths;
    task.aiImprovements = evaluation.improvements;
    task.aiFullFeedback = evaluation.fullFeedback;

    await task.save();

    return res.status(200).json({
      message: "Task evaluated successfully",
      evaluation,
    });
  } catch (err) {
    console.error("evaluateTask error:", err);
    return res.status(500).json({
      message: "AI evaluation failed",
      error: err.message,
    });
  }
};
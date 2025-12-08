// routes/task.routes.js
import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskPaid,
  evaluateTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// Create a new task
// POST /api/tasks
router.post("/", createTask);

// Get paginated list of tasks
// GET /api/tasks?page=1&limit=10
router.get("/", getTasks);

// Create/Update/Remove specific task
// GET /api/tasks/:id
router.get("/:id", getTaskById);

// Update task
// PUT /api/tasks/:id
router.put("/:id", updateTask);

// Delete task
// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

// Mark as paid (fake payment)
// POST /api/tasks/:id/pay
router.post("/:id/pay", markTaskPaid);

// Trigger AI evaluation (stub for now)
// POST /api/tasks/:id/evaluate
router.post("/:id/evaluate", evaluateTask);

export default router;

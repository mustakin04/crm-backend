const express = require("express");

const router = express.Router();

const protect = require("../../middlewares/auth.middleware");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
  addComment,
  getComments,
  getActivityLogs,
  getDashboardStats,
  getPerformanceReport,
  getAllActivityLogs,
  getTaskHistory,
} = require("../../controller/task.controller");

// Create
router.post("/", protect, createTask);

// Static GET Routes (Always First)
router.get("/", protect, getAllTasks);

router.get("/my-tasks", protect, getMyTasks);
router.get("/history", protect, getTaskHistory);
router.get("/performance-report", protect, getPerformanceReport);

router.get("/dashboard/stats", protect, getDashboardStats);

router.get("/activity", protect, getAllActivityLogs);

// Dynamic Routes
router.get("/:id/comments", protect, getComments);

router.get("/:id/activity", protect, getActivityLogs);

router.get("/:id", protect, getTaskById);

// Update
router.patch("/:id", protect, updateTask);

router.patch("/:id/status", protect, updateTaskStatus);

// Comment
router.post("/:id/comment", protect, addComment);

// Delete
router.delete("/:id", protect, deleteTask);


module.exports = router;

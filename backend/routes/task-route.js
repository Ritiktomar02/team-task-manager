import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getDashboard,
} from "../controllers/task-controller.js";
import { isUser } from "../middlewares/auth-middleware.js";

const router = Router();

router.get("/dashboard", isUser, getDashboard);
router.get("/project/:projectId", isUser, getTasksByProject);

router.post("/", isUser, createTask);
router.patch("/:taskId", isUser, updateTask);
router.delete("/:taskId", isUser, deleteTask);

export default router;

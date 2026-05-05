import { Router } from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
} from "../controllers/project-controller.js";
import {
  isUser,
  isProjectMember,
  isProjectAdmin,
} from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/", isUser, createProject);
router.get("/", isUser, getMyProjects);

router.get("/:projectId", isUser, isProjectMember, getProjectById);
router.patch("/:projectId", isUser, isProjectMember, isProjectAdmin, updateProject);
router.delete("/:projectId", isUser, isProjectMember, isProjectAdmin, deleteProject);

router.post(
  "/:projectId/members",
  isUser,
  isProjectMember,
  isProjectAdmin,
  addMember,
);
router.delete(
  "/:projectId/members/:userId",
  isUser,
  isProjectMember,
  isProjectAdmin,
  removeMember,
);
router.patch(
  "/:projectId/members/:userId/role",
  isUser,
  isProjectMember,
  isProjectAdmin,
  updateMemberRole,
);

export default router;

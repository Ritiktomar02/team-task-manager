import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "../models/project-model.js";

export const isUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const resolveProjectId = (req) =>
  req.params.projectId || req.params.id || req.body.projectId;

export const isProjectMember = async (req, res, next) => {
  try {
    const projectId = resolveProjectId(req);
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const membership = project.members.find(
      (m) => m.user.toString() === req.userId,
    );
    if (!membership) {
      return res.status(403).json({ success: false, message: "Forbidden - not a project member" });
    }

    req.project = project;
    req.membership = membership;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("isProjectMember error:", error);
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isProjectAdmin = (req, res, next) => {
  if (!req.membership || req.membership.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden - admin only" });
  }
  next();
};

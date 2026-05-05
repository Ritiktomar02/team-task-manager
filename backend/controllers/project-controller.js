import mongoose from "mongoose";

import Project from "../models/project-model.js";
import Task from "../models/task-model.js";
import User from "../models/user-model.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: (description || "").trim(),
      createdBy: req.userId,
      members: [{ user: req.userId, role: "admin" }],
    });

    const populated = await Project.findById(project._id)
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(201).json({ success: true, project: populated });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("createProject error:", error);
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.userId })
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.project._id)
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(200).json({ success: true, project, role: req.membership.role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const update = {};
    if (typeof name === "string" && name.trim()) update.name = name.trim();
    if (typeof description === "string") update.description = description.trim();

    const project = await Project.findByIdAndUpdate(req.project._id, update, { new: true })
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({ project: req.project._id });
    await Project.findByIdAndDelete(req.project._id);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const exists = req.project.members.some((m) => m.user.toString() === user._id.toString());
    if (exists) {
      return res.status(400).json({ success: false, message: "User already a member" });
    }

    req.project.members.push({
      user: user._id,
      role: role === "admin" ? "admin" : "member",
    });
    await req.project.save();

    const populated = await Project.findById(req.project._id)
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(200).json({ success: true, project: populated });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("addMember error:", error);
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (req.project.createdBy.toString() === userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot remove project creator" });
    }

    req.project.members = req.project.members.filter(
      (m) => m.user.toString() !== userId,
    );
    await req.project.save();

    await Task.updateMany(
      { project: req.project._id, assignee: userId },
      { $set: { assignee: null } },
    );

    const populated = await Project.findById(req.project._id)
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(200).json({ success: true, project: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (req.project.createdBy.toString() === userId && role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Project creator must remain admin" });
    }

    const member = req.project.members.find((m) => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    member.role = role;
    await req.project.save();

    const populated = await Project.findById(req.project._id)
      .populate("createdBy", "username email picture")
      .populate("members.user", "username email picture");

    res.status(200).json({ success: true, project: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

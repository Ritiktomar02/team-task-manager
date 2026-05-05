import mongoose from "mongoose";

import Task from "../models/task-model.js";
import Project from "../models/project-model.js";

const populateTask = (query) =>
  query
    .populate("assignee", "username email picture")
    .populate("createdBy", "username email picture")
    .populate("project", "name");

const findMembership = (project, userId) =>
  project.members.find((m) => m.user.toString() === userId);

export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignee, status, priority, dueDate } = req.body;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const membership = findMembership(project, req.userId);
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can create tasks" });
    }

    if (assignee) {
      if (!mongoose.isValidObjectId(assignee)) {
        return res.status(400).json({ success: false, message: "Invalid assignee" });
      }
      const isMember = project.members.some((m) => m.user.toString() === assignee);
      if (!isMember) {
        return res
          .status(400)
          .json({ success: false, message: "Assignee must be a project member" });
      }
    }

    const task = await Task.create({
      project: project._id,
      title: title.trim(),
      description: (description || "").trim(),
      assignee: assignee || null,
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: req.userId,
    });

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("createTask error:", error);
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    if (!findMembership(project, req.userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const tasks = await populateTask(Task.find({ project: project._id }).sort({ createdAt: -1 }));
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const membership = findMembership(project, req.userId);
    if (!membership) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { title, description, assignee, status, priority, dueDate } = req.body;
    const isAdmin = membership.role === "admin";
    const isAssignee = task.assignee && task.assignee.toString() === req.userId;

    if (isAdmin) {
      if (typeof title === "string" && title.trim()) task.title = title.trim();
      if (typeof description === "string") task.description = description.trim();
      if (assignee !== undefined) {
        if (assignee === null || assignee === "") {
          task.assignee = null;
        } else {
          if (!mongoose.isValidObjectId(assignee)) {
            return res.status(400).json({ success: false, message: "Invalid assignee" });
          }
          const isMember = project.members.some((m) => m.user.toString() === assignee);
          if (!isMember) {
            return res
              .status(400)
              .json({ success: false, message: "Assignee must be a project member" });
          }
          task.assignee = assignee;
        }
      }
      if (priority && ["low", "medium", "high"].includes(priority)) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
      if (status && ["todo", "in_progress", "done"].includes(status)) task.status = status;
    } else if (isAssignee) {
      if (status && ["todo", "in_progress", "done"].includes(status)) {
        task.status = status;
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Members can only update task status" });
      }
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden - not your task" });
    }

    await task.save();
    const populated = await populateTask(Task.findById(task._id));
    res.status(200).json({ success: true, task: populated });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("updateTask error:", error);
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    const membership = findMembership(project, req.userId);
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can delete tasks" });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const projects = await Project.find({ "members.user": userObjectId }).select("_id name");
    const projectIds = projects.map((p) => p._id);

    const now = new Date();

    const [statusCounts, overdueTasks, myOpenTasks, recentTasks] = await Promise.all([
      Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      populateTask(
        Task.find({
          project: { $in: projectIds },
          dueDate: { $ne: null, $lt: now },
          status: { $ne: "done" },
        }).sort({ dueDate: 1 }),
      ),
      populateTask(
        Task.find({
          project: { $in: projectIds },
          assignee: userObjectId,
          status: { $ne: "done" },
        }).sort({ dueDate: 1, createdAt: -1 }),
      ),
      populateTask(
        Task.find({ project: { $in: projectIds } })
          .sort({ updatedAt: -1 })
          .limit(10),
      ),
    ]);

    const counts = { todo: 0, in_progress: 0, done: 0 };
    for (const row of statusCounts) {
      counts[row._id] = row.count;
    }

    res.status(200).json({
      success: true,
      dashboard: {
        projectCount: projects.length,
        statusCounts: counts,
        overdueTasks,
        myOpenTasks,
        recentTasks,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getDashboard error:", error);
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

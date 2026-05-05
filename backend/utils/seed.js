import bcrypt from "bcrypt";

import User from "../models/user-model.js";
import Project from "../models/project-model.js";
import Task from "../models/task-model.js";
import { generateAvatar } from "./generateAvatar.js";

const DEMO_PASSWORD = "Demo@123";

const DEMO_USERS = [
  { username: "Demo Admin", email: "demo.admin@example.com", role: "admin" },
  { username: "Demo Member", email: "demo.member@example.com", role: "member" },
  { username: "Sara Coder", email: "sara@example.com", role: "member" },
];

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const seedDemoData = async () => {
  const existingDemo = await User.findOne({ email: DEMO_USERS[0].email });
  if (existingDemo) return false;

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = await User.insertMany(
    DEMO_USERS.map((u) => ({
      username: u.username,
      email: u.email,
      password: hashedPassword,
      picture: generateAvatar(u.username),
    })),
  );
  const [admin, member, sara] = users;

  const project = await Project.create({
    name: "Product Launch",
    description: "Q2 launch — landing page, copy, analytics, press release.",
    createdBy: admin._id,
    members: [
      { user: admin._id, role: "admin" },
      { user: member._id, role: "member" },
      { user: sara._id, role: "member" },
    ],
  });

  await Task.insertMany([
    {
      project: project._id,
      title: "Ship press release",
      description: "Coordinate with PR for embargo release.",
      assignee: member._id,
      status: "todo",
      priority: "high",
      dueDate: daysFromNow(-2),
      createdBy: admin._id,
    },
    {
      project: project._id,
      title: "Design landing page hero",
      description: "Hero section, value prop above the fold.",
      assignee: sara._id,
      status: "in_progress",
      priority: "high",
      dueDate: daysFromNow(3),
      createdBy: admin._id,
    },
    {
      project: project._id,
      title: "Write product copy",
      description: "Marketing copy for the three pricing tiers.",
      assignee: member._id,
      status: "in_progress",
      priority: "medium",
      dueDate: daysFromNow(5),
      createdBy: admin._id,
    },
    {
      project: project._id,
      title: "Set up analytics",
      description: "GA4 + conversion tracking on signup form.",
      assignee: admin._id,
      status: "done",
      priority: "medium",
      dueDate: daysFromNow(-5),
      createdBy: admin._id,
    },
    {
      project: project._id,
      title: "Review with stakeholders",
      assignee: null,
      status: "todo",
      priority: "low",
      dueDate: daysFromNow(7),
      createdBy: admin._id,
    },
  ]);

  if (process.env.NODE_ENV === "development") {
    console.log(`Seeded demo data: ${users.length} users, 1 project, 5 tasks`);
  }
  return true;
};

export const DEMO_CREDENTIALS = {
  password: DEMO_PASSWORD,
  users: DEMO_USERS.map(({ username, email, role }) => ({ username, email, role })),
};

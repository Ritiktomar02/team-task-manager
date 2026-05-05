import bcrypt from "bcrypt";

import User from "../models/user-model.js";
import { generateAvatar } from "./generateAvatar.js";

const DEMO_PASSWORD = "Demo@123";

const DEMO_USERS = [
  { username: "Demo Admin", email: "demo.admin@example.com" },
  { username: "Demo Member", email: "demo.member@example.com" },
  { username: "Sara Coder", email: "sara@example.com" },
];

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

  if (process.env.NODE_ENV === "development") {
    console.log(`Seeded demo users: ${users.length}`);
  }
  return true;
};

export const DEMO_CREDENTIALS = {
  password: DEMO_PASSWORD,
  users: DEMO_USERS.map(({ username, email }) => ({ username, email })),
};

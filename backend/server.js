import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db-connection.js";
import { seedDemoData } from "./utils/seed.js";
import userRoute from "./routes/user-route.js";
import projectRoute from "./routes/project-route.js";
import taskRoute from "./routes/task-route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/tasks", taskRoute);

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

// Serve the built React app whenever the build artifact is present (i.e. on
// Railway). Don't gate on NODE_ENV — Railway can be flaky about exposing it
// to the runtime, and this is more robust.
const clientDist = path.resolve(__dirname, "../frontend/dist");
const hasClientBuild = fs.existsSync(path.join(clientDist, "index.html"));

if (hasClientBuild) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(
      `Server is running (no client build at ${clientDist}, NODE_ENV=${process.env.NODE_ENV || "unset"})`,
    );
  });
}

const startServer = async () => {
  await connectDB();
  try {
    await seedDemoData();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Seed failed:", err);
    }
  }

  app.listen(PORT, () => {
    console.log(
      `Server on port ${PORT} | NODE_ENV=${process.env.NODE_ENV || "unset"} | clientBuild=${hasClientBuild}`,
    );
  });
};

startServer();

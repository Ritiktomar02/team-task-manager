import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db-connection.js";
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

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
}

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer();

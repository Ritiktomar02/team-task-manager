import bcrypt from "bcrypt";

import User from "../models/user-model.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { generateAvatar } from "../utils/generateAvatar.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Some fields are missing" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters" });
    }

    const userAlreadyExists = await User.findOne({ email: email.toLowerCase() });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      picture: generateAvatar(username),
    });

    generateTokenAndSetCookies(res, user._id);

    const safeUser = await User.findById(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("register error:", error);
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Some fields are missing" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password);

    if (!passwordCheck) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    generateTokenAndSetCookies(res, existingUser._id);

    const safeUser = await User.findById(existingUser._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: safeUser,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("login error:", error);
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(200).json({ success: true, users: [] });

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const users = await User.find({
      $or: [{ username: regex }, { email: regex }],
      _id: { $ne: req.userId },
    })
      .limit(10)
      .select("username email picture");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

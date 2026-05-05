import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  searchUsers,
} from "../controllers/user-controller.js";
import { isUser } from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", isUser, profile);
router.get("/search", isUser, searchUsers);

export default router;

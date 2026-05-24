import { Router } from "express";
import {
  changePassword,
  login,
  session,
  registerAdmin,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/register-admin", registerAdmin);
authRouter.get("/session", protect, session);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;

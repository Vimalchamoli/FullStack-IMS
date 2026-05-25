import { Router } from "express";
import {
  changePassword,
  login,
  session,
  registerAdmin,
  sendOtp,
  verifyOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/verify-login-otp", verifyLoginOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/register-admin", registerAdmin);
authRouter.get("/session", protect, session);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;

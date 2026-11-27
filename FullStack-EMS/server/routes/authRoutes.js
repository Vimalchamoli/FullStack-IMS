import { Router } from "express";
import cors from "cors";

app.use(cors({
  origin: "https://fullstack-ims.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Register routes after the CORS middleware
app.use("/api/auth", authRoutes);
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

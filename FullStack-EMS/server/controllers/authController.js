import { sendOtpEmail } from "../utils/sendOtp.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login for employee and admin
// POST /api/auth/login

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    // generate 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP:", otp);

    // send email
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        otp,
        otpExpiry,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();
    }

    await sendOtpEmail(
      email,
      otp,
      "Heyy Dear.. Welcome.. Here is your register OTP",
    );

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // check all fields
    if (!email || !otp || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        error: "Account already exists. Please login with new Gmail.",
      });
    }

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // check otp
    if (user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // check otp expiry
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user
    user.password = hashedPassword;

    user.isVerified = true;

    // remove otp
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user.isVerified) {
      return res.status(401).json({
        error: "Please verify your account first",
      });
    }

    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({
        error:
          "No admin account found in this Email.. please try another gamil.. Thank You",
      });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({
        error:
          "No employee account found in this Email. please try another gamil.. Thank You",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // const payload = {
    //   userId: user._id.toString(),
    //   role: user.role,
    //   email: user.email,
    // };

    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    // return res.json({ user: payload, token });

    // generate login otp
    // const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // // save otp
    // user.loginOtp = loginOtp;

    // user.loginOtpExpiry = Date.now() + 5 * 60 * 1000;

    // await user.save();

    // // send otp email
    // await sendOtpEmail(
    //   user.email,
    //   loginOtp,
    //   "Hey.. Dear! Thank you for visiting again.. Here is your Login OTP",
    // );

    // return res.json({
    //   success: true,
    //   requiresOtp: true,
    //   message: "OTP sent to your email",
    // });

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      user: payload,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};
// verify the otp during login session
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // check otp
    if (user.loginOtp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // check expiry
    if (user.loginOtpExpiry < Date.now()) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // clear otp
    user.loginOtp = null;
    user.loginOtpExpiry = null;

    await user.save();

    // generate jwt
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      user: payload,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "OTP verification failed",
    });
  }
};

// email generate reset otp → save in DB → send email

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // generate otp
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // save otp
    user.resetOtp = resetOtp;

    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // send email
    await sendOtpEmail(
      user.email,
      resetOtp,
      "Someone is trying to reset your Employee Management System's Password. If its not you, just change your password immideately",
    );

    return res.json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to send reset OTP",
    });
  }
};

// email + otp + newPassword → verify otp → hash password → save new password

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // verify otp
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // check expiry
    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    user.password = hashedPassword;

    // clear otp
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to reset password",
    });
  }
};
// Get session for employee and admin
// GET /api/auth/session
export const session = (req, res) => {
  const session = req.session;
  return res.json({ user: session });
};

// Change password for employee and admin
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const session = req.session;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }
    const user = await User.findById(session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      return res.status(400).json({ error: "Current password is incorrect" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(session.userId, { password: hashed });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to change password" });
  }
};

// Register new admin
// POST /api/auth/register-admin
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with ADMIN role
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register admin error:", error);
    return res.status(500).json({ error: "Failed to create admin account" });
  }
};

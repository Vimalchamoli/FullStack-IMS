import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp, purpose = "REGISTER") => {
  const subject =
    purpose === "LOGIN"
      ? "Login Verification OTP"
      : purpose === "RESET_PASSWORD"
        ? "Password Reset OTP"
        : "Account Verification OTP";

  const message =
    purpose === "LOGIN"
      ? "You are trying to login to your EMS account."
      : purpose === "RESET_PASSWORD"
        ? "You requested to reset your EMS account password."
        : "Please verify your EMS account registration.";

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,

    subject,

    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>EMS Security Verification</h2>

        <p>${message}</p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>If this was not you, please ignore this email.</p>
      </div>
    `,
  });
};

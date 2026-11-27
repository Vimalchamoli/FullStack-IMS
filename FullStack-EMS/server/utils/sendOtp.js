// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },

//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,

//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// export const sendOtpEmail = async (email, otp, purpose = "REGISTER") => {
//   const subject =
//     purpose === "LOGIN"
//       ? "Login Verification OTP"
//       : purpose === "RESET_PASSWORD"
//         ? "Password Reset OTP"
//         : "Account Verification OTP";

//   const message =
//     purpose === "LOGIN"
//       ? "You are trying to login to your EMS account."
//       : purpose === "RESET_PASSWORD"
//         ? "You requested to reset your EMS account password."
//         : "Please verify your EMS account registration.";

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,

//     subject,

//     html: `
//       <div style="font-family: Arial; padding: 20px;">
//         <h2>EMS Security Verification</h2>

//         <p>${message}</p>

//         <h1 style="letter-spacing: 5px;">
//           ${otp}
//         </h1>

//         <p>This OTP will expire in 5 minutes.</p>

//         <p>If this was not you, please ignore this email.</p>
//       </div>
//     `,
//   });
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOtpEmail = async (email, otp, purpose = "REGISTER") => {
  try {
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
     from: process.env.EMAIL_FROM,
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

    console.log("OTP email sent successfully");
  } catch (error) {
  console.error("SMTP ERROR:", error.message);
  throw error;
}
};

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

export const sendOtpEmail = async (email, otp, purpose = "REGISTER") => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const subject =
    purpose === "LOGIN"
      ? "Login Verification OTP"
      : purpose === "RESET_PASSWORD"
        ? "Password Reset OTP"
        : "Account Verification OTP";

  const message =
    purpose === "LOGIN"
      ? "You are trying to log in to your EMS account."
      : purpose === "RESET_PASSWORD"
        ? "You requested to reset your EMS account password."
        : "Please verify your EMS account registration.";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "EMS",
        email: process.env.EMAIL_FROM,
      },
      to: [{ email }],
      subject,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>EMS Security Verification</h2>
          <p>${message}</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If this was not you, please ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Brevo API error:", response.status, details);
    throw new Error(`Brevo API failed with status ${response.status}`);
  }

  console.log("OTP email accepted by Brevo");
};

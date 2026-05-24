// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     otp: String,

//     otpExpiry: Date,

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     email: { type: String,
//              required: true,
//              unique: true },

//     password: { type: String,
//                },
//     role: { type: String, enum: ["ADMIN", "EMPLOYEE"], default: "EMPLOYEE" },
//   },
//   { timestamps: true },
// );

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
    },

    otp: String,

    otpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

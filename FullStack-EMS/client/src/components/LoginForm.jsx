import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   try {
  //     if (isRegistering) {
  //       // STEP 1 → send otp
  //       //   if (!otpSent) {
  //       //     const response = await api.post("/auth/send-otp", {
  //       //       email,
  //       //     });

  //       //     toast.success(response.data.message);

  //       //     setOtpSent(true);
  //       //   }

  //       //   // STEP 2 → verify otp
  //       //   else {
  //       //     const response = await api.post("/auth/verify-otp", {
  //       //       email,
  //       //       otp,
  //       //       password,
  //       //     });

  //       //     toast.success(response.data.message);

  //       //     setOtp("");
  //       //     setPassword("");
  //       //     setEmail("");

  //       //     setOtpSent(false);
  //       //     setIsRegistering(false);
  //       //   }
  //       // } else if (isForgotPassword) {
  //       //   // STEP 1 → send reset otp
  //       //   if (!otpSent) {
  //       //     const response = await api.post("/auth/forgot-password", {
  //       //       email,
  //       //     });

  //       //     toast.success(response.data.message);

  //       //     setOtpSent(true);
  //       //   }

  //       //   // STEP 2 → reset password
  //       //   else {
  //       //     const response = await api.post("/auth/reset-password", {
  //       //       email,
  //       //       otp,
  //       //       newPassword,
  //       //     });

  //       //     toast.success(response.data.message);

  //       //     setOtp("");
  //       //     setNewPassword("");

  //       //     setOtpSent(false);

  //       //     setIsForgotPassword(false);
  //       //   }
  //       // } else {
  //       //   // STEP 1 → send login otp
  //       //   if (!otpSent) {
  //       //     const response = await api.post("/auth/login", {
  //       //       email,
  //       //       password,
  //       //       role_type: role,
  //       //     });

  //       //     toast.success(response.data.message);

  //       //     setOtpSent(true);
  //       //   }

  //       //   // STEP 2 → verify login otp
  //       //   else {
  //       //     const response = await api.post("/auth/verify-login-otp", {
  //       //       email,
  //       //       otp,
  //       //     });

  //       //     localStorage.setItem("token", response.data.token);

  //       //     toast.success("Login successful");

  //       //     window.location.href = "/dashboard";
  //       //   }

  //       const response = await api.post("/auth/login", {
  //         email,
  //         password,
  //         role_type: role,
  //       });

  //       localStorage.setItem("token", response.data.token);

  //       toast.success("Login successful");

  //       window.location.href = "/dashboard";
  //     }
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.error ||
  //         error.message ||
  //         (isRegistering ? "Registration failed" : "Login failed"),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // REGISTER
      // if (isRegistering) {
      //   if (!otpSent) {
      //     const response = await api.post("/auth/send-otp", {
      //       email,
      //     });

      //     toast.success(response.data.message);

      //     setOtpSent(true);
      //   } else {
      //     const response = await api.post("/auth/verify-otp", {
      //       email,
      //       otp,
      //       password,
      //     });

      //     toast.success(response.data.message);

      //     setOtp("");
      //     setPassword("");
      //     setEmail("");

      //     setOtpSent(false);

      //     setIsRegistering(false);
      //   }
      // }
      if (isRegistering) {
        const response = await api.post("/auth/register-admin", {
          email,
          password,
        });

        toast.success("Admin account created successfully");

        setIsRegistering(false);

        setEmail("");

        setPassword("");
      }

      // FORGOT PASSWORD
      else if (isForgotPassword) {
        if (!otpSent) {
          const response = await api.post("/auth/forgot-password", {
            email,
          });

          toast.success(response.data.message);

          setOtpSent(true);
        } else {
          const response = await api.post("/auth/reset-password", {
            email,
            otp,
            newPassword,
          });

          toast.success(response.data.message);

          setOtp("");
          setNewPassword("");

          setOtpSent(false);

          setIsForgotPassword(false);
        }
      }

      // DIRECT LOGIN
else {
  if (!otpSent) {
    const response = await api.post("/auth/login", {
      email,
      password,
      role_type: role,
    });

    toast.success(response.data.message || "OTP sent to your email");
    setOtpSent(true);
  } else {
    const response = await api.post("/auth/verify-login-otp", {
      email,
      otp,
    });

    localStorage.setItem("token", response.data.token);
    toast.success("Login successful");
    window.location.href = "/dashboard";
  }
}
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          (isRegistering ? "Registration failed" : "Login failed"),
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-cover bg-center relative bg-slate-900"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url('/login_bg.jpg')",
      }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl p-6 sm:p-10 animate-fade-in relative z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-xs mb-6 transition-colors"
        >
          <ArrowLeftIcon size={14} /> Back to portals
        </Link>

        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-3">
            <span className="text-white font-bold text-lg tracking-wider">
              EMS
            </span>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {isRegistering ? "Create Admin ID" : title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            {isRegistering
              ? "Sign up to create a new administrator account"
              : subtitle}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="group">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 group-focus-within:text-indigo-600 transition-colors">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className="transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md focus:shadow-indigo-500/10 hover:border-slate-300"
            />
          </div>
          <div className="group">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 group-focus-within:text-indigo-600 transition-colors">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-11 transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md focus:shadow-indigo-500/10 hover:border-slate-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>
          {!isRegistering && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setOtpSent(false);
                  setOtp("");
                }}
                className="text-sm text-indigo-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

         {otpSent && (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
      Enter OTP
    </label>
    <input
      type="text"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      required
      placeholder="Enter 6 digit OTP"
    />
  </div>
)}

          {isForgotPassword && otpSent && (
            <div className="group">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </div>
          )}

         <button
  type="submit"
  disabled={loading}
  className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] flex items-center justify-center cursor-pointer"
>
  {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
  {isRegistering
    ? "Create Account"
    : isForgotPassword
      ? otpSent
        ? "Reset Password"
        : "Send Reset OTP"
      : otpSent
        ? "Verify Login OTP"
        : "Sign in"}
</button>
        </form>

        {role === "admin" && (
          <div className="mt-6 text-center text-sm text-slate-500">
            {isRegistering ? (
              <>
                Already have an admin ID?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError("");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an admin ID?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError("");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-semibold cursor-pointer"
                >
                  Create one
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

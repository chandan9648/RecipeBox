import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axios.jsx";

// OTP Verification Component
const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const location = useLocation();
  const navigate = useNavigate();

  const storedEmail = useMemo(
    () => localStorage.getItem("pendingVerifyEmail"),
    []
  );

  useEffect(() => {
    const passedEmail = location?.state?.email;
    const finalEmail = passedEmail || storedEmail;
    if (finalEmail) setEmail(String(finalEmail));
  }, [location?.state?.email, storedEmail]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const isExpired = secondsLeft <= 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const countdownText = `${minutes}:${seconds}`;

  const verify = async (e) => {
    e?.preventDefault?.();
    if (!email) return toast.error("Email missing. Please register again.");
    if (!otp) return toast.error("Please enter OTP");
    if (isExpired) return toast.error("OTP expired. Please register again.");

    try {
      setLoading(true);
      const res = await api.post(
        "auth/verify-otp",
        { email, otp },
        { skipAuth: true }
      );
      toast.success(res?.data?.message || "Verified!");
      localStorage.removeItem("pendingVerifyEmail");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-400 text-black">
      <div className="shadow-lg rounded-xl p-8 w-full max-w-md bg-red-300">
        <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>
        <p className="text-sm text-center text-black/70 mb-6">
          Enter the OTP sent to your email.
        </p>

        <div className="text-sm text-center mb-4">
          <span className="text-black/70">Time left: </span>
          <span className={isExpired ? "font-semibold text-red-700" : "font-semibold"}>
            {countdownText}
          </span>
        </div>

        <form onSubmit={verify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly={!!(location?.state?.email || storedEmail)}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isExpired}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying..." : isExpired ? "OTP Expired" : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;


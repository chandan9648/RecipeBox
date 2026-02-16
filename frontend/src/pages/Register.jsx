import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/axios.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await api.post(
        "auth/register",
        { name, email, password, role },
        { skipAuth: true }
      );

      toast.success(res.data.message);
      localStorage.setItem("pendingVerifyEmail", email);
      navigate("/verify-otp", { state: { email } });

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

//   // OTP Verification Component
//   const VerifyOtp = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");

//   const verify = async () => {
//     await axios.post("/api/auth/verify-otp", {
//       email,
//       otp
//     });

//     alert("Verified!");
//   };

//   return (
//     <>
//       <input onChange={e => setEmail(e.target.value)} />
//       <input onChange={e => setOtp(e.target.value)} />
//       <button onClick={verify}>Verify</button>
//     </>
//   );
// };



  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-400 text-black">

      <div className=" shadow-lg rounded-xl p-8 w-full max-w-md bg-red-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm "
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm "
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
            />

            {/* Eye icon toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-700 hover:text-gray-900"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Have an account?{" "}
          <NavLink to="/login" className="text-indigo-600 hover:underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};



export default Register;

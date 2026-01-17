import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {Eye, EyeOff} from "lucide-react";
import { useAuth } from "../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading, ] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth() || {};

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  
      const res = await axios.post("https://recipebox-gi57.onrender.com/api/auth/login", {
       email, password
      });

  toast.success(res.data.message);
  if (setToken) setToken(res.data.token);
  if (setUser) setUser(res.data.user);
  const from = location?.state?.from;
  const role = res?.data?.user?.role;
  navigate(from || (role === "admin" ? "/admin" : "/"));

  }catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
  }finally {
      setLoading(false);
  }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-400 text-black">
   
      <div className=" shadow-lg rounded-xl p-8 w-full max-w-md bg-red-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
    
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <NavLink to="/register" className="text-indigo-600 hover:underline">
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};



export default Login;

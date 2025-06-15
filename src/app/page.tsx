"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Image from "next/image";
import logo from "../../public/jbworks_logo.png";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import sha256 from "sha256";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("authToken");
  const user = Cookies.get("user");

  useEffect(() => {
    if (user || token) {
      router.push("/user/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Logging in with", { username, password });
    setLoading(!loading);
    try {
      const reqBody = {
        email: username.trim().toLowerCase(),
        pass: sha256(password), // Ensure correct hash format
      };

      const { data } = await axiosInstance.post("/ai/auth/signin", reqBody);

      if (data) {
        toast.success("Login Successful");

        // Setting cookies
        Cookies.set("authToken", data.token, { expires: 7, path: "/" });
        Cookies.set("user", JSON.stringify(data.user), {
          expires: 7,
          path: "/",
        });

        // Redirecting to Dashboard
        router.push("/user/dashboard");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="p-4 flex justify-center">
          <Image src={logo} alt="logo" width={100} priority={true} />
        </div>

        <div className=" bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

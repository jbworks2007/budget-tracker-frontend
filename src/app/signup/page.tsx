"use client";

import { useState } from "react";
import Link from "next/link";
import validator from "validator";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import FullScreenLoader from "@/components/misc/FullScreenLoader";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setLoading(!loading);
    try {
      const reqBody = {
        name: fullName,
        email: email,
        pass: confirmPassword,
      };
      const { data } = await axiosInstance.post("/ai/auth/signup", reqBody);
      toast.success("Registration successful");

      // add budget for new user
      await axiosInstance.post("/ai/user-budget/create-user-budget", {
        userId: data.user._id,
        amount: 200,
      });
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Something went wrong, please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = [];

    if (!validator.isLength(fullName, { min: 3 })) {
      validationErrors.push("Full name must be at least 3 characters.");
    }

    if (!validator.isEmail(email)) {
      validationErrors.push("Invalid email address.");
    }

    if (!validator.isStrongPassword(password, { minLength: 6 })) {
      validationErrors.push("Password must be at least 6 characters and strong.");
    }

    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors([]);
      console.log("Signup data:", { fullName, email, password });
      registerUser();
    }
  };

  const handleGoogleLogin = () => {
    console.log("Redirect to Google OAuth");
    // Your Google login logic here
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Create Your Account</h2>

          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              <ul className="list-disc pl-4">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm whitespace-nowrap">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

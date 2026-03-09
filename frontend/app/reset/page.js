"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Reset = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Confirm Password do not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/users/new-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            password: password,
          }),
        }
      );

      let data = await res.json();

      if (!res.ok) {
        toast.error(`Password reset failed: ${data.error}`);
      } else {
        localStorage.removeItem("email");
        toast.success(
          "Password reset successfully! Please login with your new password."
        );
        router.push(`/Sign_in`);
      }
    } catch (err) {
      toast.error(
        `Password reset failed: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-gray-800 mb-6"
        >
          Reset Your Password
        </motion.h2>

        <div className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="Enter new password"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="mt-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Reset Password
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
};

export default Reset;
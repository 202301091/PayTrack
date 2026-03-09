"use client";

import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useState } from "react";
const Add_User = ({ onClose }) => {
  const [email, setEmail] = useState("");

  const Adding = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/connections/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ user2: email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add user");
        onClose();
        return;
      } else {
        toast.success(data.message || "User added successfully");
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute  inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="
          fixed z-50
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[90%] max-w-lg
          bg-white/70 backdrop-blur-xl
          border border-white/30
          rounded-2xl
          shadow-2xl
          p-6
          flex flex-col gap-6
        "
        onClick={(e) => e.stopPropagation()} // prevents overlay click
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            Add User
          </h1>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              mt-2 w-full px-4 py-3 rounded-xl
              bg-white/80
              border border-slate-200
              focus:outline-none focus:ring-2 focus:ring-indigo-400
              transition
            "
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              toast.info("Adding user...");
              Adding();
              // Call API to add user here
            }}
            className="
              w-1/2 py-3 rounded-xl
              bg-gradient-to-r from-indigo-500 to-sky-500
              text-white font-semibold
              shadow-md hover:shadow-lg
            "
          >
            Add User
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Add_User;
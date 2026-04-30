"use client";

import React, { useEffect, useState, useRef } from "react";
import Details from "../../../components/Details";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { set } from "mongoose";
const Dashboard = () => {
  const [Data, setData] = useState({
    email: "",
    username: "",
    profile_pic: "",
    razorpay_id: "",
    razorpay_secret: "",
  });
  const [originalData, setOriginalData] = useState({
    email: "",
    username: "",
    profile_pic: "",
    razorpay_id: "",
    razorpay_secret: "",
  });
  const formRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/Sign_in");
      return;
    }
    fetchDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        // 👉 reset to original data
        setData(originalData);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [originalData]);


  const fetchDetails = async () => {
    // Chack the username has no space
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/users/details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch user details");
        return;
      }

      setData(data.data);
      setOriginalData(data.data);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (Data.username.includes(" ")) {
      toast.error("Username cannot contain spaces");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(Data),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Update failed");
        return;
      }
      setData(data.data);
      setOriginalData(data.data);
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("profile_pic", data.data.profile_pic);
      toast.success("profile updated successfully 🎉");
    } catch (error) {
      toast.error(error.message || "Update error");
    }
  };

  return (
    <div className="flex min-h-screen justify-center">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setShowDetails(true)}
        className="lg:hidden absolute top-1 left-4 z-40 bg-indigo-500 text-white px-3 py-2 rounded-lg shadow"
      >
        ☰
      </button>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <Details />
      </div>

      {/* MOBILE SIDEBAR */}
      {showDetails && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDetails(false)}
          ></div>

          {/* sidebar */}
          <div className="relative z-50 no-scrollbar h-full">
            <Details />

            {/* close button */}
            <button
              onClick={() => setShowDetails(false)}
              className="fixed top-4 left-[75vw] sm:left-[40vw] z-[100] bg-red-500 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          lg:w-[80vw]
          w-[95vw]
          p-2
          sm:p-8
          mt-10 lg:mt-0
          flex justify-center
          items-center
        "
      >
        <div
          ref={formRef}
          className="
            w-full max-w-2xl
            bg-white/60 backdrop-blur-md
            border border-white/30
            rounded-2xl
            shadow-xl
            sm:p-8
            p-2
            flex flex-col sm:gap-6 gap-3
          "
        >
          {/* Header */}
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">
              Welcome, {originalData.username}👋
            </h1>
            <p className="text-slate-500">{Data.email}</p>
          </div>

          {/* Form */}
          <div className="grid text-sm sm:text-md grid-cols-1 sm:gap-4 gap-2">
            <Input
              label="Username"
              name="username"
              value={Data.username}
              onChange={handleChange}
            />

            <Input
              label="profile Image URL"
              name="profile_pic"
              value={Data.profile_pic}
              onChange={handleChange}
            />

            <Input
              label="Razorpay ID"
              name="razorpay_id"
              value={Data.razorpay_id}
              type="password"
              onChange={handleChange}
            />

            <Input
              label="Razorpay Secret"
              name="razorpay_secret"
              value={Data.razorpay_secret}
              onChange={handleChange}
              type="password"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSubmit()}
            className="
              mt-4
              w-full py-3 rounded-xl
              bg-gradient-to-r from-indigo-500 to-sky-500
              text-white font-semibold
              shadow-md hover:shadow-lg
              transition
            "
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

/* 🔹 Reusable Input Component */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-slate-600 font-medium">
      {label}
    </label>
    <input
      {...props}
      className="
        px-4 py-2 rounded-xl
        bg-white/70
        border border-slate-200
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        transition
      "
    />
  </div>
);